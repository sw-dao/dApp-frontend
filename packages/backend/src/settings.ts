import { OutgoingHttpHeaders } from "http2";

import { AddressMap } from "./types";

console.log(`Environment is ${process.env.NODE_ENV}`);

const PORT = process.env.PORT || 3000;
if (
  !process.env.BASE_URL_COINGECKO ||
  !process.env.BASE_URL_0X ||
  !process.env.PROVIDER_NETWORK_NAME ||
  !process.env.PROVIDER_CHAIN_ID ||
  !process.env.FEE_RECIPIENT ||
  !process.env.INFURA_API_KEY ||
  !process.env.COINGECKO_API_KEY ||
  !process.env.MAILCHIMP_API_KEY ||
  !process.env.MAILCHIMP_LIST_ID ||
  !process.env.HASURA_GQL_ENDPOINT
) {
  console.error("Please configure environment (e.g. using .env)");
  process.exit(1);
}

console.log(`Setting port: ${PORT}`);
export const serverPort: number = Number(PORT);
export const defaultTimeOut: number = 10000;
export const defaultHeaders: OutgoingHttpHeaders = {
  "Content-Type": "application/json;charset=utf-8",
};

export const baseUrl0x: string = process.env.BASE_URL_0X;
export const baseUrlCoinGecko: string = process.env.BASE_URL_COINGECKO;
export const MOCK_TOKENSETS: boolean =
  process.env.MOCK_TOKENSETS?.toLowerCase() === "true";

export const providerConfig: {
  name: string;
  chainId: number;
} = {
  name: process.env.PROVIDER_NETWORK_NAME,
  chainId: Number(process.env.PROVIDER_CHAIN_ID),
};
export const infuraProjectId = process.env.INFURA_PROJECT_ID;
export const infuraApiKey = process.env.INFURA_API_KEY;
export const ankrApiKey = process.env.ANKR_API_SECRET;
export const alchemyApiKey = process.env.ALCHEMY_API_KEY || "";
export const coingeckoApiKey = process.env.COINGECKO_API_KEY;
export const mailChimpUrl: string =
  process.env.MAILCHIMP_URL || "https://capital.us5.list-manage.com";
export const mailChimpApiKey: string = process.env.MAILCHIMP_API_KEY;
export const mailChimpListId: string = process.env.MAILCHIMP_LIST_ID;

export const feeRecipient = process.env.FEE_RECIPIENT;
export const buyTokenPercentageFee = 0.05;
export enum SupportedCurrencies {
  usd = "usd",
}

const TokenProducts: ProductAddressMap = {
  "0x1": {
    // Non Tradable, no chart data
    SWAP: "0xb8a62d3df12755ac1722d934bd70aae82d842a43",
    SWYF: "0xefa6903aa49cd539c079ac4b0a090db432615822",
    SWD: "0x1fd154b4d0e3753b714b511a53fe1fb72dc7ae1c",
  },
  "0x3": {
    SWAP: "0xC6D513643A9A9497b375A6baAFa951158d16e566",
    SWYF: "0x2bfe504e5C145F5d5b95df2b7798Ec1C422C5Bc1",
    SWD: "0xc56405Daa77D08a44C83DF719fed18B23b16D016",
  },
  "0x89": {
    // BMI: "0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb",
    BTBTC: "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344",
    BTETH: "0x07A79127182a1c303d11eCDa951310EC1C2E1444",
    BTMAT: "0xb87352B4C3EB9daEd09cD4996dFf85c122394912",
    // DBTC: "0xf2aa5ccea80c246a71e97b418173fcc956408d3f",
    // DETH: "0x72b467cacbdbec5918d8eec0371ca33e6fd42421",
    // DMATI: "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2",
    // DMI: "0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a",
    // DVI: "0x62135f85899d97aed95f4405d710208e68b99f39",
    // EIGHT: "0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b",
    // EMI: "0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568",
    // FOMO: "0x3c0744E72abb3A312122c2118F01F9EE2EB79d43",
    // HORSE: "0x330FF0aFE63f42eb478c92dA79B0ce0c69070183",
    // KEV: "0x4315C720Cad5aa41D7535902b58B015EEA6F97B0",
    // MMI: "0xDFdDd9811796F72bA32a031724f5B1403CD48B91",
    MTBTC: "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026",
    MTETH: "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548",
    // PEI: "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff",
    QMB: "0xabcc2102065ba01c6df1a5a5a57158f452403b70",
    QME: "0x9984d846a3dc77aa0488f3758976b149e8475995",
    // QMM: "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244",
    // SMI: "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19",
    // SSPOTS: "0x99Dd5231314005f26ce147E50F9BAC2365217fCe",
    // SURF: "0xb656D21E3BFa5Aed5405760b891BA539f4CEb976",
    SWAP: "0x25ad32265c9354c29e145c902ae876f6b69806f2",
    SWBYF: "0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc",
    SWD: "0xaee24d5296444c007a532696aada9de5ce6cafd0",
    SWEYF: "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a",
    SWMYF: "0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6",
    SWYF: "0xdc8d88d9e57cc7be548f76e5e413c4838f953018",
    // SWX: "0x24ec3c300ff53b96937c39b686844db9e471421e",
  },
  "0x13881": {
    SWAP: "0x1",
    SWYF: "0x1",
    SWD: "0x1",
  },
};

const ERC20: ProductAddressMap = {
  "0x1": {
    ETH: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  "0x3": {
    ETH: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    USDC: "0x4e31D58068fcdFA0666D0D9e1B809673aB00c126",
    DAI: "0x9Ea3Ee1A0D06f59fA2174BC1840219a3892bf870",
    SWD: "0xc56405Daa77D08a44C83DF719fed18B23b16D016",
  },
  "0x89": {
    MATIC: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    WBTC: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  },
  "0x13881": {
    MATIC: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    WETH: "0x372FFB3139dd312E7BED8A2259c9933baF15Ca2A",
    DAI: "0x6A383cf1F8897585718DCA629a8f1471339abFe4",
    USDC: "0xdA5289fCAAF71d52a80A254da614a192b693e977",
    USDT: "0xd065D279Fbb3767c8f9439685cE94CEE30393483",
  },
};

type ProductAddressMap = { [key: string]: AddressMap };

const SwappableTokens = { TokenProducts, ERC20 } as const;

type timeMap = { [key: string]: string };

const TIME_PERIODS: timeMap = {
  "1D": "1",
  "1W": "7",
  "1M": "30",
  "1Y": "365",
  All: "max",
};

const SWD_CHECK_DISABLED = true;

export {
  ERC20,
  SwappableTokens,
  SWD_CHECK_DISABLED,
  TIME_PERIODS,
  TokenProducts,
};
