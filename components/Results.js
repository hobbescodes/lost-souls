import { useMoralis } from "react-moralis";
import NftCard from "./NftCard";
import Loader from "./Loader";
import { useRecoilState } from "recoil";
import { nftsState } from "../atoms/NftsAtom";
import { limitState } from "../atoms/LimitAtom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { totalQuarksState } from "../atoms/QuarksAtom";

function Results() {
  const [limit, setLimit] = useRecoilState(limitState);
  const [totalQuarks, setTotalQuarks] = useRecoilState(totalQuarksState);
  const [nft, setNft] = useRecoilState(nftsState);
  // const [uniqueOwners, setUniqueOwners] = useState([]);
  const { Moralis } = useMoralis();

  function updateLimit() {
    setLimit(limit + 18);
  }

  // TODO: GET TOTAL OWNERS
  // const getNFTOwners = async () => {
  //   await Moralis.start({
  //     serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  //     appId: process.env.NEXT_PUBLIC_APP_ID,
  //   });

  //   let offset = 0;
  //   let pageSize = 500;
  //   let allOwners = [];
  //   const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  //   for (let i = 0; i < 20; i++) {
  //     const options = {
  //       address: "0x0FB69D1dC9954a7f60e83023916F2551E24F52fC",
  //       offset: offset,
  //       limit: 500,
  //     };
  //     const nftOwners = await Moralis.Web3API.token.getNFTOwners(options);
  //     await timer(1000);
  //     for (let i = 0; i < nftOwners.result.length; i++) {
  //       allOwners.push(nftOwners.result[i].owner_of);
  //     }
  //     // console.log(allOwners);
  //     offset += pageSize;
  //   }

  //   let uniqueOwners = [];
  //   allOwners.forEach((owner) => {
  //     if (!uniqueOwners.includes(owner)) {
  //       uniqueOwners.push(owner);
  //     }
  //   });

  //   setUniqueOwners(uniqueOwners);
  // };

  const allNFTs = async () => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });
    const nfts = await Moralis.Cloud.run("LostSouls");

    let allNFTs = nfts;
    setNft(allNFTs);
  };

  useEffect(() => {
    allNFTs();
    // getNFTOwners();
    setTotalQuarks(0);
  }, []);

  return (
    <div className="relative mx-auto mb-12 flex flex-col items-center space-y-4">
      {/* {uniqueOwners.length > 0 ? (
        <div className="relative">Owners: {uniqueOwners.length}</div>
      ) : (
        <div className="relative">
          <p>Owners: Loading...</p>
        </div>
      )} */}

      {nft != undefined ? (
        <>
          {totalQuarks != 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center">
              <p>Total Quarks: </p>
              <p>
                {totalQuarks.toString().length < 7
                  ? totalQuarks / 1000 + " K"
                  : (totalQuarks / 1000000).toFixed(3) + " M"}
              </p>
            </div>
          ) : null}
          {nft.length > 0 ? (
            <>
              <div
                className={`justify-center p-4 ${
                  nft.length > 1 &&
                  "grid max-w-[1500px] flex-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex"
                }`}
              >
                {nft.slice(0, limit).map((nft) => (
                  <NftCard key={nft.id} nft={nft} />
                ))}
              </div>
              <div
                className={`relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer ${
                  nft.length <= 1 && "hidden"
                }`}
              >
                <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
                <button
                  className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
                  onClick={() => updateLimit()}
                >
                  Load More
                </button>
              </div>
            </>
          ) : (
            <div className="m-4 inline-flex max-w-xl flex-col items-center justify-center space-y-4">
              <p className="p-4 text-center font-bold">
                Sorry, there seems to be something wrong. It could be a few
                different things:
              </p>
              <p className="p-4 text-center">
                1: You entered an Invalid Token ID, an Invalid Wallet Address,
                or an Invalid ENS domain. In that case, please try again!
              </p>

              <p className="p-4 text-center">
                2: The Wallet Address/ENS domain you have entered doesnt
                currently own a Lost Soul. If this is the case, and it is you
                address/ENS domain, head to{" "}
                <span className="text-blue-500">
                  <a
                    rel="noreferrer"
                    href="https://opensea.io/collection/lostsoulssanctuary"
                    className="focus:outline-none"
                    target="_blank"
                  >
                    OpenSea
                  </a>
                </span>{" "}
                to pick one up and join the SoulFam!
              </p>

              <div>
                <Image
                  src="https://gateway.ipfs.io/ipfs/QmYXWWQtJuwmng4qVeDAJQ5T9S1Ybm9zk8vEEXZ3GwREQ7"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default Results;
