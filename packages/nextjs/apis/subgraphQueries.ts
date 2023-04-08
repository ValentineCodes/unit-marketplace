import { gql } from "@apollo/client";

export const getListings = () => {
  return gql`
    {
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
  `;
};

export const getOffers = (nft: string, tokenId: string) => {
  // TO-DO: deadline must be > current time
  return gql`
    {
      offers(where: {nft: "${nft}", tokenId: "${tokenId}"}) {
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
