import {
  EarningsWithdrawn as EarningWithdrawnEvent,
  FeesWithdrawn as FeeWithdrawnEvent,
  ItemAuctionDisabled as ItemAuctionDisabledEvent,
  ItemAuctionEnabled as ItemAuctionEnabledEvent,
  ItemBought as ItemBoughtEvent,
  ItemDeadlineExtended as ItemDeadlineExtendedEvent,
  ItemListed as ItemListedEvent,
  ItemPriceUpdated as ItemPriceUpdatedEvent,
  ItemSellerUpdated as ItemSellerUpdatedEvent,
  ItemUnlisted as ItemUnlistedEvent,
  OfferAccepted as OfferAcceptedEvent,
  OfferAmountUpdated as OfferAmountUpdatedEvent,
  OfferCreated as OfferCreatedEvent,
  OfferDeadlineExtended as OfferDeadlineExtendedEvent,
  OfferRemoved as OfferRemovedEvent,
} from "../generated/Unit/Unit";
import { Earning, Fee, Listing, Offer } from "../generated/schema";
import { Address, BigInt, Bytes, store } from "@graphprotocol/graph-ts";

const computeItemId = (nft: Address, tokenId: BigInt): Bytes => {
  return nft.concatI32(tokenId.toI32());
};

const computeOfferId = (
  owner: Address,
  nft: Address,
  tokenId: BigInt
): Bytes => {
  return owner.concatI32(nft.toI32()).concatI32(tokenId.toI32());
};

export function handleItemListed(event: ItemListedEvent): void {
  let listing = new Listing(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  listing.owner = event.params.owner;
  listing.nft = event.params.nft;
  listing.tokenId = event.params.tokenId;
  listing.token = event.params.token;
  listing.price = event.params.price;
  listing.auction = event.params.auction;
  listing.deadline = event.params.deadline;

  listing.blockTimestamp = event.block.timestamp;

  listing.save();
}

export function handleItemPriceUpdated(event: ItemPriceUpdatedEvent): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  if (listing) {
    listing.price = event.params.newPrice;

    listing.save();
  }
}

export function handleItemSellerUpdated(event: ItemSellerUpdatedEvent): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  if (listing) {
    listing.owner = event.params.newSeller;

    listing.save();
  }
}

export function handleItemUnlisted(event: ItemUnlistedEvent): void {
  store.remove(
    "Listing",
    computeItemId(event.params.nft, event.params.tokenId).toHexString()
  );
}

export function handleItemAuctionDisabled(
  event: ItemAuctionDisabledEvent
): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  if (listing) {
    listing.auction = false;
    if (event.params.fixedPrice.notEqual(BigInt.zero())) {
      listing.price = event.params.fixedPrice;
    }

    listing.save();
  }
}

export function handleItemAuctionEnabled(event: ItemAuctionEnabledEvent): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  if (listing) {
    listing.auction = true;
    if (event.params.startingPrice.notEqual(BigInt.zero())) {
      listing.price = event.params.startingPrice;
    }

    listing.save();
  }
}

export function handleItemDeadlineExtended(
  event: ItemDeadlineExtendedEvent
): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  if (listing) {
    listing.deadline = event.params.newDeadline;

    listing.save();
  }
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  let earnings = Earning.load(
    listing!.owner.concatI32(event.params.token.toI32())
  );

  if (!earnings) {
    earnings = new Earning(
      listing!.owner.concatI32(event.params.token.toI32())
    );

    earnings.owner = listing!.owner;
    earnings.token = event.params.token;

    earnings.save();
  }
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  let offer = new Offer(
    computeOfferId(
      event.params.offerOwner,
      event.params.nft,
      event.params.tokenId
    )
  );

  offer.owner = event.params.offerOwner;
  offer.nft = event.params.nft;
  offer.tokenId = event.params.tokenId;
  offer.token = event.params.token;
  offer.amount = event.params.amount;
  offer.deadline = event.params.deadline;

  offer.blockTimestamp = event.block.timestamp;

  offer.save();
}

export function handleOfferAccepted(event: OfferAcceptedEvent): void {
  let listing = Listing.load(
    computeItemId(event.params.nft, event.params.tokenId)
  );

  let earnings = Earning.load(
    listing!.owner.concatI32(event.params.token.toI32())
  );

  if (!earnings) {
    earnings = new Earning(
      listing!.owner.concatI32(event.params.token.toI32())
    );

    earnings.owner = listing!.owner;
    earnings.token = event.params.token;

    earnings.save();
  }

  store.remove(
    "Listing",
    computeItemId(event.params.nft, event.params.tokenId).toHexString()
  );

  store.remove(
    "Offer",
    computeOfferId(
      event.params.offerOwner,
      event.params.nft,
      event.params.tokenId
    ).toHexString()
  );
}

export function handleOfferAmountUpdated(event: OfferAmountUpdatedEvent): void {
  let offer = Offer.load(
    computeOfferId(
      event.params.offerOwner,
      event.params.nft,
      event.params.tokenId
    )
  );

  if (offer) {
    offer.amount = event.params.newAmount;

    offer.save();
  }
}

export function handleOfferDeadlineExtended(
  event: OfferDeadlineExtendedEvent
): void {
  let offer = Offer.load(
    computeOfferId(
      event.params.offerOwner,
      event.params.nft,
      event.params.tokenId
    )
  );

  if (offer) {
    offer.deadline = event.params.newDeadline;

    offer.save();
  }
}

export function handleOfferRemoved(event: OfferRemovedEvent): void {
  store.remove(
    "Offer",
    computeOfferId(
      event.params.offerOwner,
      event.params.nft,
      event.params.tokenId
    ).toHexString()
  );
}

export function handleEarningWithdrawn(event: EarningWithdrawnEvent): void {
  store.remove(
    "Earning",
    event.params.owner.concatI32(event.params.token.toI32()).toHexString()
  );
}

export function handleFeeWithdrawn(event: FeeWithdrawnEvent): void {
  let entity = new Fee(event.params.token);

  entity.owner = event.params.feeOwner;
  entity.token = event.params.token;

  entity.save();
}
