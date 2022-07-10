import _ from "lodash";
import { DateTime } from "luxon";
import { SwappableTokens } from "../settings";

import {
  AddressMap,
  ExtendedTokenDetailResponse,
  TokenDetails,
} from "../types";
import { getPrices } from "./0x/main";
import { getPricesTokensDaily, getPricesTokensHourly } from "./prices";

const getExtendedTokenDetails = async (
  symbol: string,
  chainId: string
): Promise<ExtendedTokenDetailResponse> => {
  const address = SwappableTokens.TokenProducts["0x89"][symbol];
  const prices = await getPrices(address)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      // console.error(`[TokenHandler-0x] getExtendedTokenDetails ${e.message}`);
      return {
        changePercentDay: 0,
        currentPrice: 0,
        marketCap: 0,
        totalSupply: 0,
      };
    });
  return {
    address,
    symbol,
    marketCap: prices.marketCap,
    changePercent1Day: prices.changePercentDay,
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
  if (+days === 1 || +days === 7 || +days === 30) {
    const hourlyPrices = await getPricesTokensHourly(tokens, +days);

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

          // console.log(
          //   `[TokenHandler] returning ${aggregatePricesForSymbol.length} hourly prices for ${pricesBySymbol[0].symbol}`
          // );

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

          // console.log(
          //   `[TokenHandler] returning ${aggregatePricesForSymbol.length} daily prices for ${pricesBySymbol[0].symbol}`
          // );

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
