import { Fragment, useEffect, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useMoralis, ByMoralis, useMoralisQuery } from "react-moralis";
import NftCard from "./NftCard";
import { SearchIcon, ChevronDownIcon } from "@heroicons/react/solid";

function Results() {
  const [limit, setLimit] = useState(18);
  const [token, setToken] = useState("");
  const { Moralis } = useMoralis();
  const [nft, setNft] = useState(undefined);

  function updateLimit() {
    setLimit(limit + 18);
  }

  const backgrounds = ["Blue", "Green", "Greenburst", "Lilac", "Orange", "Pink", "Purple", "Yellow"]
  const bodies = ["Blue", "Cow", "Diamond", "Gold", "Pink", "White"]
  const headware = ["Suprememebuckethat", "Denimcap", "Devilhorns", "Antlers", "Backhat", "Peterpan", "Spartan", "Hawaiianflower", "Propellerhat", "Ninjaband", "Halo", "Detectivehat", "Sombrero", "Blackcurls", "Blackcap", "Browncurls", "Crown", "Redcurls", "Wolf", "Daisy", "Witchhat", "Flowercrown", "Rastabeanie", "Cowboyhat", "Redbeanie", "Kingcrown", "Combover", "Tanberet", "Brownbob", "Pinkbob", "Tophat", "Graybeanie", "Clown", "Beachhat", "Flowercap", "Chefhat", "Pinkbow", "Velvethat", "Sweatband", "Bunnyears", "Greenberet", "Partyhat", "Beanie", "Catears", "Pineapplebuckethat", "Emohair"]
  const allHeadware = headware.sort();
  const faces = ["Nerd", "Cig", "Wizard", "Vamp", "Flame", "Yellowshades", "Facetats", "Hypno", "Redeyes", "Cat", "Pinkclout", "Whiteclout", "Ninja", "Dollarsign", "Threed", "Toy", "Redshades", "Zipper", "Kissy", "Bite", "Blush", "Wink", "Wut", "Mustache", "Halloween", "Heartglasses", "Rays", "Monacle", "Frown", "Smile", "Loopy", "Angry", "Star", "Aviators", "Surprised", "Cateyes", "Sad", "Confused", "Wishful", "Egirl", "Kawaii", "Basic", "Beard", "Ugh", "Tongue", "Glossy"]
  const allFaces = faces.sort();
  const shirts = ["Darkangel", "Bluelightsaber", "Hula", "Scientist", "Cheetahdress", "Kingrobe", "Baseballjersey", "Redlightsaber", "Toker", "Christmas", "Waterbender", "Angel", "Purpletux", "Firebender", "Icedress", "Sailor", "Tennis", "Ninja", "Pinkhoodie", "Grayhoodie", "Belt", "Fishnet", "Trident", "Countryvest", "Darksuit", "Wedding", "Wheresthesoul", "Cape", "Paintbrushhandpalette", "Pumpkin", "Pinktux", "Tennisracket", "Jersey", "Hockey", "Oranget", "Bib", "Guitar", "Torch", "Gotsoul", "Bowandarrow", "Sceptor", "Tux", "Baloons", "Cane", "Orangestripes", "Lilact", "Wand", "Bee", "Dagger", "Chain", "Bluehoodie", "Phone", "Pinkt", "Candy", "Bluet", "Greent", "Mirraca", "Redt", "Bowties", "Suit", "Blueflannel", "Bottle", "Watch", "Vest", "Spatula", "Book", "Furcoat", "Zebra", "Lsd", "Leatherjacket", "Rippedt", "Basketballjersey", "Kunai", "Yellowt", "Skateboard", "Blackhoodie", "Lollipop", "Redflannel"]
  const allShirts = shirts.sort();
  
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

  const filteredNFTs = async (index, value) => {
    const query = new Moralis.Query("LostSoulsSanctuary");
    const count = await query.count();
    query.limit(count);
    const results = await query.find();

    let filteredNFTs = results.filter(
      (nft) => nft.attributes.attributes[index].value === value
    );
    setNft(filteredNFTs);
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
          <input
            className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 text-black focus:border-[#486cdc] focus:ring-[#486cdc] sm:text-sm"
            type="text"
            placeholder="Search by Token ID"
            onChange={(e) => setToken(e.target.value.toString())}
          />
        </div>
        <div className="flex relative space-x-2 items-center justify-center">
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
        <div className="relative items-center justify-center left-[70px] z-20 w-56">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                  Filter
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
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
                <Menu.Items className="absolute -right-[66px] sm:right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 max-h-[160px] overflow-y-scroll">
                    {backgrounds.map((background, index) => <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => filteredNFTs(0, background)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Background: {background}
                        </button>
                      )}
                    </Menu.Item>)}

                    {bodies.map((body, index) => <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => filteredNFTs(1, body)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Body: {body}
                        </button>
                      )}
                    </Menu.Item>)}

                    {allHeadware.map((headware, index) => <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => filteredNFTs(2, headware)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Headware: {headware}
                        </button>
                      )}
                    </Menu.Item>)}

                    {allFaces.map((face, index) => <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => filteredNFTs(3, face)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Face: {face}
                        </button>
                      )}
                    </Menu.Item>)}

                    {allShirts.map((shirt, index) => <Menu.Item key={index}>
                      {({ active }) => (
                        <button
                          onClick={() => filteredNFTs(4, shirt)}
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Shirt: {shirt}
                        </button>
                      )}
                    </Menu.Item>)}

                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
      </div>

      {/* <ByMoralis
        variant="light"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      /> */}

{nft !== undefined ? (
        <>
          <div className={`justify-center p-4 ${nft.length > 1 && "grid max-w-[1500px] flex-wrap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex"}`}>
            {nft.slice(0, limit).map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
          <div className={`relative transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer ${nft.length == 1 && "hidden"}`}>
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
    </div>
  );
}

export default Results;
