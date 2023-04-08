import { Transition, Dialog, Popover } from "@headlessui/react";
import { EllipsisHorizontalIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { ETH_ADDRESS } from "~~/utils/constants";
import TokenPrice from "./TokenPrice";
import moment from "moment";
import { useAccount, useEnsAddress } from "wagmi";
import { Listing } from "./Listings";
import { apolloClient } from "~~/pages/_app";
import { getOffers } from "~~/apis/subgraphQueries";
import { Spinner } from "./Spinner";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { isENS } from "~~/utils/helperFunctions";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import ExtendOfferDeadline from "./forms/ExtendOfferDeadline";
import CreateOffer from "./forms/CreateOffer";

export type OfferParams = {
    id: string;
    owner: string
    nft: string;
    tokenId: string | number;
    token: string;
    amount: string | BigNumber;
    deadline: string | number;
}

interface OfferProps {offer: OfferParams; canAccept: boolean}

const Offer = ({offer, canAccept}: OfferProps) => {
    const {address, isConnected} = useAccount()

    const [extendDeadline, setExtendDeadlne] = useState(false)

    const toggleExtendDeadline = () => {
        setExtendDeadlne(current => !current)
    }

    const {writeAsync: removeOffer, isLoading: isRemoving} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "removeOffer",
        args: [offer.nft, offer.tokenId]
    })

    const {writeAsync: acceptOffer, isLoading: isAccepting} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "acceptOffer",
        args: [offer.owner, offer.nft, offer.tokenId]
    })

    const {data: offerOwner , isLoading: isOfferOwnerLoading} = useEnsAddress({
        name: offer.owner,
        enabled: isENS(offer.owner),
        chainId: getTargetNetwork().id,
        cacheTime: 30_000
    })

    return (
        <div className="px-2 py-1 border-b-2">
            <div className="flex justify-between items-center text-sm">
               {!isOfferOwnerLoading && <p className="text-black">Owned by {!offerOwner && `${offer.owner.slice(0, 6) + "..." + offer.owner.slice(-4)}`}</p> }
                {offer.token === ETH_ADDRESS?  <p className="text-black font-bold">{ethers.utils.formatEther(offer.amount)} ETH</p> : <TokenPrice price={offer.amount} token={offer.token} />}
            </div>

            <div className="flex justify-between items-center">
                <p className="text-black">Expiration: {moment(new Date(Number(offer.deadline) * 1000)).fromNow()}</p>
                {canAccept? <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm" onClick={acceptOffer}>Accept</button> : isConnected && address?.toLowerCase() === offer.owner.toLowerCase()? (
                         <Popover className="relative">
                         <Popover.Button><EllipsisHorizontalIcon className="w-8 bg-black/80 text-white rounded-lg" /></Popover.Button>
                             <Transition
                                 enter="transition duration-100 ease-out"
                                 enterFrom="transform scale-95 opacity-0"
                                 enterTo="transform scale-100 opacity-100"
                                 leave="transition duration-75 ease-out"
                                 leaveFrom="transform scale-100 opacity-100"
                                 leaveTo="transform scale-95 opacity-0"
                             >
                             <Popover.Panel as="ul" className="absolute bg-white rounded-lg text-black min-w-[200px] border shadow-md font-normal">
                                             <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleExtendDeadline}>Extend deadline</li>
                                             <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={removeOffer}>Remove</li>
 
                             </Popover.Panel>
                         </Transition>
                     </Popover>
                ) : null  }
            </div>

            <ExtendOfferDeadline isOpen={extendDeadline} toggleVisibility={toggleExtendDeadline} offer={offer} />
        </div>
    )
}

interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
    listing: Listing;
    canAcceptOffer: boolean;
}
export default ({isOpen, toggleVisibility, listing, canAcceptOffer}: Props) => {
const [offers, setOffers] = useState<OfferParams[]>()
const [isLoading, setIsLoading] = useState(true)
const [createOffer, setCreateOffer] = useState(false)

const toggleCreateOffer = () => {
    setCreateOffer(current => !current)
}

    useEffect(() => {
        apolloClient.query({
            query: getOffers(listing)
        }).then(result => {
            setOffers(result.data.offers)
        }).catch(error => {
            console.error(error)
            return
        }).finally(() => setIsLoading(false))
    }, [])

    let listingOffers;

    if(offers) {
        if(offers.length > 0) {
            listingOffers = offers.map(offer => <Offer key={offer.id} offer={offer} canAccept={canAcceptOffer} />)
        } else {
            listingOffers = <p className="text-black text-lg">No Offers</p>
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toggleVisibility}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                  >
                    <h3>Offers</h3>

                    <div className="flex items-center space-x-4">
                        <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-4 py-1 text-lg" onClick={toggleCreateOffer}>Make an offer</button>
                        <XCircleIcon className="text-black hover:text-[red] transition-colors duration-300 cursor-pointer  w-10" onClick={toggleVisibility} />
                    </div>
                  </Dialog.Title>

                  {isLoading? <Spinner width="20px" height="20px" /> : listingOffers}
                </Dialog.Panel>
              </Transition.Child>
            </div>

            {createOffer && <CreateOffer isOpen={createOffer} toggleVisibility={toggleCreateOffer} listing={listing} />}
          </div>
        </Dialog>
      </Transition>
    )
}