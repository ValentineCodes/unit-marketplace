# 🌛Unit - NFT Marketplace🌜

[Unit](https://unit-valentinecodes.vercel.app/) is a Decentralized NFT Marketplace. It allows NFT owners to list their NFTs for a fixed price or put them up for auction. A seller can also toggle between fixed price listing and auction at any time.

## How it works

### [Video Demo](https://www.youtube.com/watch?v=M6UHlhepcBo)

NFTs can be listed for sale at fixed prices with ETH or ERC20 tokens. Auctioned items are listed with tokens. To avoid keeping offers in the contract, Offers are only allowed with tokens due to the approve pattern which isn't yet possible with ETH and can only be accepted by the item seller within the specified deadline.
Items listed at fixed prices can be bought before the specified deadline. After an item is bought or an offer is accepted, Unit keeps track of the earnings and fees which can be withdrawn at any time.

# Local Development

### Install dependencies:

```shell
yarn
```

### Run unit tests:

```shell
yarn hardhat:test
```

### Deploy contracts:

```shell
yarn deploy:goerli
```

### Run frontend:

```shell
yarn start
```

# Acknowledgements

- [ScaffoldETH V2](https://github.com/scaffold-eth/se-2)
- [Patrick Collins | FreeCodeCamp](https://github.com/smartcontractkit/full-blockchain-solidity-course-js)
