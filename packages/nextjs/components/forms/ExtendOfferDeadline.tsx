import { Transition, Dialog } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import DeadlineInput from "./DeadlineInput";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { OfferParams } from "../Offers";
import { useDispatch } from "react-redux";
import { extendDeadline } from "~~/store/offers";

interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
    offer: OfferParams;
}
export default ({isOpen, toggleVisibility, offer}: Props) => {
    const [extraTime, setExtraTime] = useState("")
    const dispatch = useDispatch()

    const {writeAsync, isLoading, isSuccess} = useScaffoldContractWrite({
        contractName: "Unit",
        functionName: "extendOfferDeadline",
        args: [offer.nft, offer.tokenId, extraTime]
    })

    useEffect(() => {
        if(isSuccess) {
            dispatch(extendDeadline({id: offer.id, extraTime}))
        }
    } , [isSuccess])
    
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

                            <DeadlineInput name="extendOfferDeadline" placeholder="Extra time" onChange={setExtraTime} />
                            <button className={`btn btn-secondary btn-sm mt-4 ${isLoading ? "loading" : ""}`} disabled={!Boolean(extraTime) || isLoading} onClick={writeAsync}>
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