import { Fragment, useCallback, useState } from "react";
import { InputBase } from "../scaffold-eth";
import { Dialog, Transition } from "@headlessui/react";
import { BigNumber, ethers } from "ethers";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  toggleVisibility: () => void;
}
export default ({ isOpen, toggleVisibility }: Props) => {
  const [price, setPrice] = useState<string | BigNumber>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const multiplyBy1e18 = useCallback(() => {
    if (!price) {
      return;
    }
    setPrice(ethers.utils.parseEther(price.toString()));
  }, [price]);
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

                <InputBase
                  name="updatePrice"
                  value={price}
                  placeholder="New price in wei"
                  onChange={setPrice}
                  suffix={
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
                  }
                />

                <button className={`btn btn-secondary btn-sm mt-4 ${isLoading ? "loading" : ""}`}>Send 💸</button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
