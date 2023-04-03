import { Transition, Dialog } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback } from "react";
import { InputBase } from "../scaffold-eth";
import { BigNumber, ethers } from "ethers";

interface Props {
    isOpen: boolean;
    toggleVisibility: () => void;
}
export default ({isOpen, toggleVisibility}: Props) => {
    const [extraTime, setExtraTime] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    
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

                            <InputBase name="extendDeadline" value={extraTime} placeholder="Extra time in seconds" onChange={setExtraTime} />

                            <button className={`btn btn-secondary btn-sm mt-4 ${isLoading ? "loading" : ""}`}>
                                Send 💸
                            </button>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}