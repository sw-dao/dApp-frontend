// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const SwdToken = await ethers.getContractFactory("ERC20");
  const swdToken = await SwdToken.deploy("SWDAO", "SWD");

  // We get the contract to deploy
  // Deployment parameters:
  // ERC20 _swdToken,
  // uint256 _swdPerBlock,
  // uint256 _startBlock,
  // uint256 _bonusEndBlock
  const SwdStaking = await ethers.getContractFactory("SWD_Staking");
  const staking = await SwdStaking.deploy(swdToken.address, 1, 0, 3);

  await staking.deployed();

  console.log("SWD Staking deployed to:", staking.address);
};

export default deploy;
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
