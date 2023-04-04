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
