import { createSlice } from "@reduxjs/toolkit";
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

export const { addListings, addListing, extendDeadline, updatePrice } = ListingsSlice.actions;

export const selectListings = state => state.listings;

export default ListingsSlice.reducer;
