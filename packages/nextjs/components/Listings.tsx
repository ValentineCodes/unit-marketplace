import { useQuery, gql } from "@apollo/client";
import { getListings } from "~~/apis/subgraphQueries";
import ListingCard from "./cards/ListingCard";
import { BigNumber } from "ethers";
import { apolloClient } from "~~/pages/_app";
import { useState } from "react";
import { notification } from "~~/utils/scaffold-eth";
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

    apolloClient.query({
        query: getListings()
      }).then(result => setListings(result.data.listings)).catch(error => {
        return
      })
    return (
        <div className="flex flex-wrap justify-center items-center gap-5 my-10">
            {listings? listings?.map((item: Listing) => <ListingCard key={item.id} listing={item} />) : listings?.length === 0 ? <h3>No Listings</h3>:  <Spinner width="50px" height="50px" />}
        </div>
    )
}