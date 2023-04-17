import { Transition, Dialog, Switch } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback} from "react";
import { InputBase } from "../scaffold-eth";
import { BigNumber, ethers } from "ethers";
import DeadlineInput from "./DeadlineInput";
import { useDeployedContractInfo, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useContractWrite, erc721ABI, useContractRead, useProvider } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useDispatch } from "react-redux";
import { addListing } from "~~/store/listings";

type Item = {
  nft: string;
  tokenId: string;
  token: string;
  price: string | BigNumber;
  auction: boolean;
  deadline: string
}
interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
}
export default ({isOpen, toggleVisibility}: Props) => {

  const [item, setItem] = useState<Item>({
    nft: "",
    tokenId: "",
    token: "",
    price: "",
    auction: false,
    deadline: ""
  })
  const [isTokenPrice, setIsTokenPrice] = useState(false)
  const [error, setError] = useState(false);

const handleItemValueChange = (name: string, value: string) => {
    setItem(current => ({...current, [name] : value}))
}

const multiplyBy1e18 = useCallback(() => {
  if (!item.price) {
    return;
  }
  handleItemValueChange("price", ethers.utils.parseEther(item.price.toString()));
}, [item.price]);

const writeTx = useTransactor()
const {data: unit, isLoading: isLoadingUnit} = useDeployedContractInfo("Unit")

const {data: approvedSpender, refetch: refetchApprovedSpender} = useContractRead({
  address: item.nft,
  abi: erc721ABI,
  functionName: "getApproved",
  args: [item.tokenId]
})

 const { data, isLoading: isApproveLoading, writeAsync: approve, isSuccess: isApprovalSuccessful } = useContractWrite({
  address: item.nft,
  abi: erc721ABI,
  functionName: 'approve',
  args: [unit?.address, item.tokenId],
  mode: "recklesslyUnprepared"
 })

  const {writeAsync: list, isLoading: isListing, isSuccess: isListingSuccessful} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "listItem",
    args: [item.nft, item.tokenId, item.price, item.deadline]
  })

  const {writeAsync: listWithToken, isLoading: isListingWithToken, isSuccess: isListingWithTokenSuccessful} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "listItemWithToken",
    args: [item.nft, item.tokenId, item.token, item.price, item.auction, item.deadline]
  })

  const dispatch = useDispatch()
  const provider = useProvider()

  const addListingToStore = async () => {
    const iUnit = new ethers.Contract(unit.address, unit.abi, provider)
    const listing = await iUnit.getListing(item.nft, item.tokenId)
    dispatch(addListing({
      id: Math.random().toString(),
      owner: listing.seller,
      nft: listing.nft,
      tokenId: listing.tokenId.toString(),
      token: listing.token,
      price: listing.price.toString(),
      auction: listing.auction,
      deadline: listing.deadline.toString(),
    }))

    toggleVisibility()
  }

  const handleListing = async () => {
    if(isTokenPrice) {
     await listWithToken()
    } else {
     await list()
    }
  }


  const handleTx = async () => {
      if(isApproveLoading) return 

      if(approvedSpender !== unit?.address) {
          await writeTx(approve())
      }
      await handleListing()

      await addListingToStore()
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
                    <h3>List Item</h3>

                    <XCircleIcon className="text-black hover:text-[red] transition-colors duration-300 cursor-pointer  w-10" onClick={toggleVisibility} />
                  </Dialog.Title>

                  <div className="space-y-4">
                    <InputBase name="nft" value={item.nft} placeholder="NFT address" onChange={(value) => handleItemValueChange("nft", value)} />
                    <InputBase name="tokenId" value={item.tokenId} placeholder="Token ID" onChange={(value => handleItemValueChange("tokenId", value))} />

                    <input type="checkbox" id="token" name="token" checked={isTokenPrice} onChange={(e) => setIsTokenPrice(!isTokenPrice)} />
                    <label htmlFor="token" className="text-black ml-2">Use token currency</label>

                  {isTokenPrice &&  <InputBase name="token" value={item.token} placeholder="Token address" onChange={(value) => handleItemValueChange("token", value)} /> } 
                    <InputBase name="price" value={item.price} placeholder="Price in wei" onChange={(value) => handleItemValueChange("price", value)}  suffix={
                    !error && (
                      <div
                        className="space-x-4 flex tooltip tooltip-top tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
                        data-tip="Multiply by 10^18 (wei)"
                      >
                        <button className="cursor-pointer font-semibold px-4 text-accent" onClick={multiplyBy1e18}>
                          ∗
                        </button>
                      </div>
                    )
                  } />

                    {isTokenPrice && (
                       <Switch.Group>
                       <div className="flex items-center">
                         <Switch.Label className="mr-4 text-black">{item.auction? "Disable": "Enable"} Auction</Switch.Label>
                         <Switch
                           checked={item.auction}
                           onChange={(checked) => handleItemValueChange("auction", checked)}
                           className={`${
                             item.auction ? 'bg-blue-600' : 'bg-gray-200'
                           } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                         >
                           <span
                             className={`${
                               item.auction ? 'translate-x-6' : 'translate-x-1'
                             } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                           />
                         </Switch>
                       </div>
                     </Switch.Group>
                    )}

                    <DeadlineInput name="deadline" placeholder="Deadline" onChange={value => handleItemValueChange("deadline", value)} />

                    <button className={`btn btn-secondary btn-sm mt-4 ${isListing || isListingWithToken ? "loading" : ""}`} onClick={handleTx}>
                        {!isListing && !isListingWithToken && "List 💸"}
                    </button>
                  </div>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
}