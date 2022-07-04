// const { performance } = require("perf_hooks");
import axios from "axios";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { baseUrl0x } from "../../settings";
import { web3 } from "../../bin/www";

export const ADDRESSES = [
  "0x25ad32265c9354c29e145c902ae876f6b69806f2", // # alpha portfolio
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026", // # macro trend btc
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548", // # macro trend eth
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70", // # quantum momentum btc
  "0x9984d846a3dc77aa0488f3758976b149e8475995", // # quantum momentum eth
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244", // # quantum momentum matic
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344", // # buy the dip btc
  "0x07a79127182a1c303d11ecda951310ec1c2e1444", // # buy the dip eth
  "0xb87352b4c3eb9daed09cd4996dff85c122394912", // # buy the dip matic
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f", // # discretionary btc
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421", // # discretionary eth
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2", // # discretionary matic
  "0x62135f85899d97aed95f4405d710208e68b99f39", // # defi value index
  "0xb4f78a05ab16cd3e6d0100112d0cc431942859bb", // # btc momentum index
  "0xd3ef811331a98d24a2b2fb64cebeea5af31b2568", // # eth momentum index
  "0xdfddd9811796f72ba32a031724f5b1403cd48b91", // # matic momentum index
  "0xb5253c58b8a361d9901922b23ec9fb9e7d38c98a", // # dpi momentum index
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19", // # swd momentum index
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff", // # polygon ecosystem index
]; // # contract addresS

interface CommonDecimals {
  [addr: string]: string;
}

export const COMMON_DECIMALS: CommonDecimals = {
  "0xaee24d5296444c007a532696aada9de5ce6cafd0": "18",
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": "18",
  "0xd6ca869a4ec9ed2c7e618062cdc45306d8dbbc14": "18",
  "0x3ad707da309f3845cd602059901e39c4dcd66473": "18",
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": "8",
  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": "18",
  "0xf287d97b6345bad3d88856b26fb7c0ab3f2c7976": "18",
  "0xe5417af564e4bfda1c483642db72007871397896": "18",
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7": "18",
  "0x831753dd7087cac61ab5644b308642cc1c33dc13": "18",
  "0x62135f85899d97aed95f4405d710208e68b99f39": "18",
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff": "18",
  "0x25ad32265c9354c29e145c902ae876f6b69806f2": "18",
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026": "18",
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548": "18",
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70": "18",
  "0x9984d846a3dc77aa0488f3758976b149e8475995": "18",
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244": "18",
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344": "18",
  "0x07a79127182a1c303d11ecda951310ec1c2e1444": "18",
  "0xb87352b4c3eb9daed09cd4996dff85c122394912": "18",
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f": "18",
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421": "18",
};

export const PRECISION_REQUIRED = [
  "0x340f412860da7b7823df372a2b59ff78b7ae6abc",
  "0x130ce4e4f76c2265f94a961d70618562de0bb8d2",
  "0x4f025829c4b13df652f38abd2ab901185ff1e609",
];

// Get current TokenSet Positions
const getTokenSetPositions = async (contractAddr: string, past: boolean) => {
  let pastBlock: number | null = null;
  let token;
  if (past) {
    token = new web3.eth.Contract(TokenSetABI as AbiItem[], contractAddr);
    const latest: number = await web3.eth.getBlockNumber();
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

export const getDecimals = async (addr: string): Promise<string> => {
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
    if (size === 0) {
      continue;
    }
    let addr: string = t[0];
    if (addr === "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174") {
      // if addr == USDC... No need to catch USDC price
      total += size / 10 ** 6;
      continue;
    }
    addr = addr.toLowerCase();
    const decimals =
      addr in COMMON_DECIMALS ? COMMON_DECIMALS[addr] : await getDecimals(addr);
    data.push({
      decimals: parseInt(decimals, 10),
      tokenAddress: addr,
    });
    sizes.push(size);
  }
  if (data.length !== 0) {
    // console.log(data);
    const prices: { prices: number[] }[] = await getTokenPrice(data, past);
    for (let index = 0; index < prices[0].prices.length; index++) {
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
    data = data.toLowerCase();
    const decimals =
      data in COMMON_DECIMALS ? COMMON_DECIMALS[data] : await getDecimals(data);
    data = [{ decimals: parseInt(decimals, 10), tokenAddress: data }];
  }
  let startBlock: number | null = null;
  if (past) {
    const latest: number = await web3.eth.getBlockNumber();
    startBlock = latest - 37565;
  }
  let precision: boolean = false;
  data.forEach((d) => {
    if (PRECISION_REQUIRED.includes(d.tokenAddress.toLowerCase())) {
      precision = true;
    }
  });
  const price = await axios
    .post(baseUrl0x + `/history`, {
      buyTokens: data,
      startBlock,
      precision,
    })
    .then((response) => {
      return response.data; // return price and decimals
    })
    .catch((err) => console.log(err.response.data));
  return price; // returns [price, decimals] returned from const price = axios
};

// Main function => Get TokenSet Positions, parse to processTSRes and then print result
const getTokenSetPrice = async (address: string, past: boolean) => {
  if (ADDRESSES.includes(address.toLowerCase())) {
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

const getTotalSupply = async (address: string) => {
  const token = new web3.eth.Contract(TokenSetABI as AbiItem[], address);
  return await token.methods.totalSupply().call((err: any, res: any) => {
    if (err) {
      console.log("An error occurred", err);
    }
    return res;
  });
};

export const getTokenSetAllocation = async (address: string) => {
  const result = await getTokenSetPositions(address, false);
  const r: { component: string; unit: string }[] = [];
  result.forEach((element: { component: string; unit: string }) => {
    r.push({ component: element.component, unit: element.unit });
  });
  return r;
};

export const getSingleTokenPrice = async (address: string) => {
  const currentPrice = await getTokenSetPrice(address, false);
  const changePercentDay = await getTokenSetPrice(address, true);
  return Promise.resolve({
    currentPrice,
    changePercentDay:
      ((currentPrice - changePercentDay) / changePercentDay) * 100,
  });
};
export const getPrices = async (address: string) => {
  const currentPrice = await getTokenSetPrice(address, false);
  const changePercentDay = await getTokenSetPrice(address, true);
  const totalSupply = await getTotalSupply(address);
  return Promise.resolve({
    currentPrice,
    changePercentDay:
      ((currentPrice - changePercentDay) / changePercentDay) * 100,
    totalSupply: totalSupply / 10 ** 18,
    marketCap: (totalSupply / 10 ** 18) * currentPrice,
  });
};

export default getPrices;
