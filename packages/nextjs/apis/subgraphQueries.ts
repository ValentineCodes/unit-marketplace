import { gql } from "@apollo/client";
import { Listing } from "~~/components/Listings";

export const getListings = () => {
  return gql`
    {
      listings(where: {deadline_gt: "${Math.floor(Date.now() / 1000)}"}) {
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
  `;
};

export const getOffers = (listing: Listing) => {
  return gql`
    {
      offers(where: {nft: "${listing.nft}", tokenId: "${listing.tokenId}", deadline_lte: "${listing.deadline}" }) {
        id
        owner
        nft
        tokenId
        token
        amount
        deadline
      }
    }
  `;
};

export const getEarnings = (owner: string) => {
  return gql`
    {
      earnings(where: {owner: "${owner}"}) {
        id
        owner
        token
      }
    }
  `;
};

export const getFees = () => {
  return gql`
    {
      fees {
        token
      }
    }
  `;
};
