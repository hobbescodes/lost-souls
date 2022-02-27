import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/outline";
import { isAddress } from "ethers/lib/utils";
import { Fragment, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRecoilState } from "recoil";
import { limitState } from "../atoms/LimitAtom";
import { nftsState } from "../atoms/NftsAtom";

function Navigation() {
  const [tokenOrAddress, setTokenOrAddress] = useState(null);
  const { Moralis } = useMoralis();
  const [nft, setNft] = useRecoilState(nftsState);
  const [limit, setLimit] = useRecoilState(limitState);
  const [tokenIds, setTokenIds] = useState([]);

  const backgrounds = [
    "Blue",
    "Green",
    "Greenburst",
    "Lilac",
    "Orange",
    "Pink",
    "Purple",
    "Yellow",
  ];
  const bodies = ["Blue", "Cow", "Diamond", "Gold", "Pink", "White"];
  const headware = [
    "Suprememebuckethat",
    "Denimcap",
    "Devilhorns",
    "Antlers",
    "Backhat",
    "Peterpan",
    "Spartan",
    "Hawaiianflower",
    "Propellerhat",
    "Ninjaband",
    "Halo",
    "Detectivehat",
    "Sombrero",
    "Blackcurls",
    "Blackcap",
    "Browncurls",
    "Crown",
    "Redcurls",
    "Wolf",
    "Daisy",
    "Witchhat",
    "Flowercrown",
    "Rastabeanie",
    "Cowboyhat",
    "Redbeanie",
    "Kingcrown",
    "Combover",
    "Tanberet",
    "Brownbob",
    "Pinkbob",
    "Tophat",
    "Graybeanie",
    "Clown",
    "Beachhat",
    "Flowercap",
    "Chefhat",
    "Pinkbow",
    "Velvethat",
    "Sweatband",
    "Bunnyears",
    "Greenberet",
    "Partyhat",
    "Beanie",
    "Catears",
    "Pineapplebuckethat",
    "Emohair",
  ];
  const allHeadware = headware.sort();
  const faces = [
    "Nerd",
    "Cig",
    "Wizard",
    "Vamp",
    "Flame",
    "Yellowshades",
    "Facetats",
    "Hypno",
    "Redeyes",
    "Cat",
    "Pinkclout",
    "Whiteclout",
    "Ninja",
    "Dollarsign",
    "Threed",
    "Toy",
    "Redshades",
    "Zipper",
    "Kissy",
    "Bite",
    "Blush",
    "Wink",
    "Wut",
    "Mustache",
    "Halloween",
    "Heartglasses",
    "Rays",
    "Monacle",
    "Frown",
    "Smile",
    "Loopy",
    "Angry",
    "Star",
    "Aviators",
    "Surprised",
    "Cateyes",
    "Sad",
    "Confused",
    "Wishful",
    "Egirl",
    "Kawaii",
    "Basic",
    "Beard",
    "Ugh",
    "Tongue",
    "Glossy",
  ];
  const allFaces = faces.sort();
  const shirts = [
    "Darkangel",
    "Bluelightsaber",
    "Hula",
    "Scientist",
    "Cheetahdress",
    "Kingrobe",
    "Baseballjersey",
    "Redlightsaber",
    "Toker",
    "Christmas",
    "Waterbender",
    "Angel",
    "Purpletux",
    "Firebender",
    "Icedress",
    "Sailor",
    "Tennis",
    "Ninja",
    "Pinkhoodie",
    "Grayhoodie",
    "Belt",
    "Fishnet",
    "Trident",
    "Countryvest",
    "Darksuit",
    "Wedding",
    "Wheresthesoul",
    "Cape",
    "Paintbrushhandpalette",
    "Pumpkin",
    "Pinktux",
    "Tennisracket",
    "Jersey",
    "Hockey",
    "Oranget",
    "Bib",
    "Guitar",
    "Torch",
    "Gotsoul",
    "Bowandarrow",
    "Sceptor",
    "Tux",
    "Baloons",
    "Cane",
    "Orangestripes",
    "Lilact",
    "Wand",
    "Bee",
    "Dagger",
    "Chain",
    "Bluehoodie",
    "Phone",
    "Pinkt",
    "Candy",
    "Bluet",
    "Greent",
    "Mirraca",
    "Redt",
    "Bowties",
    "Suit",
    "Blueflannel",
    "Bottle",
    "Watch",
    "Vest",
    "Spatula",
    "Book",
    "Furcoat",
    "Zebra",
    "Lsd",
    "Leatherjacket",
    "Rippedt",
    "Basketballjersey",
    "Kunai",
    "Yellowt",
    "Skateboard",
    "Blackhoodie",
    "Lollipop",
    "Redflannel",
  ];
  const allShirts = shirts.sort();

  const getNFT = async () => {
    const nfts = await Moralis.Cloud.run("LostSouls");
    let selectedNFT = nfts.filter(
      (nft) => nft.attributes.tokenId === tokenOrAddress
    );
    setNft(selectedNFT);
  };

  const filteredNFTs = async (index, value) => {
    const nfts = await Moralis.Cloud.run("LostSouls");

    let filteredNFTs = nfts.filter(
      (nft) => nft.attributes.attributes[index].value === value
    );
    setNft(filteredNFTs);
  };

  const addressNFTs = async () => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });
    const options = {
      address: tokenOrAddress,
      token_address: "0x0FB69D1dC9954a7f60e83023916F2551E24F52fC",
    };
    const NFTs = await Moralis.Web3API.account.getNFTsForContract(options);
    NFTs.result.map((nft) => tokenIds.push(nft.token_id));

    const nfts = await Moralis.Cloud.run("LostSouls");

    let filteredNFTs = nfts.filter((nft) => {
      for (let i = 0; i < tokenIds.length; i++) {
        if (nft.attributes.tokenId === tokenIds[i]) {
          return nft;
        }
      }
    });
    setNft(filteredNFTs);
    setTokenIds([]);
  };

  const retrieveAddressNFTs = () => {
    setNft(undefined);
    setLimit(18);

    if (isAddress(tokenOrAddress) == true) {
      addressNFTs();
    } else {
      setNft([]);
    }
  };

  const retrieveNFT = () => {
    setNft(undefined);
    if (
      tokenOrAddress % 1 == 0 &&
      tokenOrAddress > 0 &&
      tokenOrAddress < 10000
    ) {
      getNFT();
    } else {
      setNft([]);
    }
  };

  const retrieveFilteredNFTs = (index, value) => {
    setNft(undefined);
    setLimit(18);
    filteredNFTs(index, value);
  };

  const resetNFTs = async () => {
    const nfts = await Moralis.Cloud.run("LostSouls");

    let allNFTs = nfts;
    setNft(allNFTs);
    setLimit(18);
  };

  const reset = () => {
    setNft(undefined);
    resetNFTs();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-black md:flex-row md:space-y-0 md:space-x-4">
      <div className="relative rounded-md">
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
      </div>
      <div className="relative left-[70px] z-20 w-56 items-center justify-center md:left-0">
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
