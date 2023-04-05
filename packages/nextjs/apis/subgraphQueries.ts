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

export const getEarnings = (owner: string) => {
  return gql`
    {
      earnings(where: {owner: "${owner}"}) {
        id
        owner
        address
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
