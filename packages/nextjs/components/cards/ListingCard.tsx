import { Popover, Transition } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import UpdateSeller from "../forms/UpdateSeller"
import UpdatePrice from "../forms/UpdatePrice"
import ExtendDeadline from "../forms/ExtendDeadline"
import { ethers } from "ethers"
import { useContractRead } from "wagmi"
import { Listing } from "../Listings"
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth"
import { ERC721ABI } from "~~/utils/abis"
import { ETH_ADDRESS } from "~~/utils/constants"
import moment from "moment"
import TokenPrice from "../TokenPrice"
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth"


interface Props {
    listing: Listing;
}
export default ({listing}: Props ) => {
    const [updateSeller, setUpdateSeller] = useState(false)
    const [updatePrice, setUpdatePrice] = useState(false)
    const [extendDeadline, setExtendDeadlne] = useState(false)

    const [token, setToken] = useState<any>(null)

    const toggleUpdateSeller = () => {
        setUpdateSeller(current => !current)
    }
    
    const toggleUpdatePrice = () => {
        setUpdatePrice(current => !current)
    }

    const toggleExtendDeadline = () => {
        setExtendDeadlne(current => !current)
    }

    const {writeAsync: unlist, isLoading: isUnlisting} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "unlistItem",
        args: [listing.nft, listing.tokenId]
    })

    const {writeAsync: buy, isLoading: isBuying} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "buyItem",
        args: [listing.nft, listing.tokenId],
        value: ethers.utils.formatEther(listing.price)
    })

    const {writeAsync: buyWithToken, isLoading: isBuyingWithToken} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "buyItemWithToken",
        args: [listing.nft, listing.tokenId, listing.token, listing.price],
    })



    const {data: tokenURI} = useContractRead({
        chainId: getTargetNetwork().id,
        address: listing.nft,
        abi: ERC721ABI,
        functionName: "tokenURI",
        args: [Number(listing.tokenId)],
        onError: error => {
            notification.error(error.message)
        }
    })

    const purchase = async () => {
        if(listing.token === ETH_ADDRESS) {
            buy()
        } else {
            buyWithToken()
        }
    }

    const updateUI = async () => {
        const _tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const token = await (await fetch(_tokenURI)).json()

        if(token) {
            const imageURI = token.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            const actualToken = {...token, image: imageURI}
            setToken(actualToken)
        }
    }
    

    useEffect(() => {
        if(tokenURI) {
            updateUI()
        }
    }, [tokenURI])

    return (
        <div className="w-[15em] rounded-lg bg-white text-black shadow-lg">
            <div className="w-full h-[9rem] rounded-t-lg">
                {token && <img src={token.image} alt="" className="w-full h-[9rem] object-contain" />}
            </div>
            <div className="space-y-4 px-2 py-4">
                <div className="flex items-center justify-between space-x-2 font-bold">
                   {token && <h3>{token.name}#14</h3> } 

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

                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer">Offers</li>
                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleUpdateSeller}>Update seller</li>
                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleUpdatePrice}>Update price</li>
                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleExtendDeadline}>Extend deadline</li>
                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer">{listing.auction ? "Disable": "Enable"} Auction</li>
                                    <li className="px-4 py-2 bg-green-500 text-white cursor-pointer" onClick={purchase}>Purchase</li>
                                    <li className="px-4 py-2 bg-red-700 text-white cursor-pointer" onClick={unlist}>Unlist</li>

                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>

                <p className="text-sm">Owner {listing.owner.slice(0, 6)}...{listing.owner.slice(-4)}</p>

                <div className="flex items-center justify-between">
                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">Price</h4>
                       {listing.token === ETH_ADDRESS?  <p className="text-sm text-gray-500">{ethers.utils.formatEther(listing.price)} ETH</p> : <TokenPrice price={listing.price} token={listing.token} />}
                    </div>

                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">Expiration</h4>
                        <p className="text-sm text-gray-500">{moment(new Date(Number(listing.deadline) * 1000)).fromNow()}</p>
                    </div>
                </div>
            </div>

            {/* Modals  */}

            <UpdateSeller isOpen={updateSeller} toggleVisibility={toggleUpdateSeller} listing={listing} />
            <UpdatePrice isOpen={updatePrice} toggleVisibility={toggleUpdatePrice} listing={listing} />
            <ExtendDeadline isOpen={extendDeadline} toggleVisibility={toggleExtendDeadline} listing={listing} />
        </div>
    )
}