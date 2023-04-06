import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { ETH_ADDRESS } from "~~/utils/constants";
import TokenPrice from "./TokenPrice";
import { Spinner } from "./Spinner";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import { useAccount, useEnsAddress } from "wagmi";
import { apolloClient } from "~~/pages/_app";
import { getEarnings } from "~~/apis/subgraphQueries";

export type EarningParams = {
    owner?: string;
    address: string;
}

const Earning = (token: EarningParams) => {
  const {data: earnings} = useScaffoldContractRead({
    contractName: "Unit",
    functionName: "getEarnings",
    args: [token.owner, token.address]
  })

  const {writeAsync: withdraw, isLoading} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "withdrawEarnings",
    args: [token.address]
  })



  if(earnings) {
    return (
      <div className="flex flex-wrap items-center justify-between">
    
      {token.address === ETH_ADDRESS? <p>{ethers.utils.formatEther(earnings)} ETH</p> : <TokenPrice price={earnings} token={token.address} /> }

<button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm" onClick={withdraw}>Withdraw</button>

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
      userEarnings = <p className="text-black text-lg">No Earnings</p>
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
              {isLoading? <Spinner width="20px" height="20px" /> : userEarnings}
            </Popover.Panel>
          </Transition>
        </Popover>
    )
}