import fetch from "node-fetch";
import Moralis from "moralis/node.js";

const serverUrl = ""; //Server URL Here
const appId = ""; //App ID here
Moralis.start({ serverUrl, appId });

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

const collectionAddress = ""; //Collection Address Here
const collectionName = ""; //Collection Name Here

async function generateRarity() {
  const NFTs = await Moralis.Web3API.token.getAllTokenIds({
    address: collectionAddress,
  });

  let totalNum = NFTs.total;
  const pageSize = NFTs.page_size;
  console.log(totalNum);
  console.log(pageSize);
  let allNFTs = NFTs.result;

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let i = pageSize; i < totalNum; i = i + pageSize) {
    const NFTs = await Moralis.Web3API.token.getAllTokenIds({
      address: collectionAddress,
      offset: i,
    });
    allNFTs = allNFTs.concat(NFTs.result);
    await timer(6000); //avoid rate limits
    console.log(i);
  }

  let metadata = await Promise.all(
    allNFTs.map(async (e) => {
      if (e.metadata) {
        return JSON.parse(e.metadata).attributes;
      } else {
        const response = await fetch(e.token_uri, { method: "GET" });
        const data = await response.json();
        return data.attributes;
      }
    })
  );

  console.log(metadata);

  let tally = { TraitCount: {} };

  for (let j = 0; j < metadata.length; j++) {
    let nftTraits = metadata[j].map((e) => e.trait_type);
    let nftValues = metadata[j].map((e) => e.value);

    let numOfTraits = nftTraits.length;

    if (tally.TraitCount[numOfTraits]) {
      tally.TraitCount[numOfTraits]++;
    } else {
      tally.TraitCount[numOfTraits] = 1;
    }

    for (let i = 0; i < nftTraits.length; i++) {
      let current = nftTraits[i];
      if (tally[current]) {
        tally[current].occurences++;
      } else {
        tally[current] = { occurences: 1 };
      }

      let currentValue = nftValues[i];
      if (tally[current][currentValue]) {
        tally[current][currentValue]++;
      } else {
        tally[current][currentValue] = 1;
      }
    }
  }

  //Weights can/should differ by collection. The weights shown are used to match with Rarity Tools for Lost Souls
  const collectionAttributes = Object.keys(tally);
  let nftArr = [];
  for (let j = 0; j < metadata.length; j++) {
    let current = metadata[j];
    let totalRarity = 0;
    for (let i = 0; i < current.length; i++) {
      let rarityScore =
        1 / (tally[current[i].trait_type][current[i].value] / totalNum);
      if (current[i].trait_type === "Background") {
        current[i].rarityScore = 0.689655 * rarityScore;
      } else if (current[i].trait_type === "Body") {
        current[i].rarityScore = 0.740741 * rarityScore;
      } else if (current[i].trait_type === "Headware") {
        current[i].rarityScore = 0.298507 * rarityScore;
      } else if (current[i].trait_type === "Face") {
        current[i].rarityScore = 0.289855 * rarityScore;
      } else {
        current[i].rarityScore = 0.20202 * rarityScore;
      }

      totalRarity += current[i].rarityScore;
    }

    //Multiplied by zero for Lost Souls because each trait appears in each NFT. Can weight it differently if number of traits differ between NFTs
    let rarityScoreNumTraits =
      (1 / (tally.TraitCount[Object.keys(current).length] / totalNum)) * 0;
    current.push({
      trait_type: "TraitCount",
      value: Object.keys(current).length,
      rarityScore: rarityScoreNumTraits,
    });
    totalRarity += rarityScoreNumTraits;

    if (current.length < collectionAttributes.length) {
      let nftAttributes = current.map((e) => e.trait_type);
      let absent = collectionAttributes.filter(
        (e) => !nftAttributes.includes(e)
      );

      absent.forEach((type) => {
        let rarityScoreNull =
          1 / ((totalNum - tally[type].occurences) / totalNum);
        current.push({
          trait_type: type,
          value: null,
          rarityScore: rarityScoreNull,
        });
        totalRarity += rarityScoreNull;
      });
    }

    if (allNFTs[j]?.metadata) {
      allNFTs[j].metadata = JSON.parse(allNFTs[j].metadata);
      allNFTs[j].image = resolveLink(allNFTs[j].metadata?.image);
    } else if (allNFTs[j].token_uri) {
      try {
        await fetch(allNFTs[j].token_uri)
          .then((response) => response.json())
          .then((data) => {
            allNFTs[j].image = resolveLink(data.image);
          });
      } catch (error) {
        console.log(error);
      }
    }

    nftArr.push({
      Attributes: current,
      Rarity: totalRarity,
      token_id: allNFTs[j].token_id,
      image: allNFTs[j].image,
    });
  }

  nftArr.sort((a, b) => b.Rarity - a.Rarity);

  //Specific for Lost Souls
  for (let i = 0; i < nftArr.length; i++) {
    nftArr[i].Rank = i + 1;

    if (nftArr[i].Rank < 22) {
      nftArr[i].rarityClass = "Super Rare";
      nftArr[i].Quarks = 400000;
    } else if (nftArr[i].Rank >= 22 && nftArr[i].Rank < 1402) {
      nftArr[i].rarityClass = "Rare";
      nftArr[i].Quarks = 100000;
    } else if (nftArr[i].Rank >= 1402 && nftArr[i].Rank < 5001) {
      nftArr[i].rarityClass = "Uncommon";
      nftArr[i].Quarks = 10000;
    } else {
      nftArr[i].rarityClass = "Common";
      nftArr[i].Quarks = 5000;
    }

    const newClass = Moralis.Object.extend(collectionName);
    const newObject = new newClass();

    newObject.set("attributes", nftArr[i].Attributes);
    newObject.set("rarity", nftArr[i].Rarity);
    newObject.set("tokenId", nftArr[i].token_id);
    newObject.set("rank", nftArr[i].Rank);
    newObject.set("image", nftArr[i].image);
    newObject.set("class", nftArr[i].rarityClass);
    newObject.set("quarks", nftArr[i].Quarks);

    await newObject.save();
    console.log(i);
  }
}

generateRarity();
