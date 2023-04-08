import { Popover, Transition } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import UpdateSeller from "../forms/UpdateSeller"
import UpdatePrice, { Action } from "../forms/UpdatePrice"
import ExtendDeadline from "../forms/ExtendDeadline"
import { BigNumber, ethers } from "ethers"
import { erc20ABI, useAccount, useContractRead, useContractWrite, useEnsAddress } from "wagmi"
import { Listing } from "../Listings"
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth"
import { ERC721ABI } from "~~/utils/abis"
import { ETH_ADDRESS } from "~~/utils/constants"
import moment from "moment"
import TokenPrice from "../TokenPrice"
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth"
import Offers from "../Offers"
import { isENS } from "~~/utils/helperFunctions"
import deployedContracts from "~~/generated/hardhat_contracts"
interface Props {
    listing: Listing;
}
export default ({listing}: Props ) => {
    const [showOffers, setShowOffers] = useState(false)
    const [updateSeller, setUpdateSeller] = useState(false)
    const [updatePrice, setUpdatePrice] = useState(false)
    const [extendDeadline, setExtendDeadlne] = useState(false)
    const {address, isConnected} = useAccount()
    const {data: listingOwner, isLoading: isListingOwnerLoading} = useEnsAddress({
        name: listing.owner,
        enabled: isENS(listing.owner),
        chainId: getTargetNetwork().id,
        cacheTime: 30_000
    })

    const [token, setToken] = useState<any>(null)
    const [action, setAction] = useState<Action>("updatePrice")

    const toggleShowOffers = () => {
        setShowOffers(current => !current)
    }

    const toggleUpdateSeller = () => {
        setUpdateSeller(current => !current)
    }
    
    const toggleUpdatePrice = () => {
        setUpdatePrice(current => !current)
    }

    const toggleExtendDeadline = () => {
        setExtendDeadlne(current => !current)
    }

    const handlePriceUpdate = () => {
        setAction("updatePrice")
        toggleUpdatePrice()
    }

    const handleAuctionToggle = () => {
        if(listing.auction) {
            setAction("disableAuction")
        } else {
            setAction("enableAuction")
        }
        toggleUpdatePrice()
    }

    const targetNetwork = getTargetNetwork()

const unit = deployedContracts[targetNetwork.id][targetNetwork.network].contracts.Unit

const {data: allowance} = useContractRead({
  address: listing.token,
  abi: erc20ABI,
  functionName: "allowance",
  args: [address, unit.address]
})

 const { data, isLoading: isApproveLoading, isSuccess: isApprovalSuccessful, write: approve } = useContractWrite({
    address: listing.token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [unit.address, BigNumber.from(listing.price || 0)],
    mode: "recklesslyUnprepared"
 })

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

    const {data: tokenURI}  = useContractRead({
        chainId: getTargetNetwork().id,
        address: listing.nft,
        abi: ERC721ABI,
        functionName: "tokenURI",
        args: [Number(listing.tokenId)],
        // onError: error => {
        //     notification.error(error.message)
        // }
    })

    const purchase = async () => {
        if(listing.token === ETH_ADDRESS) {
            buy()
        } else {
            if(allowance?.lt(BigNumber.from(listing.price))){
                console.log("Approving token")
                approve()
            } else {
                buyWithToken()
            }
            
        }
    }

    useEffect(() => {
        if(!isApprovalSuccessful) return

        notification.success("Approval successful")
        buyWithToken()

    }, [isApprovalSuccessful])

    const updateUI = async () => {
        try{
            console.log("tokenuri: ", tokenURI)
        const _tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        const token = await (await fetch(_tokenURI)).json()

        if(token) {
            const imageURI = token.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            console.log("image: ", imageURI)
            const actualToken = {...token, image: imageURI}
            setToken(actualToken)
            console.log("Token: ", actualToken)
        }
    } catch(error) {
        console.log("error")
        console.log(error)
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
                   {token && <h3>{token.name}#{listing.tokenId}</h3> } 

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

                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleShowOffers}>Offers</li>
                                    {isConnected && address?.toLowerCase() !== listing.owner.toLowerCase() && !listing.auction && <li className="px-4 py-2 bg-green-500 text-white cursor-pointer" onClick={purchase}>Purchase</li>}
                                    {isConnected && address?.toLowerCase() === listing.owner.toLowerCase() && (
                                        <>
                                            <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleUpdateSeller}>Update seller</li>
                                            <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={handlePriceUpdate}>Update price</li>
                                            <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={toggleExtendDeadline}>Extend deadline</li>
                                            <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer" onClick={handleAuctionToggle}>{listing.auction ? "Disable": "Enable"} Auction</li>
                                            <li className="px-4 py-2 bg-red-700 text-white cursor-pointer" onClick={unlist}>Unlist</li>
                                        </>
                                    )}

                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>

                {/* <p className="text-sm">Owner {listing.owner.slice(0, 6)}...{listing.owner.slice(-4)}</p> */}
                {!isListingOwnerLoading && <p className="text-sm">Owned by {isConnected && listing.owner.toLowerCase() === address?.toLowerCase()? "me": !listingOwner && `${listing.owner.slice(0, 6) + "..." + listing.owner.slice(-4)}`}</p>}

                <div className="flex items-center justify-between">
                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">{listing.auction? "Starting price": "Price"}</h4>
                       {listing.token === ETH_ADDRESS?  <p className="text-sm text-gray-500">{ethers.utils.formatEther(listing.price)} ETH</p> : <TokenPrice price={listing.price} token={listing.token} />}
                    </div>

                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">Expiration</h4>
                        <p className="text-sm text-gray-500">{moment(new Date(Number(listing.deadline) * 1000)).fromNow()}</p>
                    </div>
                </div>
            </div>

            {/* Modals  */}
            
{showOffers && <Offers isOpen={showOffers} toggleVisibility={toggleShowOffers} listing={listing} canAcceptOffer={isConnected && listing.owner.toLowerCase() === address?.toLowerCase()} />}
{updateSeller && <UpdateSeller isOpen={updateSeller} toggleVisibility={toggleUpdateSeller} listing={listing} />}
{updatePrice && <UpdatePrice action={action} isOpen={updatePrice} toggleVisibility={toggleUpdatePrice} listing={listing} />}
{extendDeadline && <ExtendDeadline isOpen={extendDeadline} toggleVisibility={toggleExtendDeadline} listing={listing} />}
        </div>
    )
}