// const { performance } = require("perf_hooks");
import axios from "axios";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import { baseUrl0x } from "../../settings";
import { web3 } from "../../bin/www";
import { ADDRESSES, COMMON_DECIMALS, PRECISION_REQUIRED, HARDCODED_SUPPLY } from "./exports";
import { isUndefined } from "lodash";

export const getDecimals = async (address: string) => {
  return COMMON_DECIMALS[address.toLowerCase()] ||
    (await web3.alchemy.getTokenMetadata(address)).decimals ||
    18;
};

const getTotalSupply = async (address: string) => {
  if (ADDRESSES.includes(address.toLowerCase())) {
    return (await (new web3.eth.Contract(TokenSetABI as AbiItem[], address))
      .methods
      .totalSupply()
      .call((err: any, res: any) => {
        if (err) {
          console.log("An error occurred", err);
        }
        return res;
      })) / 10 ** 18;
  } else {
    return HARDCODED_SUPPLY[address.toLowerCase()] || 0;
  }
};

const allocationAtBlock = async (address: string, block: number | undefined) => {
  return await (new web3.eth.Contract(TokenSetABI as AbiItem[], address))
    .methods
    .getPositions()
    .call(block, (err: any, res: any) => {
      if (err) {
        console.log("An error occurred", err);
      }
      return res;
    }) as { component: string; unit: string }[];
};

export const getTokenSetAllocation = async (address: string) => {
  return allocationAtBlock(address, undefined);
};

export const getSingleTokenPrice = async (address: string) => {
  if (ADDRESSES.includes(address.toLowerCase())) {
    const allocToday = await allocationAtBlock(address, undefined);
    const allocYesterday = await allocationAtBlock(
      address,
      (await web3.eth.getBlockNumber()) - 43200
    );
    const compsAddr: string[] = [];
    allocToday.forEach((c) => {
      if (!compsAddr.includes(c.component)) {
        compsAddr.push(c.component);
      }
    });
    allocYesterday.forEach((c) => {
      if (!compsAddr.includes(c.component)) {
        compsAddr.push(c.component);
      }
    });
    let precision = false;
    const tokens = Promise.all(compsAddr.map(async (a) => {
      if (PRECISION_REQUIRED.includes(a.toLowerCase())) {
        precision = true;
      }
      const decimals = await getDecimals(a);
      return {
        symbol: `${a},${decimals}`,
        decimals,
        tokenAddress: a
      };
    }));
    const prices: { symbol: string; prices: number[] }[] =
      (await axios.post(
        baseUrl0x + `/history`,
        {
          buyTokens: await tokens,
          stepSize: 43200,
          stepCount: 1,
          precision
        }
      )).data;
    const promises: Promise<void>[][] = [];
    let currentPrice = 0;
    promises.push(allocToday.map(async (c) => {
      const details = prices.find((p) => p.symbol.split(',')[0] === c.component);
      if (isUndefined(details)) {
        return;
      }
      currentPrice +=
        details.prices[0] * (+c.unit / 10 ** +details.symbol.split(',')[1]);
      return;
    }));
    let yesterdayPrice = 0;
    promises.push(allocYesterday.map(async (c) => {
      const details = prices.find((p) => p.symbol.split(',')[0] === c.component);
      if (isUndefined(details)) {
        return;
      }
      yesterdayPrice +=
        details.prices[1] * (+c.unit / 10 ** +details.symbol.split(',')[1]);
      return;
    }));
    await Promise.allSettled(promises.flat(2));
    return {
      currentPrice,
      changePercentDay: ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100
    };
  } else {
    let precision = PRECISION_REQUIRED.includes(address.toLowerCase());
    const prices: { symbol: string; prices: number[] }[] =
      (await axios.post(
        baseUrl0x + `/history`,
        {
          buyTokens: [{
            symbol: "",
            decimals: await getDecimals(address),
            tokenAddress: address
          }],
          stepSize: 43200,
          stepCount: 1,
          precision
        }
      )).data;
    return {
      currentPrice: prices[0].prices[0],
      changePercentDay: ((prices[0].prices[0] - prices[0].prices[1]) / prices[0].prices[1]) * 100
    };
  }
};

export const getPrices = async (address: string) => {
  const prices = await getSingleTokenPrice(address);
  const totalSupply = await getTotalSupply(address);
  return {
    ... prices,
    totalSupply,
    marketCap: totalSupply * prices.currentPrice,
  };
};

export default getPrices;
