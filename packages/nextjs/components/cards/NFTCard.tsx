import { Popover, Transition } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import UpdateSeller from "../forms/UpdateSeller"
import UpdatePrice from "../forms/UpdatePrice"
import ExtendDeadline from "../forms/ExtendDeadline"

export default () => {
    const [updateSeller, setUpdateSeller] = useState(false)
    const [updatePrice, setUpdatePrice] = useState(false)
    const [extendDeadline, setExtendDeadlne] = useState(false)

    const toggleUpdateSeller = () => {
        setUpdateSeller(current => !current)
    }
    
    const toggleUpdatePrice = () => {
        setUpdatePrice(current => !current)
    }

    const toggleExtendDeadline = () => {
        setExtendDeadlne(current => !current)
    }
    return (
        <div className="w-[15em] rounded-lg bg-white text-black">
            <img src="/assets/gradient-bg.png" alt="" className="w-full h-[9rem] rounded-t-lg" />
            <div className="space-y-4 px-2 py-4">
                <div className="flex items-center justify-between space-x-2 font-bold">
                    <h3>Ogre#14</h3>

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
                                    <li className="px-4 py-2 border-b hover:bg-gray-200 cursor-pointer">Enable Auction</li>
                                    <li className="px-4 py-2 bg-green-500 text-white cursor-pointer">Purchase</li>
                                    <li className="px-4 py-2 bg-red-700 text-white cursor-pointer">Unlist</li>

                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>

                <p className="text-sm">Owner Oxabc...1234</p>

                <div className="flex items-center justify-between">
                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">Price</h4>
                        <p className="text-sm text-gray-500">1000 DAI</p>
                    </div>

                    <div className="-space-y-1">
                        <h4 className="font-bold text-sm">Expiration</h4>
                        <p className="text-sm text-gray-500">Date Date Date</p>
                    </div>
                </div>
            </div>

            {/* Modals  */}

            <UpdateSeller isOpen={updateSeller} toggleVisibility={toggleUpdateSeller} />
            <UpdatePrice isOpen={updatePrice} toggleVisibility={toggleUpdatePrice} />
            <ExtendDeadline isOpen={extendDeadline} toggleVisibility={toggleExtendDeadline} />
        </div>
    )
}