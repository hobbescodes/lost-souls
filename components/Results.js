import { useMoralisQuery } from "react-moralis";
import NftCard from "./NftCard";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { nftsState } from "../atoms/NftsAtom";
import { limitState } from "../atoms/LimitAtom";

function Results() {
  const [limit, setLimit] = useRecoilState(limitState);
  const [nft, setNft] = useRecoilState(nftsState);

  function updateLimit() {
    setLimit(limit + 18);
  }

  const { data, error, isLoading } = useMoralisQuery(
    "LostSoulsSanctuary",
    (query) => query.ascending("rank").limit(limit),
    [limit],
    {
      live: true,
    }
  );

  return (
    <div className="relative mx-auto mb-12 flex flex-col items-center space-y-4">
      {nft != undefined ? (
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
        <>
          <div className="grid max-w-[1500px] flex-wrap justify-center p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex">
            {data.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
          <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
            <button
              className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
              onClick={() => updateLimit()}
            >
              Load More
            </button>
          </div>
        </>
      )}

      {nft != undefined && nft.length == 0 ? (
        <div className="inline-flex flex-col items-center justify-center space-y-4">
          <p className="p-4 text-center font-bold">
            Sorry, you have entered an Invalid Token ID. Please try again.
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
      ) : null}
    </div>
  );
}

export default Results;
