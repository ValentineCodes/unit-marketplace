import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  EarningsWithdrawn,
  FeesWithdrawn,
  ItemAuctionDisabled,
  ItemAuctionEnabled,
  ItemBought,
  ItemDeadlineExtended,
  ItemListed,
  ItemPriceUpdated,
  ItemSellerUpdated,
  ItemUnlisted,
  OfferAccepted,
  OfferAmountUpdated,
  OfferCreated,
  OfferDeadlineExtended,
  OfferRemoved,
  OwnershipTransferred
} from "../generated/Unit/Unit"

export function createEarningsWithdrawnEvent(
  owner: Address,
  token: Address,
  amount: BigInt
): EarningsWithdrawn {
  let earningsWithdrawnEvent = changetype<EarningsWithdrawn>(newMockEvent())

  earningsWithdrawnEvent.parameters = new Array()

  earningsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  earningsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  earningsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return earningsWithdrawnEvent
}

export function createFeesWithdrawnEvent(
  feeOwner: Address,
  token: Address,
  amount: BigInt
): FeesWithdrawn {
  let feesWithdrawnEvent = changetype<FeesWithdrawn>(newMockEvent())

  feesWithdrawnEvent.parameters = new Array()

  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("feeOwner", ethereum.Value.fromAddress(feeOwner))
  )
  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesWithdrawnEvent
}

export function createItemAuctionDisabledEvent(
  nft: Address,
  tokenId: BigInt,
  fixedPrice: BigInt
): ItemAuctionDisabled {
  let itemAuctionDisabledEvent = changetype<ItemAuctionDisabled>(newMockEvent())

  itemAuctionDisabledEvent.parameters = new Array()

  itemAuctionDisabledEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemAuctionDisabledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemAuctionDisabledEvent.parameters.push(
    new ethereum.EventParam(
      "fixedPrice",
      ethereum.Value.fromUnsignedBigInt(fixedPrice)
    )
  )

  return itemAuctionDisabledEvent
}

export function createItemAuctionEnabledEvent(
  nft: Address,
  tokenId: BigInt,
  startingPrice: BigInt
): ItemAuctionEnabled {
  let itemAuctionEnabledEvent = changetype<ItemAuctionEnabled>(newMockEvent())

  itemAuctionEnabledEvent.parameters = new Array()

  itemAuctionEnabledEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemAuctionEnabledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemAuctionEnabledEvent.parameters.push(
    new ethereum.EventParam(
      "startingPrice",
      ethereum.Value.fromUnsignedBigInt(startingPrice)
    )
  )

  return itemAuctionEnabledEvent
}

export function createItemBoughtEvent(
  buyer: Address,
  nft: Address,
  tokenId: BigInt,
  token: Address,
  price: BigInt
): ItemBought {
  let itemBoughtEvent = changetype<ItemBought>(newMockEvent())

  itemBoughtEvent.parameters = new Array()

  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemBoughtEvent
}

export function createItemDeadlineExtendedEvent(
  owner: Address,
  nft: Address,
  tokenId: BigInt,
  oldDeadline: BigInt,
  newDeadline: BigInt
): ItemDeadlineExtended {
  let itemDeadlineExtendedEvent = changetype<ItemDeadlineExtended>(
    newMockEvent()
  )

  itemDeadlineExtendedEvent.parameters = new Array()

  itemDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  itemDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "oldDeadline",
      ethereum.Value.fromUnsignedBigInt(oldDeadline)
    )
  )
  itemDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "newDeadline",
      ethereum.Value.fromUnsignedBigInt(newDeadline)
    )
  )

  return itemDeadlineExtendedEvent
}

export function createItemListedEvent(
  owner: Address,
  nft: Address,
  tokenId: BigInt,
  token: Address,
  price: BigInt,
  auction: boolean,
  deadline: BigInt
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("auction", ethereum.Value.fromBoolean(auction))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )

  return itemListedEvent
}

export function createItemPriceUpdatedEvent(
  nft: Address,
  tokenId: BigInt,
  token: Address,
  oldPrice: BigInt,
  newPrice: BigInt
): ItemPriceUpdated {
  let itemPriceUpdatedEvent = changetype<ItemPriceUpdated>(newMockEvent())

  itemPriceUpdatedEvent.parameters = new Array()

  itemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  itemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPrice",
      ethereum.Value.fromUnsignedBigInt(oldPrice)
    )
  )
  itemPriceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return itemPriceUpdatedEvent
}

export function createItemSellerUpdatedEvent(
  nft: Address,
  tokenId: BigInt,
  oldSeller: Address,
  newSeller: Address
): ItemSellerUpdated {
  let itemSellerUpdatedEvent = changetype<ItemSellerUpdated>(newMockEvent())

  itemSellerUpdatedEvent.parameters = new Array()

  itemSellerUpdatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemSellerUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemSellerUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldSeller", ethereum.Value.fromAddress(oldSeller))
  )
  itemSellerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newSeller", ethereum.Value.fromAddress(newSeller))
  )

  return itemSellerUpdatedEvent
}

export function createItemUnlistedEvent(
  owner: Address,
  nft: Address,
  tokenId: BigInt
): ItemUnlisted {
  let itemUnlistedEvent = changetype<ItemUnlisted>(newMockEvent())

  itemUnlistedEvent.parameters = new Array()

  itemUnlistedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  itemUnlistedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  itemUnlistedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemUnlistedEvent
}

export function createOfferAcceptedEvent(
  offerOwner: Address,
  nft: Address,
  tokenId: BigInt,
  token: Address,
  amount: BigInt
): OfferAccepted {
  let offerAcceptedEvent = changetype<OfferAccepted>(newMockEvent())

  offerAcceptedEvent.parameters = new Array()

  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "offerOwner",
      ethereum.Value.fromAddress(offerOwner)
    )
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return offerAcceptedEvent
}

export function createOfferAmountUpdatedEvent(
  offerOwner: Address,
  nft: Address,
  tokenId: BigInt,
  token: Address,
  oldAmount: BigInt,
  newAmount: BigInt
): OfferAmountUpdated {
  let offerAmountUpdatedEvent = changetype<OfferAmountUpdated>(newMockEvent())

  offerAmountUpdatedEvent.parameters = new Array()

  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerOwner",
      ethereum.Value.fromAddress(offerOwner)
    )
  )
  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldAmount",
      ethereum.Value.fromUnsignedBigInt(oldAmount)
    )
  )
  offerAmountUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newAmount",
      ethereum.Value.fromUnsignedBigInt(newAmount)
    )
  )

  return offerAmountUpdatedEvent
}

export function createOfferCreatedEvent(
  offerOwner: Address,
  nft: Address,
  tokenId: BigInt,
  token: Address,
  amount: BigInt,
  deadline: BigInt
): OfferCreated {
  let offerCreatedEvent = changetype<OfferCreated>(newMockEvent())

  offerCreatedEvent.parameters = new Array()

  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "offerOwner",
      ethereum.Value.fromAddress(offerOwner)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  offerCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "deadline",
      ethereum.Value.fromUnsignedBigInt(deadline)
    )
  )

  return offerCreatedEvent
}

export function createOfferDeadlineExtendedEvent(
  offerOwner: Address,
  nft: Address,
  tokenId: BigInt,
  oldDeadline: BigInt,
  newDeadline: BigInt
): OfferDeadlineExtended {
  let offerDeadlineExtendedEvent = changetype<OfferDeadlineExtended>(
    newMockEvent()
  )

  offerDeadlineExtendedEvent.parameters = new Array()

  offerDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "offerOwner",
      ethereum.Value.fromAddress(offerOwner)
    )
  )
  offerDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  offerDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "oldDeadline",
      ethereum.Value.fromUnsignedBigInt(oldDeadline)
    )
  )
  offerDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "newDeadline",
      ethereum.Value.fromUnsignedBigInt(newDeadline)
    )
  )

  return offerDeadlineExtendedEvent
}

export function createOfferRemovedEvent(
  nft: Address,
  tokenId: BigInt,
  offerOwner: Address
): OfferRemoved {
  let offerRemovedEvent = changetype<OfferRemoved>(newMockEvent())

  offerRemovedEvent.parameters = new Array()

  offerRemovedEvent.parameters.push(
    new ethereum.EventParam("nft", ethereum.Value.fromAddress(nft))
  )
  offerRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "offerOwner",
      ethereum.Value.fromAddress(offerOwner)
    )
  )

  return offerRemovedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
