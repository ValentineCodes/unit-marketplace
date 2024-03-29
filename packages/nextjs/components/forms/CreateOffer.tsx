import { Transition, Dialog } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback, useEffect} from "react";
import { InputBase } from "../scaffold-eth";
import { BigNumber, ethers } from "ethers";
import DeadlineInput from "./DeadlineInput";
import { useDeployedContractInfo, useScaffoldContractWrite, useTransactor } from "~~/hooks/scaffold-eth";
import { useContractWrite, erc20ABI, useAccount, useContractRead, useWaitForTransaction, useProvider } from "wagmi";
import { Listing } from "../Listings";
import { addOffer } from "~~/store/offers";
import { useDispatch } from "react-redux";

type Item = {
  token: string;
  amount: string;
  deadline: string
}
interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
    listing: Listing
}
export default ({isOpen, toggleVisibility, listing}: Props) => {

  const {address: connectedAccount, isConnected} = useAccount()
  const [offer, setOffer] = useState<Item>({
    token: "",
    amount: "",
    deadline: ""
  })
  const [error, setError] = useState(false);


const handleItemValueChange = (name: string, value: string) => {
    setOffer(current => ({...current, [name] : value}))
}

const multiplyBy1e18 = useCallback(() => {
  if (!offer.amount) {
    return;
  }
  handleItemValueChange("amount", ethers.utils.parseEther(offer.amount.toString()));
}, [offer.amount]);

const {data: unit, isLoading: isLoadingUnit} = useDeployedContractInfo("Unit")

const {data: allowance, refetch: refetchAllowance} = useContractRead({
  address: offer.token,
  abi: erc20ABI,
  functionName: "allowance",
  args: [connectedAccount, unit?.address]
})

 const { data: approveResult, isLoading: isApproveLoading, isSuccess: isApprovalSuccessful, writeAsync: approve } = useContractWrite({
    address: offer.token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [unit?.address, BigNumber.from(offer.amount || 0)],
    mode: "recklesslyUnprepared"
 })

  const {writeAsync: createOffer, isLoading: isCreatingOffer} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "createOffer",
    args: [listing.nft, listing.tokenId, offer.token, offer.amount, offer.deadline]
  })

  const writeTx = useTransactor()
  const dispatch = useDispatch()
  const provider = useProvider()

  const addOfferToStore = async () => {
    const iUnit = new ethers.Contract(unit.address, unit.abi, provider)
    const offer = await iUnit.getOffer(connectedAccount, listing.nft, listing.tokenId)
    dispatch(addOffer({
      id: Math.random().toString(),
      owner: offer.seller,
      nft: offer.nft,
      tokenId: offer.tokenId.toString(),
      token: offer.token,
      amount: offer.amount.toString(),
      deadline: offer.deadline.toString(),
    }))

    toggleVisibility()
  }
  
  const handleTx = async () => {
    if(allowance){
      if(allowance.lt(BigNumber.from(offer.amount))){
          await writeTx(approve())
      }
      await createOffer()

      await addOfferToStore()
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
                    <h3>Make an offer</h3>

                    <XCircleIcon className="text-black hover:text-[red] transition-colors duration-300 cursor-pointer  w-10" onClick={toggleVisibility} />
                  </Dialog.Title>

                  <div className="space-y-4">
                    <InputBase name="token" value={offer.token} placeholder="Token address" onChange={(value) => handleItemValueChange("token", value)} /> 

                    <InputBase name="amount" value={offer.amount} placeholder="Price in wei" onChange={(value) => handleItemValueChange("amount", value)}  suffix={
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

                    <DeadlineInput name="deadline" placeholder="Deadline" onChange={value => handleItemValueChange("deadline", value)} />

                    <button className={`btn btn-secondary btn-sm mt-4 ${isCreatingOffer? "loading" : ""}`} onClick={handleTx}>
                        {!isCreatingOffer && "Make offer 💸"}
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