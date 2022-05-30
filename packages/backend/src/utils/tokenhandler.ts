import _ from "lodash";
import { DateTime } from "luxon";

import {
  AddressMap,
  ExtendedTokenDetailResponse,
  TokenDetails,
} from "../types";
import { Operations, graphClient } from "./graph";
import {
  getPricesTokensDaily,
  getPricesTokensHourly,
  getPricesTokensMinutes,
} from "./prices";

const getExtendedTokenDetails = async (
  symbol: string,
  chainId: string
): Promise<ExtendedTokenDetailResponse> => {
  const tokenData = await graphClient
    .query({
      query: Operations.getExtendedTokenDetails,
      variables: { symbol, chainId },
    })
    .then((res) => res.data.prices_token_infos[0])
    .catch((e) => {
      console.error(`[TokenHandler] getExtendedTokenDetails ${e.message}`);
      return {};
    });

  if (tokenData) {
    return {
      address: tokenData.token.address,
      symbol: tokenData.token.symbol,
      marketCap: tokenData.marketCap,
      changePercent1Day: tokenData.changePercentDay,
      volume1Day: tokenData.volumeDay,
      totalSupply: tokenData.totalSupply,
      currentPrice: tokenData.currentPrice,
      tokenset: tokenData.token.tokensetAllocationsByTokenid || [],
    } as ExtendedTokenDetailResponse;
  }
  return {
    symbol,
    address: "",
    marketCap: 0,
    currentPrice: 0,
    changePercent1Day: 0,
    volume1Day: 0,
    totalSupply: 0,
  } as ExtendedTokenDetailResponse;
};

// TODO code cleanup, DRY, KISS, wykyk
const getTokenPriceData = async (
  chainId: string,
  tokens: AddressMap,
  currency: string,
  days: string
): Promise<TokenDetails[]> => {
  const prices: TokenDetails[] = [];
  const symbols = Object.keys(tokens);
  const now = DateTime.now();

  console.log("GET ", days, " ", symbols);

  if (+days === 1) {
    const minutePrices = await getPricesTokensMinutes(
      symbols,
      Math.round(now.minus({ day: +days }).toSeconds()),
      Math.round(now.toSeconds()),
      chainId
    );

    if (minutePrices) {
      return _.chain(minutePrices)
        .groupBy("symbol")
        .map((pricesBySymbol) => {
          let aggregatePricesForSymbol = [];
          if (pricesBySymbol) {
            aggregatePricesForSymbol = pricesBySymbol
              .map((pricesTypes) => pricesTypes?.minutes)
              .reduce((result, item) => result.concat(item), [])
              .map((price: any) => fixPriceValues(price));
          }

          console.log(
            `[TokenHandler] returning ${aggregatePricesForSymbol.length} minute prices for ${pricesBySymbol[0].symbol}`
          );

          return {
            address: tokens[pricesBySymbol[0].symbol],
            symbol: pricesBySymbol[0].symbol,
            tokenset: pricesBySymbol[0].tokenset,
            prices: aggregatePricesForSymbol,
          };
        })
        .value() as TokenDetails[];
    }

    return [];
  } else if (+days === 7 || +days === 30) {
    const hourlyPrices = await getPricesTokensHourly(
      symbols,
      Math.round(now.minus({ day: +days }).toSeconds()),
      Math.round(now.toSeconds()),
      chainId
    );

    if (hourlyPrices) {
      return _.chain(hourlyPrices)
        .groupBy("symbol")
        .map((pricesBySymbol) => {
          let aggregatePricesForSymbol = [];
          if (pricesBySymbol) {
            aggregatePricesForSymbol = pricesBySymbol
              .map((pricesTypes) => pricesTypes?.hourlies)
              .reduce((result, item) => result.concat(item), [])
              .map((price: any) => fixPriceValues(price));
          }

          console.log(
            `[TokenHandler] returning ${aggregatePricesForSymbol.length} hourly prices for ${pricesBySymbol[0].symbol}`
          );

          return {
            address: tokens[pricesBySymbol[0].symbol],
            symbol: pricesBySymbol[0].symbol,
            tokenset: pricesBySymbol[0].tokenset,
            prices: aggregatePricesForSymbol,
          };
        })
        .value() as TokenDetails[];
    }

    return [];
  } else if (+days === 365) {
    const dailyPrices: any = await getPricesTokensDaily(
      symbols,
      Math.round(now.minus({ day: +days }).toSeconds()),
      Math.round(now.toSeconds()),
      chainId
    );

    if (dailyPrices) {
      return _.chain(dailyPrices)
        .groupBy("symbol")
        .map((pricesBySymbol) => {
          let aggregatePricesForSymbol = [];
          if (pricesBySymbol) {
            aggregatePricesForSymbol = pricesBySymbol
              .map((pricesTypes) => pricesTypes?.dailies)
              .reduce((result, item) => result.concat(item), [])
              .map((price: any) => fixPriceValues(price));
          }

          console.log(
            `[TokenHandler] returning ${aggregatePricesForSymbol.length} daily prices for ${pricesBySymbol[0].symbol}`
          );

          return {
            address: tokens[pricesBySymbol[0].symbol],
            symbol: pricesBySymbol[0].symbol,
            tokenset: pricesBySymbol[0].tokenset,
            prices: aggregatePricesForSymbol,
          };
        })
        .value() as TokenDetails[];
    }
    return [];
  }

  return prices;
};

const fixPriceValues = (price: any) => {
  return [Math.round(price.epoch), price.price.replace(/[^\d.-]/g, "")];
};

export { getTokenPriceData, getExtendedTokenDetails };
