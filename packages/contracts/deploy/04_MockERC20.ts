import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre; // we get the deployments and getNamedAccounts which are provided by hardhat-deploy.
  const { deploy } = deployments; // The deployments field itself contains the deploy function.

  const { deployer } = await getNamedAccounts(); // Fetch the accounts. These can be configured in hardhat.config.ts as explained above.

  await deploy("ERC20Mock", {
    from: deployer,
    args: [deployer, "DAI", "DAI", "100000000000000000000"],
    log: true,
  });

  await deploy("ERC20Mock_2", {
    contract: "ERC20Mock",
    from: deployer,
    args: [deployer, "USDC", "USDC", "100000000000000000000"],
    log: true,
  });
};

export default deploy;
deploy.tags = ["ERC20Mock", "local", "staging"];
