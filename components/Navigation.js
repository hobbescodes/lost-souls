import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/outline";
import { isAddress } from "ethers/lib/utils";
import { Fragment, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRecoilState } from "recoil";
import { limitState } from "../atoms/LimitAtom";
import { nftsState } from "../atoms/NftsAtom";
import { totalQuarksState } from "../atoms/QuarksAtom";
import {
  backgrounds,
  bodies,
  headware,
  faces,
  shirts,
} from "../exports/traitArrays";
import { contractAddress } from "../exports/contractAddress";

function Navigation() {
  const [tokenOrAddress, setTokenOrAddress] = useState(null);
  const { Moralis } = useMoralis();
  const [nft, setNft] = useRecoilState(nftsState);
  const [limit, setLimit] = useRecoilState(limitState);
  const [tokenIds, setTokenIds] = useState([]);
  const [totalQuarks, setTotalQuarks] = useRecoilState(totalQuarksState);
  const [sniperPrice, setSniperPrice] = useState(null);

  const allHeadware = headware.sort();

  const allFaces = faces.sort();

  const allShirts = shirts.sort();

  // Get individual NFT
  const getNFT = async () => {
    const nfts = await Moralis.Cloud.run("LostSouls");
    let selectedNFT = nfts.filter(
      (nft) => nft.attributes.tokenId === tokenOrAddress
    );
    setNft(selectedNFT);
  };

  // Filter NFTs by specified trait value
  const filteredNFTs = async (index, value) => {
    const nfts = await Moralis.Cloud.run("LostSouls");

    let filteredNFTs = nfts.filter(
      (nft) => nft.attributes.attributes[index].value === value
    );
    setNft(filteredNFTs);
  };

  // Get NFTs for a given wallet address
  const addressNFTs = async (address) => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });
    const options = {
      address,
      token_address: contractAddress,
    };
    const NFTs = await Moralis.Web3API.account.getNFTsForContract(options);

    if (NFTs.result == []) {
      setNft([]);
    } else {
      NFTs.result.map((nft) => tokenIds.push(nft.token_id));

      const nfts = await Moralis.Cloud.run("LostSouls");

      let filteredNFTs = nfts.filter((nft) => {
        for (let i = 0; i < tokenIds.length; i++) {
          if (nft.attributes.tokenId === tokenIds[i]) {
            return nft;
          }
        }
      });

      let totalQuarks = 0;
      filteredNFTs.forEach((nft) => {
        totalQuarks += nft.attributes.quarks;
      });

      setNft(filteredNFTs);
      setTotalQuarks(totalQuarks);
      setTokenIds([]);
    }
  };

  // Easter Egg: Specifies the lowest price a Lost Soul has transfer for in the past 24 hours
  const sniperNFT = async () => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });

    const options = {
      address: contractAddress,
      days: "1",
    };
    const NFTLowestPrice = await Moralis.Web3API.token.getNFTLowestPrice(
      options
    );

    setSniperPrice(NFTLowestPrice.price / Math.pow(10, 18));
  };

  //OnClick for Address: 1) resets variables 2) Checks if input is a valid address or ENS domain, if not resets other variables
  const retrieveAddressNFTs = async () => {
    setNft(undefined);
    setLimit(18);

    if (isAddress(tokenOrAddress) == true) {
      addressNFTs(tokenOrAddress);
    } else {
      try {
        const web3Provider = await Moralis.enableWeb3();
        const address = await web3Provider.resolveName(tokenOrAddress);
        if (address != null) {
          addressNFTs(address);
        } else {
          setTotalQuarks(0);
          setNft([]);
        }
      } catch {
        setTotalQuarks(0);
        setNft([]);
      }
    }
  };

  //OnClick for Find a Soul: 1) reset variables, 2) Checks if input is a valid integer 1-9999 (valid token ID), if not reset other variables
  const retrieveNFT = () => {
    setNft(undefined);
    setTotalQuarks(0);
    if (
      tokenOrAddress % 1 == 0 &&
      tokenOrAddress > 0 &&
      tokenOrAddress < 10000
    ) {
      getNFT();
    } else {
      setTotalQuarks(0);
      setNft([]);
    }
  };

  //OnClick for Filter menu: 1) resets variables, calls the filter function for given trait
  const retrieveFilteredNFTs = (index, value) => {
    setNft(undefined);
    setLimit(18);
    setTotalQuarks(0);
    filteredNFTs(index, value);
  };

  //Reset function to eliminate any filters
  const resetNFTs = async () => {
    const nfts = await Moralis.Cloud.run("LostSouls");

    let allNFTs = nfts;
    setNft(allNFTs);
    setLimit(18);
    setTotalQuarks(0);
  };

  //OnClick for Reset: first setNft(undefined) to clear nfts
  const reset = () => {
    setNft(undefined);
    resetNFTs();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-black md:flex-row md:space-y-0 md:space-x-4">
      <div className="relative mb-4 rounded-md md:mb-0">
        <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 text-black focus:border-[#486cdc] focus:ring-[#486cdc] sm:text-sm"
          type="text"
          placeholder="Token ID or Address"
          onChange={(e) => setTokenOrAddress(e.target.value)}
        />
      </div>

      <div className="relative flex items-center justify-center space-x-2">
        <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
          <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
          <button
            className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
            onClick={() => retrieveNFT()}
          >
            Find a Soul
          </button>
        </div>
        <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
          <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
          <button
            className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
            onClick={() => retrieveAddressNFTs()}
          >
            Address
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
        <div className="relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
          <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
          <button
            className="relative items-center justify-center rounded-lg bg-black px-3 py-2 text-sm"
            onClick={() => sniperNFT()}
          >
            {sniperPrice != null ? sniperPrice + " ETH" : "Sniper"}
          </button>
        </div>
      </div>
      <div className="relative right-8 z-20 w-[20px] items-center justify-center md:right-0">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-[#14aed0] to-[#6a3fe4] blur-lg"></div>
            <Menu.Button className="relative inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
              <div className="flex">
                Filter
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute -right-[66px] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none sm:right-0">
              <div className="max-h-[240px] overflow-y-scroll px-1 py-1">
                {backgrounds.map((background, index) => (
                  <Menu.Item key={index}>
                    <button
                      onClick={() => retrieveFilteredNFTs(0, background)}
                      className="group flex w-full
                          items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
                    >
                      Background: {background}
                    </button>
                  </Menu.Item>
                ))}

                {bodies.map((body, index) => (
                  <Menu.Item key={index}>
                    <button
                      onClick={() => retrieveFilteredNFTs(1, body)}
                      className="group flex w-full
                          items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
                    >
                      Body: {body}
                    </button>
                  </Menu.Item>
                ))}

                {allHeadware.map((headware, index) => (
                  <Menu.Item key={index}>
                    <button
                      onClick={() => retrieveFilteredNFTs(2, headware)}
                      className="group flex w-full
                          items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
                    >
                      Headware: {headware}
                    </button>
                  </Menu.Item>
                ))}

                {allFaces.map((face, index) => (
                  <Menu.Item key={index}>
                    <button
                      onClick={() => retrieveFilteredNFTs(3, face)}
                      className="group flex w-full
                          items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
                    >
                      Face: {face}
                    </button>
                  </Menu.Item>
                ))}

                {allShirts.map((shirt, index) => (
                  <Menu.Item key={index}>
                    <button
                      onClick={() => retrieveFilteredNFTs(4, shirt)}
                      className="group flex w-full
                          items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-violet-500 hover:text-white"
                    >
                      Shirt: {shirt}
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default Navigation;
