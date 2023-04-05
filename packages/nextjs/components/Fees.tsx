import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";
import { ETH_ADDRESS } from "~~/utils/constants";
import TokenPrice from "./TokenPrice";
import { Spinner } from "./Spinner";
import { useEffect, useState } from "react";
import { getFees } from "~~/apis/subgraphQueries";
import { apolloClient } from "~~/pages/_app";

export type FeeParams = {
    token: string;
}

const Fee = ({token}: FeeParams) => {
 
  const {data: fees} = useScaffoldContractRead({
    contractName: "Unit",
    functionName: "getFees",
    args: [token]
  })

  const {writeAsync: withdraw, isLoading} = useScaffoldContractWrite({
    contractName: "Unit",
    functionName: "withdrawFees",
    args: [token]
  })

  if(fees) {
    return (
      <div className="flex flex-wrap items-center justify-between">
               {token === ETH_ADDRESS? <p>{ethers.utils.formatEther(fees)} ETH</p> : <TokenPrice price={fees} token={token} /> } 
      
      <button className="bg-green-500 hover:bg-black transition-colors duration-300 text-white font-bold rounded-lg px-2 py-1 text-sm" onClick={withdraw}>Withdraw</button>
  </div>
    )
  } else {
    return <Spinner width="20px" height="20px" />
  }
}

export default () => {
  const [fees, setFees] = useState<FeeParams[]>()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apolloClient.query({
      query: getFees()
    }).then(result => {
      setFees(result.data.fees)}).catch(error => {
        console.log(error)
      return
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  let userFees

  if(fees) {
    if(fees.length > 0) {
      userFees = fees?.map(fee => <Fee key={fee.token} token={fee.token} />)
    } else {
      userFees = <p>No fees</p>
    }
  }
 
    return (
        <Popover className="relative">
          <Popover.Button className="bg-black/50 rounded-lg px-4 py-2 font-bold">Fees <ChevronDownIcon className="inline-block w-4"/></Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
            <Popover.Panel className="absolute top-2 bg-white rounded-lg p-2 text-black min-w-[200px]">
            {isLoading? <Spinner width="20px" height="20px" /> : userFees}
            </Popover.Panel>
          </Transition>
        </Popover>
    )
}