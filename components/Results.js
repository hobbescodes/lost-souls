import { useState } from "react";
import { useMoralis, ByMoralis, useMoralisQuery } from "react-moralis";
import NftCard from "./NftCard";
import { SearchIcon } from "@heroicons/react/solid";

function Results() {
  const [limit, setLimit] = useState(18);
  const [token, setToken] = useState("");
  const { Moralis } = useMoralis();
  const [nft, setNft] = useState(undefined);

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

  const getNFT = async () => {
    const query = new Moralis.Query("LostSoulsSanctuary");
    query.equalTo("tokenId", token);
    let selectedNFT = await query.find();
    setNft(selectedNFT);
  };

  const reset = () => {
    setNft(undefined);
  };

  return (
    <div className="relative mx-auto mb-12 flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4 bg-black sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative rounded-md">
          <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          {/* to override forms styling using tailwind, install @tailwindcss/forms and require plugin in tailwind config */}
          <input
            className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 text-black focus:border-[#486cdc] focus:ring-[#486cdc] sm:text-sm"
            type="text"
            placeholder="Search by Token ID"
            onChange={(e) => setToken(e.target.value.toString())}
          />
        </div>
        <div className="flex space-x-2">
          <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
            <button
              className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
              onClick={() => getNFT()}
            >
              Get NFT
            </button>
          </div>
          <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
            <button
              className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
              onClick={() => reset()}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* <ByMoralis
        variant="light"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      /> */}

      {nft !== undefined ? (
        <div className="justify-center p-4">
          {nft.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid flex-wrap justify-center p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex">
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
    </div>
  );
}

export default Results;
