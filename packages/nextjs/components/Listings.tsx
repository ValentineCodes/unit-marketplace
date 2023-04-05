import { useQuery, gql } from "@apollo/client";
import { getListings } from "~~/apis/subgraphQueries";
import ListingCard from "./cards/ListingCard";
import { BigNumber } from "ethers";
import { apolloClient } from "~~/pages/_app";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

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
    const [isLoading, setIsLoading] = useState(true)
 

      useEffect(() => {
        apolloClient.query({
            query: getListings()
          }).then(result => setListings(result.data.listings)).catch(error => {
            return
          }).finally(() => {
            setIsLoading(false)
          })
      } , [])

      let allListings

      if(listings) {
        if(listings.length > 0) {
          allListings = listings.map((item: Listing) => <ListingCard key={item.id} listing={item} />)
        } else {
          allListings = <p>No Listings</p>
        }
      }

    return (
        <div className="flex flex-wrap justify-center items-center gap-5 my-10">
          {isLoading? <Spinner width="40px" height="40px" /> : allListings}
        </div>
    )
}