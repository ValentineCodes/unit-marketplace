import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { ETH_ADDRESS } from "~~/utils/constants";
import TokenPrice from "./TokenPrice";
import { Spinner } from "./Spinner";
import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { apolloClient } from "~~/pages/_app";
import { getEarnings } from "~~/apis/subgraphQueries";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const targetNetwork = getTargetNetwork()

export type EarningParams = {
    id?: string;
    owner?: string;
    token: string;
}

interface EarningProps {
  earning: EarningParams
}

const Earning = ({earning}: EarningProps) => {
  const {data: unit, isLoading: isLoadingUnit} = useDeployedContractInfo("Unit")

  const {data: earnings, isFetching, refetch} = useContractRead({
    chainId: targetNetwork.id,
    address: unit?.address,
    abi: unit.abi,
    functionName: "getEarnings",
    args: [earning.owner, earning.token],
    onError: error => {
        notification.error(error.message)
    }
})

  

  const {writeAsync: withdraw, isLoading} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "withdrawEarnings",
    args: [earning.token]
  })

  
  if(!isFetching) {
    console.log("earnings: ", earnings)
  } else {
    console.log("is fetching earnings...")
  }
 
  if(earnings) {
    return (
      <div className="flex flex-wrap items-center justify-between">
    
        {earning.token === ETH_ADDRESS? (
          <>
            <p>{ethers.utils.formatEther(earnings)} ETH</p>
            <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm" onClick={withdraw}>Withdraw</button>
          </>
        ) : (
          <>
            <TokenPrice price={earnings} token={earning.token} /> 
            <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm" onClick={withdraw}>Withdraw</button>
          </>
        )}

      </div>
    )
  }

}

export default () => {
  const [earnings, setEarnings] = useState<EarningParams[]>()
  const {address, isConnected} = useAccount()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(isConnected) {
        apolloClient.query({
          query: getEarnings(address!)
        })
        .then(result => {
          setEarnings(result.data.earnings)
        })
        .catch(error => {
          console.log(error)
          return
        }).finally(() => {
          setIsLoading(false)
        })
    }
  } , [isConnected, address])

  let userEarnings;

  if(earnings) {
    if(earnings.length > 0) {
      userEarnings = earnings.map(item => <Earning key={item.address} token={item} />)
    } else {
      userEarnings = <p>No Earnings</p>
    }
  }

    return (
        <Popover className="relative">
          <Popover.Button className="bg-black/50 rounded-lg px-4 py-2 font-bold">Earnings <ChevronDownIcon className="inline-block w-4"/></Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
            <Popover.Panel className="absolute top-2 bg-white rounded-lg p-2 text-black min-w-[200px]">
              {isLoading? <Spinner width="20px" height="20px" /> : earnings?.length > 0 ? earnings.map(item => <Earning key={item.address} earning={item} />) : <p className="text-black text-lg">No Earnings</p> }
            </Popover.Panel>
          </Transition>
        </Popover>
    )
}