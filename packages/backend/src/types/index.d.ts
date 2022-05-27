import { SupportedCurrencies } from "../settings";
import { Paths, Components } from "./api-schema";
declare module "../schema.graphql";

type AddressMap = Components["schemas"]["AddressMap"];

export type PriceChangeInUsd = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

interface CoinGeckoTokenInfo {
  id: string;
  symbol: string;
  name: string;
  address: string;
  description: string;
  icon: string;
  market_data: Partial<MarketData>;
  chart_data: Partial<ChartData>;
  contract_address: string;
  image: string;
}

type currencyValueOptions = {
  [key: string]: number;
};

interface MarketData {
  currency: string;
  current_price: Record<string, number>;
  price_change_24h_in_currency: Record<string, number>;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
}

interface ChartData {
  prices: number[][];
}

export type TokenSetData = {
  fund: {
    id: string;
    name: string;
    address: string;
    components: TokenSetAllocationData[];
  };
};

export interface TokenSetAllocationData extends CoinGeckoTokenInfo {
  decimals: number;
  quantity: string;
  fullAmountInSet: number;
  totalPriceUSD: number;
  percentOfSet: number;
  benchmark: any;
  colors: string[];
  stable: boolean;
  priceChange24h: number;
  pricePerSet: number;
  asset_platform_id: string;
  platforms: Record<string, string>;
  allocation: number;
  [key: string]: any;
}

interface ExtendedTokenInfo
  extends Partial<CoinGeckoTokenInfo>,
    Partial<TokenSetAllocationData> {}

type SwapRequest = {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  slippagePercentage: number;
  feeRecipient: string;
  buyTokenPercentageFee: number;
  skipValidation: boolean;
  takerAddress: string;
};

type EmailSignupRequest = Components["schemas"]["EmailSignupRequest"];

type ExtendedTokenDetailResponse = Components["schemas"]["ExtendedTokenDetailResponse"];
type SwappableTokensResponse = Components["schemas"]["SwappableTokensResponse"];
type TokenDetailsResponse = Components["schemas"]["TokenDetailsResponse"];
type TokenDetails = Components["schemas"]["TokenDetails"]
type QuoteResponse = Components["schemas"]["QuoteResponse"];

export {
  EmailSignupRequest,
  AddressMap,
  MarketData,
  ChartData,
  CoinGeckoTokenInfo,
  ExtendedTokenInfo,
  SwapRequest,
  TokenSetAllocationData,
  SwappableTokensResponse,
  TokenDetails,
  TokenDetailsResponse,
  QuoteResponse,
  ExtendedTokenDetailResponse
};
