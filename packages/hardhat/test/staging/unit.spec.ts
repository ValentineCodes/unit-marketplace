import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { DAI, MyNFT, Unit } from "../../typechain";

import { ETH_ADDRESS } from "../../utils/constants";
import { formatDate, formatCurrency } from "../../utils/helperFunctions";
import { DataTypes } from "../../typechain/contracts/Unit";

developmentChains.includes(network.name)
  ? describe.skip
  : describe(`Unit: NFT Marketplace`, async () => {
      const ONE_ETH = ethers.utils.parseEther("1");
      // Contracts
      let unit: Unit;
      let ogre: MyNFT;
      let dai: DAI;

      // Testers / Signers
      let Valentine: SignerWithAddress;
      let Ugochukwu: SignerWithAddress;
      let Orga: SignerWithAddress;

      beforeEach(async () => {
        const signers: SignerWithAddress[] = await ethers.getSigners();

        // Testers / Signers
        Valentine = signers[0];
        Ugochukwu = signers[1];
        Orga = signers[2];

        // contracts
        unit = await ethers.getContract("Unit", Ugochukwu);
        ogre = await ethers.getContract("MyNFT", Ugochukwu);
        dai = await ethers.getContract("DAI", Ugochukwu);
      });

      /** Helper functions */

      // List item - ETH price only
      const listItem = async (
        nft: string,
        tokenId: number,
        amount: BigNumber,
        deadline: number
      ) => {
        // Approve Unit to spend token
        await ogre.approve(unit.address, tokenId);
        await unit.listItem(nft, tokenId, amount, deadline);
      };

      // List item - Token price only
      const listItemWithToken = async (
        nft: string,
        tokenId: number,
        token: string,
        amount: BigNumber,
        auction: boolean,
        deadline: number
      ) => {
        // Approve Unit to spend token
        await ogre.approve(unit.address, tokenId);
        await unit.listItemWithToken(
          nft,
          tokenId,
          token,
          amount,
          auction,
          deadline
        );
      };

      // Program flow to create an offer
      const createOffer = async (
        nft: string,
        tokenId: number,
        token: string,
        amount: BigNumber,
        deadline: number
      ): Promise<BigNumber> => {
        await listItem(ogre.address, 0, ONE_ETH, 3600);

        const blockTimestamp = await getBlockTimestamp();
        const listingDeadline = BigNumber.from(blockTimestamp + 3600);

        await dai.transfer(Orga.address, amount);
        await dai.connect(Orga).approve(unit.address, amount);

        await unit
          .connect(Orga)
          .createOffer(nft, tokenId, token, amount, deadline);

        return listingDeadline;
      };

      // Program flow to Buy items listed with token price
      const buyItemWithToken = async () => {
        await listItemWithToken(
          ogre.address,
          0,
          dai.address,
          ONE_ETH,
          false,
          3600
        );

        await dai.transfer(Orga.address, ONE_ETH);
        await dai.connect(Orga).approve(unit.address, ONE_ETH);
        await unit
          .connect(Orga)
          .buyItemWithToken(ogre.address, 0, dai.address, ONE_ETH);
      };

      const getBlockTimestamp = async (): Promise<number> => {
        const blockNumber = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNumber);

        return block.timestamp;
      };

      /**
       * @test
       */
      describe("💬listItem", () => {
        it("lists item and emits an event", async () => {
          console.log("Approving Unit to spend OGRE🐸...");
          await ogre.approve(unit.address, 0);
          console.log("Approved✅");
          console.log("-------------------------------");

          const item = {
            nft: ogre.address,
            tokenId: 0,
            price: ONE_ETH,
            deadline: 3600,
          };
          console.log("Listing item...");
          console.log("Params: ", {
            ...item,
            price: formatCurrency(item.price, "ETH🔷"),
            deadline: item.deadline + " seconds",
          });

          await expect(
            unit.listItem(item.nft, item.tokenId, item.price, item.deadline)
          )
            .to.emit(unit, "ItemListed")
            .withArgs(
              Ugochukwu.address,
              ogre.address,
              0,
              ETH_ADDRESS,
              ONE_ETH,
              false,
              async (deadline: BigNumber) => {
                const blockTimestamp: number = await getBlockTimestamp();

                return (
                  (blockTimestamp + 3600).toString() === deadline.toString()
                );
              }
            );

          const blockTimestamp: number = await getBlockTimestamp();

          const listing: DataTypes.ListingStructOutput = await unit.getListing(
            ogre.address,
            0
          );
          console.log("------------------------------------");
          console.log("Item listed✅");
          console.log({
            seller: listing.seller,
            nft: listing.nft,
            tokenId: 0,
            token: listing.token,
            price: formatCurrency(listing.price, "ETH🔷"),
            auction: listing.auction,
            deadline: formatDate(listing.deadline.toNumber()),
          });

          expect(listing.seller).to.eq(Ugochukwu.address);
          expect(listing.nft).to.eq(ogre.address);
          expect(listing.tokenId).to.eq(0);
          expect(listing.token).to.eq(ETH_ADDRESS);
          expect(listing.price).to.eq(ONE_ETH);
          expect(listing.auction).to.eq(false);
          expect(listing.deadline.toString()).to.eq(
            (blockTimestamp + 3600).toString()
          );
        });
      });

      /**
       * @test
       */
      describe("💬listItemWithToken", () => {
        it("lists item and emits an event", async () => {
          console.log("Approving Unit to spend OGRE🐸...");
          await ogre.mintNft();

          await ogre.approve(unit.address, 1);
          console.log("Approved✅");
          console.log("---------------------------------");
          const item = {
            nft: ogre.address,
            tokenId: 1,
            token: dai.address,
            price: ONE_ETH,
            auction: false,
            deadline: 3600,
          };
          console.log("Listing item...");
          console.log("Params: ", {
            ...item,
            token: item.token,
            price: formatCurrency(item.price, "DAI🔶"),
            deadline: item.deadline + " seconds",
          });
          await expect(
            unit.listItemWithToken(
              item.nft,
              item.tokenId,
              item.token,
              item.price,
              item.auction,
              item.deadline
            )
          )
            .to.emit(unit, "ItemListed")
            .withArgs(
              Ugochukwu.address,
              ogre.address,
              1,
              dai.address,
              ONE_ETH,
              false,
              async (deadline: BigNumber) => {
                const blockTimestamp: number = await getBlockTimestamp();

                return (
                  deadline.toString() === (blockTimestamp + 3600).toString()
                );
              }
            );
          console.log("------------------------------------");
          console.log("Item listed✅");

          const blockTimestamp: number = await getBlockTimestamp();

          const listing = await unit.getListing(ogre.address, 1);
          console.log({
            seller: listing.seller,
            nft: listing.nft,
            tokenId: listing.tokenId.toNumber(),
            token: listing.token,
            price: formatCurrency(listing.price, "DAI🔶"),
            auction: listing.auction,
            deadline: formatDate(listing.deadline.toNumber()),
          });

          expect(listing.seller).to.eq(Ugochukwu.address);
          expect(listing.nft).to.eq(ogre.address);
          expect(listing.tokenId).to.eq(1);
          expect(listing.token).to.eq(dai.address);
          expect(listing.price).to.eq(ONE_ETH);
          expect(listing.auction).to.eq(false);
          expect(listing.deadline.toString()).to.eq(
            (blockTimestamp + 3600).toString()
          );
        });
      });

      /**
       * @test
       */
      describe("💬updateItemSeller", () => {
        it("updates seller and emits an event", async () => {
          console.log("Prev seller: ", Ugochukwu.address);

          console.log("Transfering OGRE to", Orga.address);
          await ogre.transferFrom(Ugochukwu.address, Orga.address, 1);

          await ogre.connect(Orga).approve(unit.address, 1);

          console.log("Updating seller...");
          await expect(unit.updateItemSeller(ogre.address, 1, Orga.address))
            .to.emit(unit, "ItemSellerUpdated")
            .withArgs(ogre.address, 1, Ugochukwu.address, Orga.address);

          const listing = await unit.getListing(ogre.address, 1);
          console.log("New seller: ", listing.seller);

          expect(listing.seller).to.eq(Orga.address);
        });
      });

      /**
       * @test
       */
      describe("💬updateItemPrice", () => {
        const newPrice = ethers.utils.parseEther("1.5");

        it("updates price and emits an event", async () => {
          console.log(
            "Prev price: ",
            ethers.utils.formatEther(ONE_ETH),
            "ETH🔷"
          );

          console.log(
            "Updating price to ",
            ethers.utils.formatEther(newPrice),
            "ETH🔷"
          );
          await expect(
            unit.connect(Orga).updateItemPrice(ogre.address, 1, newPrice)
          )
            .to.emit(unit, "ItemPriceUpdated")
            .withArgs(ogre.address, 1, dai.address, ONE_ETH, newPrice);

          const listing = await unit.getListing(ogre.address, 1);
          console.log(
            "New price: ",
            ethers.utils.formatEther(newPrice),
            "ETH🔷"
          );

          expect(listing.price).to.eq(newPrice);
        });
      });

      /**
       * @test
       */
      describe("💬extendItemDeadline", () => {
        const extraTime = 1200;
        it("extends deadline and emits an event", async () => {
          const listingA = await unit.getListing(ogre.address, 1);
          console.log(
            "Prev deadline: ",
            formatDate(listingA.deadline.toNumber())
          );

          const newDeadline = listingA.deadline.add(extraTime).toString();
          console.log("Extending deadline by ", extraTime, "seconds");

          await expect(
            unit.connect(Orga).extendItemDeadline(ogre.address, 1, extraTime)
          )
            .to.emit(unit, "ItemDeadlineExtended")
            .withArgs(
              Orga.address,
              ogre.address,
              1,
              listingA.deadline.toString(),
              newDeadline
            );

          const listingB = await unit.getListing(ogre.address, 1);
          console.log(
            "New deadline: ",
            formatDate(listingB.deadline.toNumber())
          );

          expect(listingB.deadline.toString()).to.eq(newDeadline);
        });
      });

      /**
       * @test
       */
      describe("💬enableAuction", async () => {
        const startingPrice: BigNumber = ethers.utils.parseEther("1.5");

        it("sets item price as starting price if specified, enables auction and emits an event", async () => {
          await expect(
            unit.connect(Orga).enableAuction(ogre.address, 1, startingPrice)
          )
            .to.emit(unit, "ItemAuctionEnabled")
            .withArgs(ogre.address, 1, startingPrice);

          const listing = await unit.getListing(ogre.address, 1);
          expect(listing.price).to.eq(startingPrice);
          expect(listing.auction).to.eq(true);
        });

        it("only enables auction on items listed with token price", async () => {
          await expect(
            unit.enableAuction(ogre.address, 0, startingPrice)
          ).to.revertedWithCustomError(unit, "Unit__ItemPriceInEth");
        });
      });

      // /**
      //  * @test
      //  */
      describe("💬disableAuction", () => {
        const fixedPrice: BigNumber = ethers.utils.parseEther("2.5");

        it("sets item price as fixed price if specified, disables auction and emits an event", async () => {
          await expect(
            unit.connect(Orga).disableAuction(ogre.address, 1, fixedPrice)
          )
            .to.emit(unit, "ItemAuctionDisabled")
            .withArgs(ogre.address, 1, fixedPrice);

          const listing = await unit.getListing(ogre.address, 1);
          expect(listing.price).to.eq(fixedPrice);
          expect(listing.auction).to.eq(false);
        });
      });

      /**
       * @test
       */
      describe("💬unlistItem", () => {
        it("removes item and emits an event", async () => {
          await expect(unit.unlistItem(ogre.address, 0))
            .to.emit(unit, "ItemUnlisted")
            .withArgs(Ugochukwu.address, ogre.address, 0);

          const listing = await unit.getListing(ogre.address, 0);

          expect(listing.price.toString()).to.eq("0");
        });
      });

      /**
       * @test
       */
      const offerAmount = ethers.utils.parseEther("0.8");
      describe("💬createOffer", () => {
        it("creates offer, increases listing deadline by an hour and emits an event", async () => {
          const listingBeforeOffer: DataTypes.ListingStructOutput =
            await unit.getListing(ogre.address, 1);

          console.log("Approving Unit to spend DAI tokens...");
          await dai.approve(unit.address, offerAmount);

          await expect(
            unit
              .connect(Ugochukwu)
              .createOffer(ogre.address, 1, dai.address, offerAmount, 0)
          )
            .to.emit(unit, "OfferCreated")
            .withArgs(
              Ugochukwu.address,
              ogre.address,
              1,
              dai.address,
              offerAmount,
              listingBeforeOffer.deadline
            );

          console.log("Offer created✅");

          const listingAfterOffer: DataTypes.ListingStructOutput =
            await unit.getListing(ogre.address, 1);
          const offer: DataTypes.OfferStructOutput = await unit.getOffer(
            Ugochukwu.address,
            ogre.address,
            1
          );

          console.log("Offer: ", {
            token: offer.token,
            amount: formatCurrency(offer.amount, "DAI🔶"),
            deadline: formatDate(offer.deadline.toNumber()),
            item: {
              nft: ogre.address,
              tokenId: 1,
            },
          });

          expect(offer.token).to.eq(dai.address);
          expect(offer.amount).to.eq(offerAmount);
          expect(offer.deadline).to.eq(listingBeforeOffer.deadline);
          expect(listingAfterOffer.deadline).to.eq(
            listingBeforeOffer.deadline.add(3600)
          );
        });
      });

      /**
       * @test
       */
      describe("💬extendOfferDeadline", async () => {
        const extraTime = 1200;

        it("extends deadline and emits an event", async () => {
          const oldDeadline: BigNumber = (
            await unit.getOffer(Ugochukwu.address, ogre.address, 1)
          ).deadline;

          console.log("Prev deadline: ", formatDate(oldDeadline.toNumber()));

          console.log("Extending deadline by ", extraTime, "seconds");
          await expect(
            unit
              .connect(Ugochukwu)
              .extendOfferDeadline(ogre.address, 1, extraTime)
          )
            .to.emit(unit, "OfferDeadlineExtended")
            .withArgs(
              Ugochukwu.address,
              ogre.address,
              1,
              oldDeadline,
              oldDeadline.add(extraTime)
            );

          const newDeadline: BigNumber = (
            await unit.getOffer(Ugochukwu.address, ogre.address, 1)
          ).deadline;

          console.log("New deadline: ", formatDate(newDeadline.toNumber()));

          expect(newDeadline).to.eq(oldDeadline.add(extraTime));
        });
      });

      /**
       * @test
       */
      describe("💬acceptOffer", () => {
        it("deletes listing, transfers nft to offer owner, transfers offer to Unit, records earnings and fees, and emits an event", async () => {
          const prevUnitDaiBal: BigNumber = await dai.balanceOf(unit.address);
          const prevUnitFees: BigNumber = await unit.getFees(dai.address);
          const prevSellerEarnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );
          const prevOgreOwner = await ogre.ownerOf(1);

          console.log("-----------------------------------------");
          console.log(
            "Prev Unit Fees: ",
            formatCurrency(prevUnitFees, "DAI🔶")
          );
          console.log(
            "Prev Seller Earnings: ",
            formatCurrency(prevSellerEarnings, "DAI🔶")
          );
          console.log("Prev Ogre Owner: ", prevOgreOwner);
          console.log("-----------------------------------------");

          await expect(
            unit.connect(Orga).acceptOffer(Ugochukwu.address, ogre.address, 1)
          )
            .to.emit(unit, "OfferAccepted")
            .withArgs(
              Ugochukwu.address,
              ogre.address,
              1,
              dai.address,
              offerAmount
            );
          console.log("Offer accepted✅");

          const listing: DataTypes.ListingStructOutput = await unit.getListing(
            ogre.address,
            1
          );
          const currentUnitDaiBal: BigNumber = await dai.balanceOf(
            unit.address
          );
          const currentUnitFees: BigNumber = await unit.getFees(dai.address);
          const currentSellerEarnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );
          const currentOgreOwner = await ogre.ownerOf(1);

          console.log(
            "Current Unit Fees(1%): ",
            formatCurrency(currentUnitFees, "DAI🔶")
          );
          console.log(
            "Current Seller Earnings: ",
            formatCurrency(currentSellerEarnings, "DAI🔶")
          );
          console.log("Current Ogre Owner: ", currentOgreOwner);

          expect(listing.price).to.eq(0);
          expect(currentOgreOwner).to.eq(Ugochukwu.address);
          expect(currentUnitDaiBal).to.eq(prevUnitDaiBal.add(offerAmount));
          expect(currentUnitFees).to.eq(prevUnitFees.add(offerAmount.div(100)));
          expect(currentSellerEarnings).to.eq(
            prevSellerEarnings.add(offerAmount.mul(99).div(100))
          );
        });
      });

      /**
       * @test
       */
      describe("💬removeOffer", () => {
        it("deletes offer and emits an event", async () => {
          await ogre.approve(unit.address, 0);

          const item = {
            nft: ogre.address,
            tokenId: 0,
            price: ONE_ETH,
            deadline: 3600,
          };
          console.log("Listed item: ", {
            ...item,
            price: formatCurrency(item.price, "ETH🔷"),
            deadline: item.deadline + " seconds",
          });

          await unit.listItem(
            item.nft,
            item.tokenId,
            item.price,
            item.deadline
          );

          await dai.transfer(Orga.address, offerAmount);
          await dai.connect(Orga).approve(unit.address, offerAmount);

          await unit
            .connect(Orga)
            .createOffer(ogre.address, 0, dai.address, offerAmount, 0);

          const _offer: DataTypes.OfferStructOutput = await unit.getOffer(
            Orga.address,
            ogre.address,
            0
          );

          console.log("Offer: ", {
            token: _offer.token,
            amount: formatCurrency(_offer.amount, "DAI🔶"),
            deadline: formatDate(_offer.deadline.toNumber()),
            item: {
              nft: ogre.address,
              tokenId: 0,
            },
          });

          await expect(unit.connect(Orga).removeOffer(ogre.address, 0))
            .to.emit(unit, "OfferRemoved")
            .withArgs(ogre.address, 0, Orga.address);

          const offer: DataTypes.OfferStructOutput = await unit.getOffer(
            Orga.address,
            ogre.address,
            0
          );

          expect(offer.amount).to.eq(0);
        });
      });

      /**
       * @test
       */
      describe("💬buyItem", () => {
        it("transfers nft to caller, records earnings and fees, and emits an event", async () => {
          const prevUnitFees: BigNumber = await unit.getFees(ETH_ADDRESS);
          const prevSellerEarnings: BigNumber = await unit.getEarnings(
            Ugochukwu.address,
            ETH_ADDRESS
          );

          console.log("Prev Ogre owner🐸: ", await ogre.ownerOf(0));
          console.log(
            "Prev Unit Fees: ",
            formatCurrency(prevUnitFees, "ETH🔷")
          );
          console.log(
            "Prev Seller Earnings: ",
            formatCurrency(prevSellerEarnings, "ETH🔷")
          );
          console.log("----------------------------------------");

          console.log("Buying item...");
          console.log("Buyer:", Orga.address);

          await expect(
            unit.connect(Orga).buyItem(ogre.address, 0, {
              value: ONE_ETH,
            })
          )
            .to.emit(unit, "ItemBought")
            .withArgs(Orga.address, ogre.address, 0, ETH_ADDRESS, ONE_ETH);

          console.log("-----------------------------------------");
          console.log("Item bought✅");

          const listing = await unit.getListing(ogre.address, 0);
          const currentUnitFees: BigNumber = await unit.getFees(ETH_ADDRESS);
          const currentSellerEarnings: BigNumber = await unit.getEarnings(
            Ugochukwu.address,
            ETH_ADDRESS
          );

          console.log("Current Ogre owner🐸: ", await ogre.ownerOf(0));
          console.log(
            "Current Unit Fees(1%): ",
            formatCurrency(currentUnitFees, "ETH🔷")
          );
          console.log(
            "Current Seller Earnings: ",
            formatCurrency(currentSellerEarnings, "ETH🔷")
          );

          expect(listing.price).to.eq(0);
          expect(await ogre.ownerOf(0)).to.eq(Orga.address);

          const expectedEarnings: BigNumber = ONE_ETH.mul(99).div(100); // with 1% fee off

          expect(currentSellerEarnings).to.eq(
            prevSellerEarnings.add(expectedEarnings)
          );
          expect(currentUnitFees).to.eq(prevUnitFees.add(ONE_ETH.div(100))); // 1% fee
        });
      });

      /**
       * @test
       */
      describe("💬buyItemWithToken", () => {
        it("transfers nft to caller, transfers token to Unit, records earnings and fees, and emits an event", async () => {
          await ogre.connect(Orga).approve(unit.address, 0);

          const item = {
            nft: ogre.address,
            tokenId: 0,
            token: dai.address,
            price: ONE_ETH,
            auction: false,
            deadline: 3600,
          };
          console.log("Listed item: ", {
            ...item,
            token: item.token,
            price: formatCurrency(item.price, "DAI🔶"),
            deadline: item.deadline + " seconds",
          });

          await unit
            .connect(Orga)
            .listItemWithToken(
              item.nft,
              item.tokenId,
              item.token,
              item.price,
              item.auction,
              item.deadline
            );
          console.log("-------------------------------------");

          const prevUnitDaiBal: BigNumber = await dai.balanceOf(unit.address);
          const prevUnitFees: BigNumber = await unit.getFees(dai.address);
          const prevSellerEarnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );

          console.log("Prev Ogre owner🐸: ", await ogre.ownerOf(0));
          console.log(
            "Prev Unit Fees: ",
            formatCurrency(prevUnitFees, "DAI🔶")
          );
          console.log(
            "Prev Seller Earnings: ",
            formatCurrency(prevSellerEarnings, "DAI🔶")
          );
          console.log("----------------------------------------");

          await dai.approve(unit.address, ONE_ETH);

          console.log("Buying item...");
          console.log("Buyer:", Ugochukwu.address);

          await expect(
            unit.buyItemWithToken(ogre.address, 0, dai.address, ONE_ETH)
          )
            .to.emit(unit, "ItemBought")
            .withArgs(Ugochukwu.address, ogre.address, 0, dai.address, ONE_ETH);

          console.log("-----------------------------------------");
          console.log("Item bought✅");

          const listing: DataTypes.ListingStructOutput = await unit.getListing(
            ogre.address,
            0
          );
          const currentUnitDaiBal: BigNumber = await dai.balanceOf(
            unit.address
          );
          const currentUnitFees: BigNumber = await unit.getFees(dai.address);
          const currentSellerEarnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );

          console.log("Current Ogre owner🐸: ", await ogre.ownerOf(0));
          console.log(
            "Current Unit Fees(1%): ",
            formatCurrency(currentUnitFees, "DAI🔶")
          );
          console.log(
            "Current Seller Earnings: ",
            formatCurrency(currentSellerEarnings, "DAI🔶")
          );

          expect(listing.price).to.eq(0);
          expect(await ogre.ownerOf(0)).to.eq(Ugochukwu.address);
          expect(currentUnitDaiBal).to.eq(prevUnitDaiBal.add(ONE_ETH));

          const expectedEarnings: BigNumber = ONE_ETH.mul(99).div(100); // with 1% fee off

          expect(currentSellerEarnings).to.eq(
            prevSellerEarnings.add(expectedEarnings)
          );
          expect(currentUnitFees).to.eq(prevUnitFees.add(ONE_ETH.div(100))); // 1% fee
        });
      });

      /**
       * @test
       */
      describe("💬withdrawEarnings", () => {
        it("if earnings is ETH, transfers ETH to caller and emits an event", async () => {
          const earnings: BigNumber = await unit.getEarnings(
            Ugochukwu.address,
            ETH_ADDRESS
          );
          console.log("Earnings: ", formatCurrency(earnings, "ETH🔷"));

          const prevSellerBal: BigNumber = await Ugochukwu.getBalance();
          console.log("Prev Bal: ", formatCurrency(prevSellerBal, "ETH🔷"));
          console.log("--------------------------------------");

          await expect(unit.withdrawEarnings(ETH_ADDRESS))
            .to.emit(unit, "EarningsWithdrawn")
            .withArgs(Ugochukwu.address, ETH_ADDRESS, earnings);

          console.log("Earnings withdrawn✅");

          const currentEarnings: BigNumber = await unit.getEarnings(
            Ugochukwu.address,
            ETH_ADDRESS
          );

          const currentSellerBal: BigNumber = await Ugochukwu.getBalance();
          console.log(
            "Current Bal: ",
            formatCurrency(currentSellerBal, "ETH🔷")
          );

          expect(currentEarnings).to.eq(0);
          expect(currentSellerBal).to.greaterThan(prevSellerBal);
        });

        it("if earnings is token, transfers token to caller and emits an event", async () => {
          const earnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );
          console.log("Earnings: ", formatCurrency(earnings, "DAI🔶"));

          const prevSellerBal: BigNumber = await dai.balanceOf(Orga.address);

          console.log("Prev Bal: ", formatCurrency(prevSellerBal, "DAI🔶"));
          console.log("------------------------------------------");

          await expect(unit.connect(Orga).withdrawEarnings(dai.address))
            .to.emit(unit, "EarningsWithdrawn")
            .withArgs(Orga.address, dai.address, earnings);

          console.log("Earnings withdrawn✅");

          const currentEarnings: BigNumber = await unit.getEarnings(
            Orga.address,
            dai.address
          );
          const currentSellerBal: BigNumber = await dai.balanceOf(Orga.address);

          console.log(
            "Current Bal: ",
            formatCurrency(currentSellerBal, "DAI🔶")
          );

          expect(currentEarnings).to.eq(0);
          expect(currentSellerBal).to.greaterThan(prevSellerBal);
        });
      });

      /**
       * @test
       */
      describe("💬withdrawFees", () => {
        it("if fee is ETH, transfers ETH to caller and emits an event", async () => {
          const fees: BigNumber = await unit.getFees(ETH_ADDRESS);
          console.log("Fees: ", formatCurrency(fees, "ETH🔷"));

          const prevSellerBal: BigNumber = await Valentine.getBalance();
          console.log("Prev Bal: ", formatCurrency(prevSellerBal, "ETH🔷"));
          console.log("------------------------------------------");

          await expect(unit.connect(Valentine).withdrawFees(ETH_ADDRESS))
            .to.emit(unit, "FeesWithdrawn")
            .withArgs(Valentine.address, ETH_ADDRESS, fees);

          console.log("Fees withdrawn✅");

          const currentFees: BigNumber = await unit.getFees(ETH_ADDRESS);

          const currentSellerBal: BigNumber = await Valentine.getBalance();
          console.log(
            "Current Bal: ",
            formatCurrency(currentSellerBal, "ETH🔷")
          );

          expect(currentFees).to.eq(0);
          expect(currentSellerBal).to.greaterThan(prevSellerBal);
        });

        it("if fee is token, transfers token to caller and emits an event", async () => {
          const fees: BigNumber = await unit.getFees(dai.address);
          console.log("Fees: ", formatCurrency(fees, "DAI🔶"));

          const prevSellerBal: BigNumber = await dai.balanceOf(
            Valentine.address
          );

          console.log("Prev Bal: ", formatCurrency(prevSellerBal, "DAI🔶"));
          console.log("----------------------------------------");

          await expect(unit.connect(Valentine).withdrawFees(dai.address))
            .to.emit(unit, "FeesWithdrawn")
            .withArgs(Valentine.address, dai.address, fees);

          console.log("Fees withdrawn✅");

          const currentFees: BigNumber = await unit.getFees(dai.address);
          const currentSellerBal: BigNumber = await dai.balanceOf(
            Valentine.address
          );

          console.log(
            "Current Bal: ",
            formatCurrency(currentSellerBal, "DAI🔶")
          );

          expect(currentFees).to.eq(0);
          expect(currentSellerBal).to.greaterThan(prevSellerBal);
        });
      });
    });
