import { useMoralis } from "react-moralis";
import NftCard from "./NftCard";
import Loader from "./Loader";
import { useRecoilState } from "recoil";
import { nftsState } from "../atoms/NftsAtom";
import { limitState } from "../atoms/LimitAtom";
import { useEffect } from "react";
import Image from "next/image";

function Results() {
  const [limit, setLimit] = useRecoilState(limitState);
  const [nft, setNft] = useRecoilState(nftsState);
  const { Moralis } = useMoralis();

  function updateLimit() {
    setLimit(limit + 18);
  }

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
  }, []);

  return (
    <div className="relative mx-auto mb-12 flex flex-col items-center space-y-4">
      {nft != undefined ? (
        <>
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
                1: You entered an Invalid Token ID or an Invalid Wallet Address.
                In that case, please try again!
              </p>

              <p className="p-4 text-center">
                2: The Wallet Address you have entered doesnt currently own a
                Lost Soul. If this is the case, and it is you Wallet Address,
                head to{" "}
                <span className="text-blue-500">
                  <a
                    rel="noreferrer"
                    href="https://opensea.io/collection/lostsoulssanctuary"
                    className="focus:outline-none"
                    target="_blank"
                  >
                    OpenSea
                  </a>
                </span>
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
