import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { nodeUrl, accounts } from "./utils/network";

dotenv.config();
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.6.12",
  namedAccounts: {
    deployer: { default: 0 },
    tokenOwner: {
      default: 1,
      ropsten: "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91",
      rinkeby: "0x898ab2FAa61Ab85BB04AA2e335688CeAa582c67e", // Gnosis safe
      mainnet: "0x52dddf6a08d2787f2629d582921a684a9e4d2e31", // Gnosis safe
    },
  },
  networks: {
    localhost: {
      live: false,
      tags: ["local"],
      url: nodeUrl("localhost"),
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: accounts("localhost").mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    // ROPSTEN FOR 0x testing
    ropsten: {
      live: true,
      tags: ["staging"],
      url: nodeUrl("ropsten"),
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: accounts("ropsten").mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    // RINKEBY for Gnosis testing
    rinkeby: {
      live: true,
      tags: ["staging"],
      url: nodeUrl("mainnet"),
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: accounts("rinkeby").mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
    mainnet: {
      live: true,
      tags: ["production"],
      url: nodeUrl("mainnet"),
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: accounts("mainnet").mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
