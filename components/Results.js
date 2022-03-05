import { useMoralis } from "react-moralis";
import NftCard from "./NftCard";
import Loader from "./Loader";
import { useRecoilState } from "recoil";
import { nftsState } from "../atoms/NftsAtom";
import { limitState } from "../atoms/LimitAtom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { totalQuarksState } from "../atoms/QuarksAtom";
import { totalLandState } from "../atoms/LandAtom";

function Results() {
  const [limit, setLimit] = useRecoilState(limitState);
  const [totalQuarks, setTotalQuarks] = useRecoilState(totalQuarksState);
  const [totalLand, setTotalLand] = useRecoilState(totalLandState);
  const [nft, setNft] = useRecoilState(nftsState);
  const [collectionStats, setCollectionStats] = useState(null);
  const [commonPrice, setCommonPrice] = useState("");
  const [uncommonPrice, setUncommonPrice] = useState("");
  const [rarePrice, setRarePrice] = useState("");
  const [superRarePrice, setSuperRarePrice] = useState("");
  const { Moralis } = useMoralis();

  //Updates the limit of NFTs displayed
  function updateLimit() {
    setLimit(limit + 10);
  }

  //Queries full database to get all NFTs in the collection
  const allNFTs = async () => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });
    const nfts = await Moralis.Cloud.run("LostSouls");

    let allNFTs = nfts;
    setNft(allNFTs);
  };

  //Uses OpenSea API to collect stats about the Lost Souls Sanctuary collection
  const collectStats = () => {
    const options = { method: "GET", headers: { Accept: "application/json" } };

    fetch(
      "https://api.opensea.io/api/v1/collection/lostsoulssanctuary/stats",
      options
    )
      .then((response) => response.json())
      .then((response) => setCollectionStats(response))
      .catch((err) => console.error(err));
  };

  //Fetch floor prices for each rarity class using the Ecto API
  const rarityPrices = () => {
    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/pricing`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        //console.log(response);
        setCommonPrice(response.commonPrice.price);
        setUncommonPrice(response.uncommonPrice.price);
        setRarePrice(response.rarePrice.price);
        setSuperRarePrice(response.superPrice.price);
      })
      .catch((err) => console.error(err));
  };

  //Fetch all NFTs, (re)initializes quarks, and collects stats on mount
  useEffect(() => {
    allNFTs();
    setTotalQuarks(0);
    setTotalLand(0);
    collectStats();
    rarityPrices();
  }, []);

  return (
    <div className="relative mx-auto mb-12 flex flex-col items-center space-y-4">
      {nft != undefined ? (
        <>
          {totalQuarks != 0 ? (
            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
                  <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[16px] dark:bg-[#6a3fe4]">
                    Total Quarks
                  </p>
                  <div className="flex space-x-2 p-2">
                    <p>
                      {totalQuarks.toString().length < 7
                        ? totalQuarks / 1000 + " K"
                        : (totalQuarks / 1000000).toFixed(3) + " M"}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
                  <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[16px] dark:bg-[#6a3fe4]">
                    Available Land
                  </p>
                  <div className="flex space-x-2 p-2">
                    <p>{totalLand}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {nft.length > 1 ? (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
                        <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[16px] dark:bg-[#6a3fe4]">
                          Holders
                        </p>
                        <div className="flex space-x-2 p-2">
                          <p>{collectionStats.stats.num_owners}</p>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
                        <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[22px] dark:bg-[#6a3fe4]">
                          Common
                        </p>
                        <div className="flex space-x-2 p-2">
                          {commonPrice != "None-listed" ? (
                            <>
                              <Image
                                className=""
                                src="/images/eth-logo.png"
                                width={15}
                                height={15}
                              />
                              <p className="">{commonPrice}</p>
                            </>
                          ) : (
                            <p className="">None Listed</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
                        <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[16px] dark:bg-[#6a3fe4]">
                          Uncommon
                        </p>
                        <div className="flex space-x-2 p-2">
                          {uncommonPrice != "None-listed" ? (
                            <>
                              <Image
                                className=""
                                src="/images/eth-logo.png"
                                width={15}
                                height={15}
                              />
                              <p className="">{uncommonPrice}</p>
                            </>
                          ) : (
                            <p className="">None Listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="mt-0 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4] md:mt-8">
                        <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[26px] dark:bg-[#6a3fe4]">
                          Rare
                        </p>
                        <div className="flex space-x-2 p-2">
                          {rarePrice != "None-listed" ? (
                            <>
                              <Image
                                className=""
                                src="/images/eth-logo.png"
                                width={15}
                                height={15}
                              />
                              <p className="">{rarePrice}</p>
                            </>
                          ) : (
                            <p className="">None Listed</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-0 flex flex-col items-center justify-center rounded-lg border border-[#14aed0] dark:border-[#6a3fe4] md:mt-8">
                        <p className="rounded-t-md bg-[#14aed0] object-fill py-1 px-[16px] dark:bg-[#6a3fe4]">
                          Super Rare
                        </p>
                        <div className="flex space-x-2 p-2">
                          {superRarePrice != "None-listed" ? (
                            <>
                              <Image
                                className=""
                                src="/images/eth-logo.png"
                                width={15}
                                height={15}
                              />
                              <p className="">{superRarePrice}</p>
                            </>
                          ) : (
                            <p className="">None Listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xs text-black dark:text-white">
                      Floor prices fetched from Ecto API
                    </h1>
                  </div>
                </div>
              ) : null}
            </div>
          )}
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
                className={`relative rounded-lg border border-[#14aed0] transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer dark:border-[#6a3fe4] ${
                  (nft.length <= 1 && "hidden") ||
                  (nft.length <= limit && "hidden")
                }`}
              >
                <button
                  className="relative items-center justify-center rounded-lg bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-900 dark:text-white"
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
                2: You entered a valid ENS domain, but did not Connect with
                Metamask. Unfortunately, that is required to search by ENS
                domains. If you do not wish to Connect your wallet, feel free to
                search by Address!
              </p>

              <p className="p-4 text-center">
                3: The Wallet Address/ENS domain you have entered doesnt
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
