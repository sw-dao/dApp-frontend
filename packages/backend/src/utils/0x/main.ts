// const { performance } = require("perf_hooks");
import axios from "axios";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { baseUrl0x } from "../../settings";
import { web3 } from "../../bin/www";
import { ADDRESSES, COMMON_DECIMALS, PRECISION_REQUIRED } from "./exports";

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
