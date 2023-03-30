import { getNamedAccounts, deployments, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const deployMocks: DeployFunction = async () => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // Libraries
  const listLogic = await ethers.getContract("ListLogic");
  const buyLogic = await ethers.getContract("BuyLogic");
  const offerLogic = await ethers.getContract("OfferLogic");
  const withdrawLogic = await ethers.getContract("WithdrawLogic");

  log("Deploying Unit...");

  await deploy("Unit", {
    from: deployer,
    log: true,
    libraries: {
      ListLogic: listLogic.address,
      BuyLogic: buyLogic.address,
      OfferLogic: offerLogic.address,
      WithdrawLogic: withdrawLogic.address,
    },
  });

  log("Unit Deployed!✅");
};

export default deployMocks;
deployMocks.tags = ["all", "unit"];
