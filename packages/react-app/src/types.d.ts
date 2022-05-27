import { BigNumber } from 'ethers';
import { TokenDetailPane } from './components/organisms/AboutTokenSet/tokens/types';
import { UseToastOptions } from '@chakra-ui/react';

export type ChartData = Array<[number, string]>; // [date, value]

export interface ChartDataMap {
	[key: string]: ChartData;
}

export type TokenDetails = {
	symbol: string;
	address: string;
	marketCap: number;
	volume1Day: number;
	totalSupply: number;
	currentPrice: number;
	changePercent1Day: number;
	prices: ChartData;
	isFake?: boolean;
};

export interface TokenDetailsMap {
	[symbol: string]: TokenDetails;
}

/*
type CoinNumberMap = { [key: string]: number };
type RegionNumberMap = { [key: string]: CoinNumberMap };
*/
export interface CoinBalances {
	[key: string]: BigNumber;
}

export interface TokenSummaryInfo {
	address: string;
	icon: string;
}

export interface TokenSummaryInfoMap {
	[symbol: string]: TokenSummaryInfo;
}

/*
interface SimpleTokenInfo {
	[key: string]: string;
}
*/

export interface SwappableTokens {
	ERC20: TokenSummaryInfoMap;
	TokenProducts: TokenSummaryInfoMap;
}

/*
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
	market_data: MarketData;
	prices: ChartData;
	market_caps: ChartData;
	total_volumes: ChartData;
	icon: string;
}

export type PriceKey =
	| 'price_change_24h'
	| 'price_change_percentage_24h'
	| 'price_change_percentage_7d'
	| 'price_change_percentage_14d'
	| 'price_change_percentage_30d'
	| 'price_change_percentage_60d'
	| 'price_change_percentage_200d'
	| 'price_change_percentage_1y';

export type PriceKeyMap = { [key: string]: priceKey };

export type PeriodPriceMap = { [key: PriceKey]: number };
*/

export type MessagesProps = {
	success: string;
	waiting: string;
	rejected: string;
};

/*
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

export type TokenSetData = {
	fund: {
		id: string;
		name: string;
		address: string;
		components: TokenSetAllocationData[];
	};
};

export type ExtendedTokenInfo = CoinGeckoTokenInfo & TokenSetAllocationData;
*/

export interface TokensetAllocations {
	changePercent1Day: number;
	currentPrice: number;
	fullAmountInSet: number;
	icon: string;
	name: string;
	percentOfSet: number;
	quantity: string;
	symbol: string;
}

export interface TokensetAllocationMap {
	[symbol: string]: TokensetAllocations;
}

export type SwapRequest = {
	buyToken: string; // address
	sellToken: string; // address
	sellAmount: string; // in wei
	slippagePercentage?: number;
	feeRecipient?: string;
	buyTokenPercentageFee?: number;
	skipValidation: boolean;
	takerAddress?: string;
};

export type EmailSignupRequest = {
	u: string;
	id: string;
	output: string;
};

/*
export interface PeriodPriceDetail {
	symbol: string;
	name: string;
	price: number;
	change: number;
	icon: string;
	period: string;
	chartData: ChartData;
}

export type TokenInfoWithPrices = CoinGeckoTokenInfo & PricePeriodDetail;

export interface TokenInfoWithPricesMap {
	[key: string]: TokenInfoWithPrices;
}

// a list of PeriodPriceDetail by symbol, not a list of periods in a single symbol
export type PeriodPriceDetails = Array<PeriodPriceDetail>;

export interface PeriodPriceDetailMap {
	[key: string]: PeriodPriceDetail;
}
*/

export interface AllowanceRequestProps {
	sellToken: string;
	sellAddr: string;
	sellAmount: number;
	sellUnits: BigNumber;
}

export interface SwapTransactionProps {
	buyToken: string;
	buyAddr: string;
	sellToken: string;
	sellAddr: string;
	buyAmount: number;
	buyUnits: BigNumber;
	sellAmount: number;
	sellUnits: BigNumber;
	swapped: boolean;
	valid: boolean;
}

export type TokenInfoMap = {
	[key: string]: SimpleTokenInfo;
};

/*
export type PeriodDetails = Array<ExtendedTokenInfo>;
*/

export interface Holding {
	balance: number;
	timestamp: string;
	address: string;
	token?: { address: string };
}

export interface PortfolioTokenDetails {
	amount: string;
	price: string;
	total: number;
	name: string;
	symbol: string;
	timestamp: string;
	icon?: string;
}

export interface ExtendedTokenDetails {
	symbol: string;
	address: string;
	marketCap: number;
	changePercent1Day: number;
	volume1Day: number;
	currentPrice: number;
	totalSupply: number;
}

export interface ExtendedTokenDetailsMap {
	[symbol: string]: ExtendedTokenDetails;
}

export type ProductSetupDescription = {
	name: string;
	symbol: string;
	addresses: Record<string, string>;
	is_tokenset: boolean;
	category: string;
	yearly_fee: string;
	missing_icon?: boolean;
	detail_pane?: (props: TokenDetailPane) => JSX.Element;
};

export type Toaster = {
	(options?: UseToastOptions | undefined): ToastId | undefined;
	close: (id: ToastId) => void;
	closeAll: (options?: CloseAllToastsOptions | undefined) => void;
	update(id: ToastId, options: Omit<UseToastOptions, 'id'>): void;
	isActive: (id: ToastId) => boolean | undefined;
};
