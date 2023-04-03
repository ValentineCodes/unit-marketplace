import { useQuery } from "@apollo/client";
import { GET_LISTINGS } from "~~/apis/subgraphQueries";
import NFTCard from "./cards/NFTCard";

export function Listings() {
    const {loading, error, data} = useQuery(GET_LISTINGS)
    
    return (
        <div className="flex flex-wrap justify-center items-center gap-5 my-10">
{[1,2,3,4,5,6,7,8,9].map(item => <NFTCard />)}
        </div>
    )
}