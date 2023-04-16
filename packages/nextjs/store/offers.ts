import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { HYDRATE } from "next-redux-wrapper";

export interface Offer {
  id: string;
  owner: string;
  nft: string;
  tokenId: string | number;
  token: string;
  amount: string | BigNumber;
  deadline: string | number;
}

export interface OfferState {
  offers: Offer[] | null;
}

const initialState: OfferState = {
  offers: null,
};

export const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    addOffers(state, action) {
      state.offers = action.payload;
    },
    addOffer(state, action) {
      if (state.offers) {
        state.offers = [action.payload, ...state.offers];
      }
    },
    removeOffer(state, action) {
      if (state.offers) {
        state.offers = state.offers.filter(offer => offer.id !== action.payload.id);
      }
    },
    extendDeadline(state, action) {
      if (state.offers) {
        state.offers = state.offers.map(offer => {
          if (offer.id === action.payload.id) {
            return {
              ...offer,
              deadline: Number(offer.deadline) + Number(action.payload.extraTime),
            };
          } else {
            return offer;
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

export const { addOffers, addOffer, removeOffer, extendDeadline } = offersSlice.actions;

export const selectOffers = state => state.offers.offers;

export default offersSlice.reducer;
