import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "@ethersproject/contracts";
import addresses from "../src/addresses";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.
  const { deploy } = deployments; // The deployments field itself contains the deploy function.
  const { deployer, tokenOwner } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

  console.log("HRE: ", hre.network.name);

  // await deployments.get("SWDAO");

  const TokenAddress =
    hre.network.name === "mainnet"
      ? addresses.swdToken
      : await ethers.getContract("SWDAO").then((mockContract: Contract) => {
          return mockContract.address;
        });

  const lpReward = ethers.utils.parseUnits("0.03", 18).toString();

  await deploy("SwdStaking", {
    from: deployer,
    args: [tokenOwner, TokenAddress, lpReward, 0],
    log: true,
  });
};

export default deploy;
deploy.tags = ["SwdStaking", "local", "staging", "production"];
