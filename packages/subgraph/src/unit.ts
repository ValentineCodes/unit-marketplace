import {
  EarningsWithdrawn as EarningsWithdrawnEvent,
  FeesWithdrawn as FeesWithdrawnEvent,
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
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/Unit/Unit"
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
} from "../generated/schema"

export function handleEarningsWithdrawn(event: EarningsWithdrawnEvent): void {
  let entity = new EarningsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeesWithdrawn(event: FeesWithdrawnEvent): void {
  let entity = new FeesWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeOwner = event.params.feeOwner
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemAuctionDisabled(
  event: ItemAuctionDisabledEvent
): void {
  let entity = new ItemAuctionDisabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.fixedPrice = event.params.fixedPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemAuctionEnabled(event: ItemAuctionEnabledEvent): void {
  let entity = new ItemAuctionEnabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.startingPrice = event.params.startingPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let entity = new ItemBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemDeadlineExtended(
  event: ItemDeadlineExtendedEvent
): void {
  let entity = new ItemDeadlineExtended(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.oldDeadline = event.params.oldDeadline
  entity.newDeadline = event.params.newDeadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let entity = new ItemListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.price = event.params.price
  entity.auction = event.params.auction
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemPriceUpdated(event: ItemPriceUpdatedEvent): void {
  let entity = new ItemPriceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.oldPrice = event.params.oldPrice
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemSellerUpdated(event: ItemSellerUpdatedEvent): void {
  let entity = new ItemSellerUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.oldSeller = event.params.oldSeller
  entity.newSeller = event.params.newSeller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleItemUnlisted(event: ItemUnlistedEvent): void {
  let entity = new ItemUnlisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferAccepted(event: OfferAcceptedEvent): void {
  let entity = new OfferAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerOwner = event.params.offerOwner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferAmountUpdated(event: OfferAmountUpdatedEvent): void {
  let entity = new OfferAmountUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerOwner = event.params.offerOwner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.oldAmount = event.params.oldAmount
  entity.newAmount = event.params.newAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferCreated(event: OfferCreatedEvent): void {
  let entity = new OfferCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerOwner = event.params.offerOwner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferDeadlineExtended(
  event: OfferDeadlineExtendedEvent
): void {
  let entity = new OfferDeadlineExtended(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offerOwner = event.params.offerOwner
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.oldDeadline = event.params.oldDeadline
  entity.newDeadline = event.params.newDeadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOfferRemoved(event: OfferRemovedEvent): void {
  let entity = new OfferRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.offerOwner = event.params.offerOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
