// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import {IUnit} from "./interfaces/IUnit.sol";
import {Errors} from "./interfaces/Errors.sol";

import {DataTypes} from "./libraries/types/DataTypes.sol";
import {ListLogic} from "./libraries/logic/ListLogic.sol";
import {BuyLogic} from "./libraries/logic/BuyLogic.sol";
import {OfferLogic} from "./libraries/logic/OfferLogic.sol";
import {WithdrawLogic} from "./libraries/logic/WithdrawLogic.sol";

contract Unit is IUnit, Ownable, Errors {
  using ECDSA for bytes32;

  address private constant ETH = address(0);

  mapping(address => mapping(uint256 => DataTypes.Listing)) private s_listings; // nft => token id => DataTypes.Listing

  mapping(address => mapping(address => mapping(uint256 => DataTypes.Offer))) private s_offers; // offerOwner => nft => tokenId => Offer

  mapping(address => mapping(address => uint256)) private s_earnings; // owner > token > amount

  mapping(address => uint256) private s_fees; // token => amount

  modifier isListed(address nft, uint256 tokenId) {
    DataTypes.Listing memory listing = s_listings[nft][tokenId];
    if (listing.price <= 0) revert Unit__ItemNotListed(nft, tokenId);
    _;
  }

  modifier isNotListed(address nft, uint256 tokenId) {
    DataTypes.Listing memory listing = s_listings[nft][tokenId];
    if (listing.price > 0) revert Unit__ItemListed(nft, tokenId);
    _;
  }

  modifier isOwner(
    address nft,
    uint256 tokenId,
    address spender
  ) {
    IERC721 _nft = IERC721(nft);
    if (_nft.ownerOf(tokenId) != spender) revert Unit__NotOwner();
    _;
  }

  // TO-DO: Batch Listing and Unlisting

  // Zero deadline => No deadline

  function listItemUsingPermit(
    address nft,
    uint256 tokenId,
    uint256 price,
    uint256 deadline,
    DataTypes.Signature calldata sig
  ) external override isNotListed(nft, tokenId) {
    if (nft == address(0)) revert Unit__ZeroAddress();

    bytes32 hash = getListTxHash(nft, tokenId, price, deadline);

    address signer = recover(hash, sig);

    ListLogic.listItem(s_listings, signer, nft, tokenId, ETH, price, false, deadline);
  }

  function listItemWithTokenUsingPermit(
    address nft,
    uint256 tokenId,
    address token,
    uint256 price,
    bool auction,
    uint256 deadline,
    DataTypes.Signature calldata sig
  ) external override isNotListed(nft, tokenId) {
    if (nft == address(0) || token == address(0)) revert Unit__ZeroAddress();

    bytes32 hash = getListWithTokenTxHash(nft, tokenId, token, price, auction, deadline);

    address signer = recover(hash, sig);

    ListLogic.listItem(s_listings, signer, nft, tokenId, token, price, auction, deadline);
  }

  function buyUsingPermit(address nft, uint256 tokenId, DataTypes.Signature calldata sig) external payable override {
    // Allow free purchase for items one eth or more
    if (s_listings[nft][tokenId].price < 1e18) revert Unit__ItemPriceLessThanOneEth();

    bytes32 hash = getBuyTxHash(nft, tokenId, msg.value);

    address signer = recover(hash, sig);

    BuyLogic.buyItem(s_listings, s_earnings, s_fees, signer, nft, tokenId, msg.value);
  }

  function buyWithTokenUsingPermit(
    address nft,
    uint256 tokenId,
    address token,
    uint256 amount,
    DataTypes.Signature calldata sig
  ) external override {
    bytes32 hash = getBuyWithTokenTxHash(nft, tokenId, token, amount);

    address signer = recover(hash, sig);

    BuyLogic.buyItemWithToken(s_listings, s_earnings, s_fees, signer, nft, tokenId, token, amount);
  }

  function acceptOfferUsingPermit(
    address offerOwner,
    address nft,
    uint256 tokenId,
    DataTypes.Signature calldata sig
  ) external override {
    bytes32 hash = getAcceptOfferTxHash(offerOwner, nft, tokenId);

    address signer = recover(hash, sig);

    if (IERC721(nft).ownerOf(tokenId) != signer) revert Unit__NotOwner();

    OfferLogic.acceptOffer(s_listings, s_offers, s_earnings, s_fees, offerOwner, nft, tokenId);
  }

  function listItem(
    address nft,
    uint256 tokenId,
    uint256 price,
    uint256 deadline
  ) external override isNotListed(nft, tokenId) {
    if (nft == address(0)) revert Unit__ZeroAddress();

    ListLogic.listItem(s_listings, msg.sender, nft, tokenId, ETH, price, false, deadline);
  }

  function listItemWithToken(
    address nft,
    uint256 tokenId,
    address token,
    uint256 price,
    bool auction,
    uint256 deadline
  ) external override isNotListed(nft, tokenId) {
    if (nft == address(0) || token == address(0)) revert Unit__ZeroAddress();

    ListLogic.listItem(s_listings, msg.sender, nft, tokenId, token, price, auction, deadline);
  }

  function unlistItem(
    address nft,
    uint256 tokenId
  ) external override isOwner(nft, tokenId, msg.sender) isListed(nft, tokenId) {
    ListLogic.unlistItem(s_listings, nft, tokenId);
  }

  function updateItemSeller(
    address nft,
    uint256 tokenId,
    address newSeller
  ) external override isOwner(nft, tokenId, newSeller) {
    ListLogic.updateItemSeller(s_listings, nft, tokenId, newSeller);
  }

  function updateItemPrice(
    address nft,
    uint256 tokenId,
    uint256 newPrice
  ) external override isOwner(nft, tokenId, msg.sender) {
    ListLogic.updateItemPrice(s_listings, nft, tokenId, newPrice);
  }

  function extendItemDeadline(
    address nft,
    uint256 tokenId,
    uint256 extraTime
  ) external override isOwner(nft, tokenId, msg.sender) {
    ListLogic.extendItemDeadline(s_listings, nft, tokenId, extraTime);
  }

  function enableAuction(
    address nft,
    uint256 tokenId,
    uint256 newPrice // starting price (Optional)
  ) external override isOwner(nft, tokenId, msg.sender) {
    ListLogic.enableAuction(s_listings, nft, tokenId, newPrice);
  }

  function disableAuction(
    address nft,
    uint256 tokenId,
    uint256 newPrice // fixed price (Optional)
  ) external override isOwner(nft, tokenId, msg.sender) {
    ListLogic.disableAuction(s_listings, nft, tokenId, newPrice);
  }

  function buyItem(address nft, uint256 tokenId) external payable override {
    BuyLogic.buyItem(s_listings, s_earnings, s_fees, msg.sender, nft, tokenId, msg.value);
  }

  function buyItemWithToken(address nft, uint256 tokenId, address token, uint256 amount) external override {
    BuyLogic.buyItemWithToken(s_listings, s_earnings, s_fees, msg.sender, nft, tokenId, token, amount);
  }

  function createOffer(
    address nft,
    uint256 tokenId,
    address token,
    uint256 amount,
    uint256 deadline
  ) external override {
    OfferLogic.createOffer(s_listings, s_offers, nft, tokenId, token, amount, deadline);
  }

  function acceptOffer(
    address offerOwner,
    address nft,
    uint256 tokenId
  ) external override isOwner(nft, tokenId, msg.sender) {
    OfferLogic.acceptOffer(s_listings, s_offers, s_earnings, s_fees, offerOwner, nft, tokenId);
  }

  function extendOfferDeadline(address nft, uint256 tokenId, uint256 extraTime) external override {
    OfferLogic.extendOfferDeadline(s_listings, s_offers, nft, tokenId, extraTime);
  }

  function removeOffer(address nft, uint256 tokenId) external override {
    OfferLogic.removeOffer(s_listings, s_offers, nft, tokenId);
  }

  function withdrawEarnings(address token) external override {
    WithdrawLogic.withdrawEarnings(s_earnings, token);
  }

  function withdrawFees(address token) external override onlyOwner {
    WithdrawLogic.withdrawFees(s_fees, token);
  }

  function getListing(address nft, uint256 tokenId) external view override returns (DataTypes.Listing memory) {
    return s_listings[nft][tokenId];
  }

  // Zero address => ETH
  function getEarnings(address seller, address token) external view override returns (uint256) {
    return s_earnings[seller][token];
  }

  // Zero address => ETH
  function getFees(address token) external view override returns (uint256) {
    return s_fees[token];
  }

  function getOffer(
    address offerOwner,
    address nft,
    uint256 tokenId
  ) external view override returns (DataTypes.Offer memory) {
    return s_offers[offerOwner][nft][tokenId];
  }

  function getListTxHash(address nft, uint256 tokenId, uint256 price, uint256 deadline) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nft, tokenId, price, deadline));
  }

  function getListWithTokenTxHash(
    address nft,
    uint256 tokenId,
    address token,
    uint256 price,
    bool auction,
    uint256 deadline
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nft, tokenId, token, price, auction, deadline));
  }

  function getBuyTxHash(address nft, uint256 tokenId, uint256 amount) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nft, tokenId, amount));
  }

  function getBuyWithTokenTxHash(
    address nft,
    uint256 tokenId,
    address token,
    uint256 amount
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nft, tokenId, token, amount));
  }

  function getAcceptOfferTxHash(address offerOwner, address nft, uint256 tokenId) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(offerOwner, nft, tokenId));
  }

  function recover(bytes32 hash, DataTypes.Signature calldata sig) private pure returns (address) {
    return hash.toEthSignedMessageHash().recover(sig.v, sig.r, sig.s);
  }
}
