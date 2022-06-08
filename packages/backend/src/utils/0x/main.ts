// const { performance } = require("perf_hooks");
import axios from "axios";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { baseUrl0x } from "../../settings";
// const TOKENSET_ADDRESS = "0xf2aa5ccea80c246a71e97b418173fcc956408d3f";
const WSS_PROVIDER =
  "wss://rpc.ankr.com/polygon/ws/4bacdd2101497335fad3edece2dfef08b2dbf1a88a57b4764761590bb3fa1544";
const INFURA =
  "https://polygon-mainnet.infura.io/v3/ef6d47c7a19b436598140a2c4e1fe642";
const ADDRESSES = [
  "0x25ad32265c9354c29e145c902ae876f6b69806f2", // # Alpha Portfolio
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026", // # Macro Trend BTC
  "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548", // # Macro Trend ETH
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70", // # Quantum Momentum BTC
  "0x9984d846a3dc77aa0488f3758976b149e8475995", // # Quantum Momentum ETH
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244", // # Quantum Momentum MATIC
  "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344", // # Buy the Dip BTC
  "0x07A79127182a1c303d11eCDa951310EC1C2E1444", // # Buy the Dip ETH
  "0xb87352B4C3EB9daEd09cD4996dFf85c122394912", // # Buy the Dip MATIC
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f", // # Discretionary BTC
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421", // # Discretionary ETH
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2", // # Discretionary MATIC
  "0x62135f85899d97aed95f4405d710208e68b99f39", // # DeFi Value Index
  "0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb", // # BTC Momentum Index
  "0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568", // # ETH Momentum Index
  "0xDFdDd9811796F72bA32a031724f5B1403CD48B91", // # MATIC Momentum Index
  "0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a", // # DPI Momentum Index
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19", // # SWD Momentum Index
  "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff", // # Polygon Ecosystem Index
]; // # contract addresS
interface CommonDecimals {
  [addr: string]: string;
}
const COMMON_DECIMALS: CommonDecimals = {
  "0xaeE24d5296444c007a532696aaDa9dE5cE6caFD0": "18",
  "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": "18",
  "0xd6cA869a4EC9eD2C7E618062Cdc45306d8dBBc14": "18",
  "0x3Ad707dA309f3845cd602059901E39C4dcd66473": "18",
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": "8",
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": "18",
  "0xf287D97B6345bad3D88856b26Fb7c0ab3F2C7976": "18",
  "0xE5417Af564e4bFDA1c483642db72007871397896": "18",
  "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7": "18",
  "0x831753DD7087CaC61aB5644b308642cc1c33Dc13": "18",
  "0x62135f85899d97aed95f4405d710208e68b99f39": "18",
  "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff": "18",
  "0x25ad32265c9354c29e145c902ae876f6b69806f2": "18",
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026": "18",
  "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548": "18",
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70": "18",
  "0x9984d846a3dc77aa0488f3758976b149e8475995": "18",
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244": "18",
  "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344": "18",
  "0x07A79127182a1c303d11eCDa951310EC1C2E1444": "18",
  "0xb87352B4C3EB9daEd09cD4996dFf85c122394912": "18",
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f": "18",
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421": "18",
};

// Init new web3 Client with Ankr
const web3 = new Web3(new Web3.providers.WebsocketProvider(WSS_PROVIDER));
const web3Infura = new Web3(INFURA);
const checkConnection = () => {
  web3Infura.eth.net
    .isListening()
    .then(() => console.log("[WSS] Infura is connected"))
    .catch((e) => {
      console.log("[ - ] Lost connection to the node, reconnecting");
      web3.setProvider(WSS_PROVIDER);
    });
  web3.eth.net
    .isListening()
    .then(() => console.log("[WSS] Ankr is connected"))
    .catch((e) => {
      console.log("[ - ] Lost connection to the node, reconnecting");
      web3.setProvider(WSS_PROVIDER);
    });
};
checkConnection();

// Get current TokenSet Positions
const getTokenSetPositions = async (contractAddr: string, past: boolean) => {
  let pastBlock: number | null = null;
  let token;
  if (past) {
    token = new web3Infura.eth.Contract(
      TokenSetABI as AbiItem[],
      contractAddr
    );
    const latest: number = await web3Infura.eth.getBlockNumber();
    pastBlock = latest - 37565;
  } else {
    token = new web3.eth.Contract(TokenSetABI as AbiItem[], contractAddr);
  }
  const result = await token.methods
    .getPositions()
    .call(pastBlock, (err: any, res: any) => {
      if (err) {
        console.log("An error occurred", err);
      }
      return res;
    });
  return result;
};

const getDecimals = async (addr: string): Promise<string> => {
  const contract = new web3.eth.Contract(ERC20ABI as AbiItem[], addr);
  const decimals: string = await contract.methods
    .decimals()
    .call((err: any, res: string) => {
      if (err) {
        console.log("An error occured", err);
      }
      return res;
    });
  return decimals;
};

// Loop trough TokenSets Positions, get size and address of asset
const processTSRes = async (res: any, past: boolean): Promise<number> => {
  let total = 0;
  if (res.length === 0) {
    return 0;
  }
  const data = [];
  const sizes: number[] = [];
  for (const t of res) {
    const size: number = t[2];
    // Getting price for said asset
    if (size === 0) { continue; }
    const addr: string = t[0];
    if (addr === "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174") {
      // if addr == USDC... No need to catch USDC price
      total += size / 10 ** 6;
      continue;
    }
    const decimals = addr in COMMON_DECIMALS ? COMMON_DECIMALS[addr] : await getDecimals(addr);
    data.push({
      decimals: parseInt(decimals, 10),
      tokenAddress: addr,
    });
    sizes.push(size);
  }
  if (data.length !== 0) {
    // console.log(data);
    const prices: { prices: number[] }[] = await getTokenPrice(data, past);
    for (let index = 0; index < prices.length; index++) {
      const address = data[index];
      const size = sizes[index];
      const price = prices[0].prices[index];
      total += price * (size / 10 ** address.decimals);
    }
  }
  return total;
};

// Get TokenPrice for address
const getTokenPrice = async (
  data: string | { decimals: number; tokenAddress: string }[],
  past: boolean
): Promise<any> => {
  if (typeof data === "string") {
    const decimals = data in COMMON_DECIMALS ? COMMON_DECIMALS[data] : await getDecimals(data);
    data = [{ decimals: parseInt(decimals, 10), tokenAddress: data }];
  }
  let startBlock: number | null = null;
  if (past) {
    const latest: number = await web3Infura.eth.getBlockNumber();
    startBlock = latest - 37565;
  }
  const price = await axios
    // .get(
    //   `https://polygon.api.0x.org/swap/v1/price?buyToken=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&sellToken=${addr}&sellAmount=${n}`
    // )
    .post(baseUrl0x + `/history`, {
      buyTokens: data,
      startBlock,
    })
    .then((response) => {
      return response.data; // return price and decimals
    })
    .catch((err) => console.log(err.response.data));
  return price; // returns [price, decimals] returned from const price = axios
};

// Main function => Get TokenSet Positions, parse to processTSRes and then print result
const getTokenSetPrice = async (address: string, past: boolean) => {
  checkConnection();
  if (ADDRESSES.includes(address)) {
    // for (const address of ADDRESSES) {
    const result = await getTokenSetPositions(address, past)
      .then(async (res: any) => {
        const resultInternal = await processTSRes(res, past);
        return Promise.resolve(resultInternal);
      })
      .catch((err: any) => console.log(err));
    return Promise.resolve(result);
  } else {
    const price = await getTokenPrice(address, past).then((res) => {
      return res[0].prices[0];
    });
    return Promise.resolve(price);
  }
};
const getPrices = async (address: string) => {
  const currentPrice = await getTokenSetPrice(address, false);
  const changePercentDay = await getTokenSetPrice(address, true);
  return Promise.resolve({
    currentPrice,
    changePercentDay,
  });
};
export default getPrices;
