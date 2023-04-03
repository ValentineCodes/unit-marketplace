import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Earning = {
    owner: string;
    address: string;
}

interface Props {
    name: string;
    items: Earning[];
    onWithdraw: () => void;
}
export default ({name, items, onWithdraw}: Props) => {
    return (
        <Popover className="relative">
          <Popover.Button className="bg-black/50 rounded-lg px-4 py-2 font-bold">{name} <ChevronDownIcon className="inline-block w-4"/></Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
            <Popover.Panel className="absolute top-2 bg-white rounded-lg p-2 text-black min-w-[200px]">
                <div className="flex flex-wrap items-center justify-between">
                  <p>0.001 ETH</p>
                  <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm">Withdraw</button>
                </div>
            </Popover.Panel>
          </Transition>
        </Popover>
    )
}