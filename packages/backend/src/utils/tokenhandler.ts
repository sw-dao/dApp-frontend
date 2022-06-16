import _ from "lodash";
import { DateTime } from "luxon";
import { SwappableTokens } from "../settings";

import {
  AddressMap,
  ExtendedTokenDetailResponse,
  TokenDetails,
} from "../types";
import getPrices from "./0x/main";
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
  const address = SwappableTokens.TokenProducts["0x89"][symbol];
  const prices = await getPrices(address)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error(`[TokenHandler-0x] getExtendedTokenDetails ${e.message}`);
      return {
        changePercentDay: 0,
        currentPrice: 0,
        marketCap: 0,
        totalSupply: 0,
      };
    });
  const changePercentDay =
    ((prices.currentPrice - prices.changePercentDay) /
      prices.changePercentDay) *
    100; // ((220 - 200)/200)*100
  if (tokenData) {
    return {
      address,
      symbol,
      marketCap: prices.marketCap,
      changePercent1Day: changePercentDay,
      volume1Day: tokenData.volumeDay,
      totalSupply: prices.totalSupply,
      currentPrice: prices.currentPrice,
      tokenset: tokenData.token.tokensetAllocationsByTokenid || [],
    } as ExtendedTokenDetailResponse;
  }
  return {
    address,
    symbol,
    marketCap: prices.marketCap,
    changePercent1Day: changePercentDay,
    volume1Day: 0,
    totalSupply: prices.totalSupply,
    currentPrice: prices.currentPrice,
    tokenset: [],
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
              .map((price: any) => fixPriceValues(price))
              .sort((a: any, b: any) => a[0] - b[0]);
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
      tokens,
      +days
    );

    if (hourlyPrices) {
      return _.chain(hourlyPrices)
        .groupBy("symbol")
        .map((pricesBySymbol) => {
          let aggregatePricesForSymbol: any[] | undefined = [];
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
              .map((price: any) => fixPriceValues(price))
              .sort((a: any, b: any) => a[0] - b[0]);
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
