import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.
  const { deploy } = deployments; // The deployments field itself contains the deploy function.

  const { deployer } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

  await deploy("SetTokenMock", {
    from: deployer,
    args: [deployer, "SW Alpha Portfolio", "SWAP", "100000000000000000000000"],
    log: true,
  });

  await deploy("SetTokenMock_2", {
    contract: "SetTokenMock",
    from: deployer,
    args: [deployer, "SW Yield Fund", "SWYF", "100000000000000000000000"],
    log: true,
  });
};

export default deploy;
deploy.tags = ["SetTokenMock", "local", "staging"];
