import { Transition, Dialog, Switch } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback, useEffect} from "react";
import { InputBase } from "../scaffold-eth";
import { BigNumber, ethers } from "ethers";
import DeadlineInput from "./DeadlineInput";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { usePrepareContractWrite, useContractWrite, erc721ABI, useContractRead } from "wagmi";
import deployedContracts from "~~/generated/hardhat_contracts"
import { getTargetNetwork } from "~~/utils/scaffold-eth";

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

const targetNetwork = getTargetNetwork()
const unit = deployedContracts[targetNetwork.id][targetNetwork.network].contracts.Unit

const {data: approvedSpender} = useContractRead({
  address: item.nft,
  abi: erc721ABI,
  functionName: "getApproved",
  args: [item.tokenId]
})

const { config: approveConfig } = usePrepareContractWrite({
  address: item.nft,
  abi: erc721ABI,
  functionName: 'approve',
  args: [unit.address, item.tokenId]
 })
 const { data, isLoading: isApproveLoading, isSuccess: isApprovalSuccessful, write: approve } = useContractWrite(approveConfig)

  const {writeAsync: list, isLoading: isListing} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "listItem",
    args: [item.nft, item.tokenId, item.price, item.deadline]
  })

  const {writeAsync: listWithToken, isLoading: isListingWithToken} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "listItemWithToken",
    args: [item.nft, item.tokenId, item.token, item.price, item.auction, item.deadline]
  })

  console.log("approve loading: ", isApproveLoading)
  console.log("approve success: ", isApprovalSuccessful)

  const handleApproval = () => {
    if(!isApproveLoading && approvedSpender !== unit.address) {
      approve() 
    }
  }
  const handleListing = () => {
    if(isTokenPrice) {
      listWithToken()
    } else {
      list()
    }
  }


  const handleTx = () => {
    // Approve unit to spend item if not already approved
    // list item

  
  }

  useEffect(() => {
    if(!isApprovalSuccessful) return 

  
  }, [isApprovalSuccessful])

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