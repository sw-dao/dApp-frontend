import axios from "axios";
import { baseUrl0x } from "../../settings";
import { Operations, Subscriptions, graphClient } from "../graph";
import { ADDRESSES, COMMON_DECIMALS } from "../0x/main";
import {
  AddressMap
} from "../../types";
import { web3, web3Infura } from "../../bin/www";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { DateTime } from "luxon";
import { isEmpty, isUndefined } from "lodash";

// document: DocumentNode | TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
// variables?: TSubscriptionVariables;
// updateQuery?: UpdateQueryFn<TData, TSubscriptionVariables, TSubscriptionData>;
// onError?: (error: Error) => void;
// context?: DefaultContext;

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

const getPricesTokensDaily = async (
  symbols: string[],
  fromEpoch: number,
  toEpoch: number,
  chainId: string
) => {
  console.log(`Getting daily price data for ${symbols.toString()}`);
  return await graphClient
    .query({
      query: Operations.getTokenPricesDaily,
      variables: { symbols, from: fromEpoch, to: toEpoch, chainId },
    })
    .then((res) => {
      console.log(res);
      return res.data.prices_tokens;
    })
    .catch((e) => {
      console.error(
        `[pricesGraph] error getting daily price data ${e.message}`
      );
      return undefined;
    });
};

interface TokenInfo {
  address: string;
  symbol: string;
}

interface TokenInfoZeroX {
  symbol: string;
  decimals: number;
  tokenAddress: string;
}

interface ZeroXReturn {
  symbol: string;
  prices: number[];
}

interface HourlyData {
  __typename: string;
  price: string;
  epoch: number;
}

interface HourlyDataObj {
  __typename: string;
  symbol: string;
  tokenset: boolean;
  hourlies: HourlyData[];
}

const getPricesTokensHourly = async (
  tokens: AddressMap,
  days: number,
) => {
  // Separate tokens into groups.
  const tokensSet: TokenInfo[] = [];
  const tokensRaw: TokenInfo[] = [];
  const addresses: string[] = Object.values(tokens).map((a) => a.toLowerCase());
  const symbols: string[] = Object.keys(tokens);
  addresses.forEach((a: string, i: number) => {
    const token: TokenInfo = { address: a, symbol: symbols[i] };
    if (ADDRESSES.includes(a)) {
      tokensSet.push(token);
    } else {
      tokensRaw.push(token);
    }
  });
  const tokensRawData: TokenInfoZeroX[] = await Promise.all<TokenInfoZeroX>(
    tokensRaw.map(async (t) => {
      const a = t.address;
      const decimals: number = a in COMMON_DECIMALS ?
        parseInt(COMMON_DECIMALS[a], 10) :
        parseInt(await getDecimals(a), 10);
      return { symbol: t.symbol, decimals, tokenAddress: a } as TokenInfoZeroX;
    }),
  );
  // Get info on timing/blocks.
  const now = DateTime.now();
  const nowSeconds: number = Math.round(now.toSeconds());
  const endSeconds: number = Math.round(now.minus({ day: +days }).toSeconds());
  const stepCount: number = 20;
  let stepTime: number = (nowSeconds - endSeconds) / stepCount;
  const stepSize: number = Math.round(stepTime / 2.3);
  stepTime = Math.round(stepTime);
  const timestamps: number[] = [];
  for (let i: number = 0; i <= stepCount; i++) {
    timestamps.push(nowSeconds - (stepTime * i));
  }
  // Handle tokensets separately, and get prices for all raw tokens at once.
  return await Promise.all(
    await axios.post(baseUrl0x + `/history`, {
      buyTokens: tokensRawData,
      startBlock: undefined,
      stepSize,
      stepCount
    }).then((res) => { return res.data as ZeroXReturn[] }),
  )
    .then((res: ZeroXReturn[]) => {
      return res.map((t: ZeroXReturn) => {
        return {
          __typename: "prices_tokens",
          symbol: t.symbol,
          tokenset: !isEmpty(tokensSet.filter((ts) => ts.symbol === t.symbol)),
          hourlies: t.prices.map((p: number, i: number) => {
            if (p === 0 && !isUndefined(t.prices[i - 1])) {
              p = t.prices[i - 1];
              t.prices[i] = p;
            }
            return {
              __typename: 'prices_hourlies',
              price: p.toString(),
              epoch: timestamps[i]
            };
          }) as HourlyData[]
        } as HourlyDataObj;
      });
    })
    .catch((e) => {
      console.error("Hourly call failed with: " + e.message);
      return undefined;
    });
/* RETURNS:
    [
      {
        __typename: 'prices_tokens',
        symbol: 'BTBTC',
        tokenset: true,
        minutes: [
          [Object],
        ]
      },
    ]

    [Object] =
    {
      __typename: 'prices_minutes',
      price: '104.56494563980499',
      epoch: 1654644780
    }
*/
};

const getPricesTokensMinutes = async (
  symbols: string[],
  fromEpoch: number,
  toEpoch: number,
  chainId: string
) => {
  console.log(`Getting minutes price data for ${symbols.toString()}`);
  return await graphClient
    .query({
      query: Operations.getTokenPricesMinutes,
      variables: { symbols, from: fromEpoch, to: toEpoch, chainId },
    })
    .then((res) => res.data.prices_tokens)
    .catch((e) => {
      console.error(
        `[pricesGraph] error getting minute price data ${e.message}`
      );
      return undefined;
    });
};

const getPricesTokensAll = async (
  symbols: string[],
  fromEpoch: number,
  toEpoch: number,
  chainId: string
) => {
  console.log(`Getting all price data for ${symbols.toString()}`);
  return await graphClient
    .query({
      query: Operations.getTokenPricesAll,
      variables: { symbols, from: fromEpoch, to: toEpoch, chainId },
    })
    .then((res) => res.data.prices_tokens)
    .catch((e) => {
      console.error(`[pricesGraph] error getting all price data ${e.message}`);
      return undefined;
    });
};

// start?(subscription: Subscription): any;
// next?(value: T): void;
// error?(errorValue: any): void;
// complete?(): void;

const subscribeToPricesTokensDailyUpdates = (
  symbols: string[],
  fromEpoch: number
) => {
  console.log(
    `Subscribin to daily updates for ${symbols.toString()} from ${fromEpoch}`
  );

  return graphClient
    .subscribe({
      query: Subscriptions.onUpdateDailyPrices,
      variables: { symbols, from: fromEpoch },
    })
    .subscribe({
      next(x) {
        console.log("DAILY DATA FROM SUBSCRIPTION: ", x);
      },
      error(err) {
        console.log(`Finished with error: ${err} ${err.message}`);
      },
      complete() {
        console.log("Finished");
      },
    });
};

const subscribeToPricesTokensHourlyUpdates = (
  symbols: string[],
  fromEpoch: number
) => {
  console.log(
    `Subscribin to hourly updates for ${symbols.toString()} from ${fromEpoch}`
  );

  return graphClient
    .subscribe({
      query: Subscriptions.onUpdateHourlyPrices,
      variables: { symbols, from: fromEpoch },
    })
    .subscribe({
      next(x) {
        console.log("HOURLY DATA FROM SUBSCRIPTION: ", x);
      },
      error(err) {
        console.log(`Finished with error: ${err}`);
      },
      complete() {
        console.log("Finished");
      },
    });
};

const subscribeToPricesTokensMinuteUpdates = (
  symbols: string[],
  fromEpoch: number
) => {
  console.log(
    `Subscribin to minute updates for ${symbols.toString()} from ${fromEpoch}`
  );
  return graphClient
    .subscribe({
      query: Subscriptions.onUpdateMinutePrices,
      variables: { symbols, from: fromEpoch },
    })
    .subscribe({
      next(x) {
        console.log("MINUTE DATA FROM SUBSCRIPTION: ", x);
      },
      error(err) {
        console.log(`Finished with error: ${err}`);
      },
      complete() {
        console.log("Finished");
      },
    });
};

export {
  getPricesTokensDaily,
  getPricesTokensHourly,
  getPricesTokensMinutes,
  getPricesTokensAll,
  subscribeToPricesTokensDailyUpdates,
  subscribeToPricesTokensHourlyUpdates,
  subscribeToPricesTokensMinuteUpdates,
};
