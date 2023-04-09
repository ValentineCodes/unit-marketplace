import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useContractWrite, useContractRead, erc721ABI } from "wagmi";
import { InputBase } from "../scaffold-eth";
import { Listing } from "../Listings";
import { useScaffoldContractWrite, useTransactor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";
import deployedContracts from "~~/generated/hardhat_contracts";

const targetNetwork = getTargetNetwork()
interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
    listing: Listing;
}
export default ({isOpen, toggleVisibility, listing}: Props) => {
    const [seller, setSeller] = useState("")

    const writeTx = useTransactor()
    
    const unit = deployedContracts[targetNetwork.id][targetNetwork.network].contracts.Unit

    const {data: approvedSpender, refetch: refetchApprovedSpender} = useContractRead({
    address: listing.nft,
    abi: erc721ABI,
    functionName: "getApproved",
    args: [listing.tokenId]
    })

    const { data, isLoading: isApproveLoading, writeAsync: approve, isSuccess: isApprovalSuccessful } = useContractWrite({
    address: listing.nft,
    abi: erc721ABI,
    functionName: 'approve',
    args: [unit.address, listing.tokenId],
    mode: "recklesslyUnprepared"
    })

    const {writeAsync: updateSeller, isLoading} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "updateItemSeller",
        args: [listing.nft, listing.tokenId, seller]
    })

    const handleTx = async () => {
        if(isApproveLoading) return

        if(approvedSpender !== unit.address) {
            await writeTx(approve())
        }
        updateSeller()
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
                            <XCircleIcon className="text-black hover:text-[red] transition-colors duration-300 cursor-pointer  w-10" onClick={toggleVisibility} />

                            <InputBase name="updateSeller" value={seller} placeholder="New seller address" onChange={setSeller} />

                            <button className={`btn btn-secondary btn-sm mt-4 ${isLoading ? "loading" : ""}`} disabled={!Boolean(seller)} onClick={handleTx}>
                               {!isLoading && "Send 💸"}
                            </button>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}