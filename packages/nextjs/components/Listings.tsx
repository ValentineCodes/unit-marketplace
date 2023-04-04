import { useQuery, gql } from "@apollo/client";
import { getListings } from "~~/apis/subgraphQueries";
import ListingCard from "./cards/ListingCard";
import { BigNumber } from "ethers";
import { apolloClient } from "~~/pages/_app";
import { useState } from "react";

export type Listing = {
    id?: string;
    owner: string,
    nft: string,
    tokenId: string | number,
    token: string,
    price: string | BigNumber,
    auction: boolean,
    deadline: string | number
}
export function Listings() {
    // const {loading, error, data} = useQuery(getListings())
    const [listings, setListings] = useState<Listing[]>()

    apolloClient.query({
        query: gql`
        query GetListings{
          listings {
            id
            owner
            nft
            tokenId
            token
            price
            auction
            deadline
          }
        }
      `
      }).then(result => setListings(result.data.listings))
    return (
        <div className="flex flex-wrap justify-center items-center gap-5 my-10">
            { listings?.map((item: Listing) => <ListingCard key={item.id} listing={item}  />)}
        </div>
    )
}