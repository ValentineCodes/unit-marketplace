import { getNamedAccounts, deployments, ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../scripts/verifyContract";

const deployMocks: DeployFunction = async () => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // Libraries
  const listLogic = await ethers.getContract("ListLogic");
  const buyLogic = await ethers.getContract("BuyLogic");
  const offerLogic = await ethers.getContract("OfferLogic");
  const withdrawLogic = await ethers.getContract("WithdrawLogic");

  log("Deploying Unit...");

  const unit = await deploy("Unit", {
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

  if (!developmentChains.includes(network.name)) {
    await verify(unit.address, []);
  }
};

export default deployMocks;
deployMocks.tags = ["all", "unit"];
