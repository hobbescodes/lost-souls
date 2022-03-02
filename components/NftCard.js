import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LinkIcon as OpenSea, XIcon } from "@heroicons/react/outline";
import { useMoralis } from "react-moralis";

function NftCard({ nft }) {
  let [isOpen, setIsOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const { Moralis } = useMoralis();

  //Closes Modal for each NFT, resets owner value
  function closeModal() {
    setIsOpen(false);
    setOwner("");
  }

  //Truncates an address to the form of 0xEE..EEEE
  function truncateHash(hash, string, length = 38) {
    return hash.replace(hash.substring(4, length), "..");
  }

  //Finds the current owner of a given NFT, provided a Token ID. Checks to see if there is an ENS domain attached to owner's wallet address
  const getNFTOwner = async (id) => {
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_APP_ID,
    });

    const options = {
      address: "0x0FB69D1dC9954a7f60e83023916F2551E24F52fC",
      token_id: id,
    };
    const tokenIdOwner = await Moralis.Web3API.token.getTokenIdOwners(options);

    const options2 = { address: tokenIdOwner.result[0].owner_of };
    try {
      const resolve = await Moralis.Web3API.resolve.resolveAddress(options2);
      setOwner(resolve.name);
    } catch {
      setOwner(truncateHash(tokenIdOwner.result[0].owner_of));
    }
  };

  //Opens Modal for each NFT and triggers function to find owner of clicked NFT
  function openModal() {
    setIsOpen(true);
    getNFTOwner(nft.attributes.tokenId);
  }

  return (
    <div>
      <div className="relative m-4 transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer">
        <div
          className={`absolute inset-0 rounded-md ${
            nft.attributes.class === "Super Rare" && "bg-orange-400"
          } ${nft.attributes.class === "Rare" && "bg-green-400"} ${
            nft.attributes.class === "Uncommon" && "bg-blue-400"
          } ${nft.attributes.class === "Common" && "bg-purple-400"} blur-lg`}
        ></div>
        <div className="relative rounded-b-lg bg-black pb-3">
          <div
            onClick={openModal}
            className="flex flex-col items-center space-y-2 rounded-lg"
          >
            <div className="relative h-52 w-52">
              <div
                className={`absolute top-2 -right-1 z-10 w-20 rounded-l-md rounded-tr-md text-center ${
                  nft.attributes.class === "Super Rare" && "bg-orange-400"
                } ${nft.attributes.class === "Rare" && "bg-green-400"} ${
                  nft.attributes.class === "Uncommon" && "bg-blue-400"
                } ${
                  nft.attributes.class === "Common" && "bg-purple-400"
                } p-1 text-xs font-bold text-black shadow shadow-black`}
              >
                {nft.attributes.class}
              </div>
              <div
                className={`text-md absolute top-3 -right-1 h-7 w-[2px] rounded-r-lg ${
                  nft.attributes.class === "Super Rare" && "bg-orange-400"
                } ${nft.attributes.class === "Rare" && "bg-green-400"} ${
                  nft.attributes.class === "Uncommon" && "bg-blue-400"
                } ${
                  nft.attributes.class === "Common" && "bg-purple-400"
                } p-1 text-black shadow shadow-black`}
              ></div>
              <Image
                src={nft.attributes.image}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p>{`Lost Soul ${nft.attributes.tokenId}`}</p>
            {nft.attributes.rank < 22 ? (
              <p>Rank #1</p>
            ) : (
              <p>{`Rank #${nft.attributes.rank}`}</p>
            )}

            <p>{`Quarks: ${nft.attributes.quarks / 1000}K`}</p>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl border-4 border-black bg-black p-6 text-left align-middle text-white shadow-xl transition-all">
                <div className="flex flex-col items-center justify-between space-y-3 py-4 sm:flex-row sm:space-y-0">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white"
                    >
                      {`Lost Soul #${nft.attributes.tokenId}`}
                    </Dialog.Title>
                    <div className="relative h-48 w-48">
                      <div className="absolute top-1 -left-1 z-50 rounded-r-md rounded-tl-md bg-green-400 p-1 text-xs font-bold text-black shadow shadow-black">
                        {nft.attributes.rank < 22 ? (
                          <p>Rank #1</p>
                        ) : (
                          <p>{`Rank #${nft.attributes.rank}`}</p>
                        )}
                      </div>
                      <div className="text-md absolute top-[4px] -left-1 h-8 w-[2px] rounded-l-lg bg-green-400 p-1 text-black shadow shadow-black"></div>
                      <Image
                        className="rounded-md"
                        src={nft.attributes.image}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    {owner != "" ? (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-green-400">Owner:</p>
                        <p>{owner}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col justify-between space-y-1 divide-y divide-solid px-3 text-sm">
                    <div className="flex justify-between space-x-2">
                      <p className="font-bold">Score:</p>
                      <p className="font-normal text-green-400">{`${nft.attributes.rarity.toFixed(
                        2
                      )}`}</p>
                    </div>

                    {nft.attributes.attributes.map((e, index) => {
                      if (e.trait_type != "TraitCount") {
                        return (
                          <div
                            key={index}
                            className="flex justify-between space-x-8 space-y-2 py-2"
                          >
                            <div className="flex flex-col">
                              <p className="font-bold">{e.trait_type}:</p>
                              <p className="text-xs font-bold text-gray-400">
                                {e.value}
                              </p>
                            </div>

                            <p className="font-normal text-blue-400">{`+${e.rarityScore.toFixed(
                              2
                            )}`}</p>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                </div>
                <div className="absolute right-3 top-2 hover:cursor-pointer hover:opacity-50">
                  <XIcon className="h-5 w-5" onClick={closeModal} />
                </div>
                <div className="absolute left-5 bottom-2 flex items-center justify-center space-x-1 text-blue-400 hover:underline">
                  <OpenSea className="h-4 w-4" />
                  <div>
                    <a
                      rel="noreferrer"
                      href={`https://opensea.io/assets/0x0fb69d1dc9954a7f60e83023916f2551e24f52fc/${nft.attributes.tokenId}`}
                      className="focus:outline-none"
                      target="_blank"
                    >
                      OpenSea
                    </a>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default NftCard;
