import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { HYDRATE } from "next-redux-wrapper";

export interface Listing {
  id?: string;
  owner: string;
  nft: string;
  tokenId: string | number;
  token: string;
  price: string | BigNumber;
  auction: boolean;
  deadline: string | number;
}

export interface ListingState {
  listings: Listing[] | null;
}

const initialState: ListingState = {
  listings: null,
};

export const ListingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    addListings(state, action) {
      state.listings = action.payload;
    },
    addListing(state, action) {
      if (state.listings) {
        state.listings = [action.payload, ...state.listings];
      }
    },
    removeListing(state, action) {
      if (state.listings) {
        state.listings = state.listings.filter(listing => listing.id !== action.payload.id);
      }
    },
    extendDeadline(state, action) {
      if (state.listings) {
        state.listings = state.listings.map(listing => {
          if (listing.id === action.payload.id) {
            return {
              ...listing,
              deadline: Number(listing.deadline) + Number(action.payload.extraTime),
            };
          } else {
            return listing;
          }
        });
      }
    },
    updatePrice(state, action) {
      if (state.listings) {
        state.listings = state.listings.map(listing => {
          if (listing.id === action.payload.id) {
            return {
              ...listing,
              price: action.payload.newPrice,
            };
          } else {
            return listing;
          }
        });
      }
    },
    enableAuction(state, action) {
      if (state.listings) {
        state.listings = state.listings.map(listing => {
          if (listing.id === action.payload.id) {
            return {
              ...listing,
              auction: true,
              price: action.payload.startingPrice,
            };
          } else {
            return listing;
          }
        });
      }
    },
    disableAuction(state, action) {
      if (state.listings) {
        state.listings = state.listings.map(listing => {
          if (listing.id === action.payload.id) {
            return {
              ...listing,
              auction: false,
              price: action.payload.newPrice,
            };
          } else {
            return listing;
          }
        });
      }
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.listings,
      };
    },
  },
});

export const { addListings, addListing, removeListing, extendDeadline, updatePrice, enableAuction, disableAuction } =
  ListingsSlice.actions;

export const selectListings = state => state.listings.listings;

export default ListingsSlice.reducer;
