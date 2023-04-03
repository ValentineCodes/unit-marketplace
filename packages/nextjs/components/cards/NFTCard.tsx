import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"

export default () => {
    return (
        <div className="w-[15em] rounded-lg bg-white text-black">
            <img src="/assets/gradient-bg.png" alt="" className="w-full h-[9rem] rounded-t-lg" />
            <div className="space-y-4 px-2 py-4">
                <div className="flex items-center justify-between space-x-2 font-bold">
                    <h3>Ogre#14</h3>
                    <EllipsisHorizontalIcon className="w-8 bg-black/80 text-white rounded-lg" />
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
        </div>
    )
}