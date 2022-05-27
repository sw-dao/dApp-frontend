import { Operations, Subscriptions, graphClient } from "../graph";

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

const getPricesTokensHourly = async (
  symbols: string[],
  fromEpoch: number,
  toEpoch: number,
  chainId: string
) => {
  console.log(`Getting hourly price data for ${symbols.toString()}`);
  return await graphClient
    .query({
      query: Operations.getTokenPricesHourly,
      variables: { symbols, from: fromEpoch, to: toEpoch, chainId },
    })
    .then((res) => res.data.prices_tokens)
    .catch((e) => {
      console.error(
        `[pricesGraph] error getting hourly price data ${e.message}`
      );
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
