import { gql } from "@apollo/client";

export const GET_LISTINGS = gql`
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
