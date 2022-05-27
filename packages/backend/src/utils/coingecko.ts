import { OutgoingHttpHeaders } from "http2";

import { TIME_PERIODS, baseUrlCoinGecko, coingeckoApiKey } from "../settings";
import { getCallToUrl } from "./axios";

const headers: OutgoingHttpHeaders = { "X-Cg-Pro-Api-Key": coingeckoApiKey };

const getEthPrice = async (currency: string) => {
  const url = new URL(`${baseUrlCoinGecko}/simple/price`);

  const params = {
    ids: "ethereum",
    vs_currencies: currency,
    include_24hr_change: true,
  };

  return await getCallToUrl(url, { params, headers });
};

const validTimeFrame = (timeframe: string): boolean => {
  if (!Object.keys(TIME_PERIODS).includes(timeframe)) {
    throw new Error("Timeframe is invalid.");
  }
  return true;
};

export {
  getEthPrice,
  validTimeFrame,
};
