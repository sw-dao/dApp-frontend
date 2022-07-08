import axios from "axios";
import { baseUrl0x } from "../../settings";
import { Operations, Subscriptions, graphClient } from "../graph";
import { getDecimals } from "../0x/main";
import { AddressMap } from "../../types";
import { web3 } from "../../bin/www";
import { AbiItem } from "web3-utils";
import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { DateTime } from "luxon";
import { isEmpty, isUndefined } from "lodash";
import { ADDRESSES, COMMON_DECIMALS } from "../0x/exports";

// document: DocumentNode | TypedDocumentNode<TSubscriptionData, TSubscriptionVariables>;
// variables?: TSubscriptionVariables;
// updateQuery?: UpdateQueryFn<TData, TSubscriptionVariables, TSubscriptionData>;
// onError?: (error: Error) => void;
// context?: DefaultContext;

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
    .then((res) => res.data.prices_tokens)
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

interface BlockStep {
  block: number;
  steps: number;
  positions: any[] | undefined;
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

const getPricesTokensHourly = async (tokens: AddressMap, days: number) => {
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
      const decimals: number =
        a in COMMON_DECIMALS
          ? parseInt(COMMON_DECIMALS[a], 10)
          : parseInt(await getDecimals(a), 10);
      return { symbol: t.symbol, decimals, tokenAddress: a } as TokenInfoZeroX;
    })
  );
  // Get info on timing/blocks.
  const thisBlock: number =
    Math.floor((await web3.eth.getBlockNumber()) / 1800) * 1800;
  const now = DateTime.now().startOf("hour");
  const nowSeconds: number = Math.round(now.toSeconds());
  const endSeconds: number = Math.round(now.minus({ day: days }).toSeconds());
  const stepCount: number = 14;
  let stepTime: number = (nowSeconds - endSeconds) / stepCount;
  const stepSize: number = Math.round(stepTime / 2);
  stepTime = Math.round(stepTime);
  const timestamps: number[] = [];
  for (let i: number = 0; i <= stepCount; i++) {
    timestamps.push(nowSeconds - stepTime * i);
  }
  // TokenSets function.
  const setPricing = async () => {
    const fromBlock: number = thisBlock - stepSize * stepCount;
    return await Promise.all(
      tokensSet.map(async (t) => {
        const setContract = new web3.eth.Contract(
          TokenSetABI as AbiItem[],
          t.address
        );
        let positionsCurrent = await setContract.methods
          .getPositions()
          .call(thisBlock);
        let blockLast: number;
        const positionsMap = new Map<number, any[]>();
        positionsMap.set(thisBlock, positionsCurrent);
        // Find blocks where rebalances occur.
        const changes: number[] = (
          await setContract.getPastEvents("Invoked", { fromBlock })
        )
          .map((l) => {
            return l.blockNumber - 1;
          })
          .filter((b, i: number) => {
            if (i === 0) {
              blockLast = b;
              return true;
            }
            const blockDifferent: boolean = b !== blockLast;
            blockLast = b;
            if (b >= thisBlock) {
              return false;
            }
            return blockDifferent;
          })
          .reverse()
          .filter((b) => {
            const p = setContract.methods.getPositions().call(b);
            const positionsChanged: boolean = p !== positionsCurrent;
            positionsCurrent = p;
            if (positionsChanged) {
              positionsMap.set(b, p);
            }
            return positionsChanged;
          });
        // Map rebalances to 0x calls.
        const blockSteps: BlockStep[] = [];
        let blockUnchanged: number = thisBlock;
        let stepsSubtract: number = 0;
        let j: number = 0;
        changes.push(0);
        let positions: any[] | undefined = positionsMap.get(thisBlock);
        for (let i = 0; i <= stepCount; i++) {
          const block: number = thisBlock - i * stepSize;
          if (changes[j] >= block) {
            positions =
              j === 0
                ? positionsMap.get(thisBlock)
                : await positionsMap.get(changes[j - 1]);
            blockSteps.push({
              block: blockUnchanged,
              steps: i - 1 - stepsSubtract,
              positions,
            });
            stepsSubtract = i;
            while (changes[j] >= block) {
              j++;
            }
            blockUnchanged = block;
          }
        }
        positions =
          j === 0
            ? positionsMap.get(thisBlock)
            : await positionsMap.get(changes[j - 1]);
        blockSteps.push({
          block: blockUnchanged,
          steps: stepCount - stepsSubtract,
          positions,
        });
        const setPrices: ZeroXReturn = { symbol: t.symbol, prices: [] };
        for (const step of blockSteps) {
          const positionsLocal = step.positions as any[];
          let hasUSDC: boolean = false;
          const USDC: string = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
          const tokensDataPromise: Promise<TokenInfoZeroX>[] = positionsLocal
            .filter((p: string[]) => {
              const isUSDC: boolean = p[0].toLowerCase() === USDC;
              if (isUSDC) {
                hasUSDC = true;
              }
              return isUSDC ? false : true;
            })
            .map(async (p: string[], i: number) => {
              const addr = p[0].toLowerCase();
              const decimals: number = parseInt(
                addr in COMMON_DECIMALS
                  ? COMMON_DECIMALS[addr]
                  : await getDecimals(addr),
                10
              );
              return {
                symbol: i.toString(),
                decimals,
                tokenAddress: addr,
              } as TokenInfoZeroX;
            });
          const tokensData = await Promise.all(tokensDataPromise);
          const results: ZeroXReturn[] = await axios
            .post(baseUrl0x + `/history`, {
              buyTokens: tokensData,
              stepSize: step.steps !== 0 ? stepSize : undefined,
              stepCount: step.steps !== 0 ? step.steps : undefined,
              startBlock: step.block,
            })
            .then((res) => {
              return res.data as ZeroXReturn[];
            });
          let amountUSDC: number = 0;
          if (hasUSDC) {
            const index = positionsLocal.findIndex(
              (p) => p[0].toLowerCase() === USDC
            );
            amountUSDC = positionsLocal[index][2] / 1e6;
            const pricesUSDC: number[] = [];
            for (let y = 0; y <= step.steps; y++) {
              pricesUSDC.push(1);
            }
            results.push({ symbol: "USDC", prices: pricesUSDC });
          }
          const localPrices: number[] = [];
          results.forEach((r) => {
            const isUSDC: boolean = r.symbol === "USDC";
            const pi: number = isUSDC ? 0 : parseInt(r.symbol, 10);
            const pd: number = isUSDC ? 6 : tokensData[pi].decimals;
            const amount: number = isUSDC
              ? amountUSDC
              : positionsLocal.find(
                  (pl) => pl[0].toLowerCase() === tokensData[pi].tokenAddress
                )[2] /
                10 ** pd;
            r.prices.forEach((p, k: number) => {
              const pf: number = p * amount;
              if (isUndefined(localPrices[k])) {
                localPrices[k] = pf;
              } else {
                localPrices[k] += pf;
              }
            });
          });
          localPrices.forEach((p) => setPrices.prices.push(p));
        }
        return setPrices;
      })
    );
  };
  // Handle tokensets separately, and get prices for all raw tokens at once.
  return await Promise.all([
    await axios
      .post(baseUrl0x + `/history`, {
        buyTokens: tokensRawData,
        stepSize,
        stepCount,
        startBlock: thisBlock,
      })
      .then((res) => {
        return res.data as ZeroXReturn[];
      }),
    await setPricing(),
  ])
    .then((res: ZeroXReturn[][]) => {
      return res
        .flat()
        .filter((t) => !isEmpty(t))
        .map((t: ZeroXReturn) => {
          return {
            __typename: "prices_tokens",
            symbol: t.symbol,
            tokenset: !isEmpty(
              tokensSet.filter((ts) => ts.symbol === t.symbol)
            ),
            hourlies: t.prices
              .map((p: number, i: number) => {
                if (p === 0 && !isUndefined(t.prices[i - 1])) {
                  p = t.prices[i - 1];
                  t.prices[i] = p;
                }
                return {
                  __typename: "prices_hourlies",
                  price: p.toString(),
                  epoch: timestamps[i],
                };
              })
              .reverse() as HourlyData[],
          } as HourlyDataObj;
        });
    })
    .catch((e) => {
      console.error("Hourly call failed with: " + e.message);
      return undefined;
    });
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
