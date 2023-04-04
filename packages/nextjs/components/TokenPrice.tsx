import { BigNumber, ethers } from "ethers";
import { useContractRead } from "wagmi";
import { ERC20ANI } from "~~/utils/abis";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

interface Props {
    price: string | BigNumber;
    token: string;
}
export default ({price, token}: Props) => {
    const {data: symbol, isFetching, refetch} = useContractRead({
        chainId: getTargetNetwork().id,
        address: token,
        abi: ERC20ANI,
        functionName: "symbol",
        args: [],
        onError: error => {
            notification.error(error.message)
        }
    })

    console.log("symbol: ", symbol )

    
    return (
<p className="text-sm text-gray-500">{ethers.utils.formatEther(price)} {symbol}</p>
    )
}