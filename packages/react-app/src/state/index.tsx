import { BigNumber } from '@ethersproject/bignumber';
import { RecoilState, atom, selector, selectorFamily } from 'recoil';

import { CoinBalances, ExtendedTokenDetailsMap, SwappableTokens, TokenDetailsMap } from '../types';

const defaultSwappable: SwappableTokens = {
	ERC20: {},
	TokenProducts: {},
};

export const allSwappableTokensState = atom({
	key: 'all_swappable_tokens',
	default: defaultSwappable,
});

export const breakpointState = atom({
	key: 'breakpoint',
	default: 'xl',
});

export const isLargeBreakpoint = selector({
	key: 'large_breakpoint',
	get: ({ get }): boolean => {
		const breakpoint = get(breakpointState);
		return ['lg', 'xl'].includes(breakpoint);
	},
});

export const coinBalancesState = atom({
	key: 'coin_balances',
	default: {} as CoinBalances,
});

export const coinBalances = selectorFamily({
	key: 'coin_balances_qry',
	get:
		(symbol: string) =>
		({ get }): BigNumber | null =>
			get(coinBalancesState)[symbol] ?? null,
	set:
		(symbol: string) =>
		({ set, get }, newValue) => {
			const balances = get(coinBalancesState);
			set(coinBalancesState, { ...balances, [symbol]: newValue } as CoinBalances);
		},
});

export const coinBalancesSymbols = selector({
	key: 'coin_balances_symbols',
	get: ({ get }): string[] => Object.keys(get(coinBalancesState)),
});

export const periodState = atom({
	key: 'period',
	default: '1Y',
});

export const swdBalanceState = atom({
	key: 'token_swd_balance',
	default: BigNumber.from(0),
});

export const extendedTokenDetailsState = atom({
	key: 'extended_token_details',
	default: {} as ExtendedTokenDetailsMap,
});

const defaultPeriodDetails: TokenDetailsMap = {};

export const tokenDetailsFor1D = atom({
	key: 'product_data_1d',
	default: defaultPeriodDetails,
});

export const tokenDetailsFor1W = atom({
	key: 'product_data_1w',
	default: defaultPeriodDetails,
});

export const tokenDetailsFor1M = atom({
	key: 'product_data_1m',
	default: defaultPeriodDetails,
});

export const tokenDetailsFor1Y = atom({
	key: 'product_data_1y',
	default: defaultPeriodDetails,
});

export const tokensLoadedState = atom({
	key: 'tokens_loaded',
	default: false,
});

const tokenDetailsForPeriod = (period: string): RecoilState<TokenDetailsMap> => {
	switch (period) {
		case '1D':
			return tokenDetailsFor1D;
		case '1W':
			return tokenDetailsFor1W;
		case '1M':
			return tokenDetailsFor1M;
		case '1Y':
			return tokenDetailsFor1Y;
		default:
			throw new Error(`Invalid Period: ${period}`);
	}
};

export const tokenDetailsForCurrentPeriod = selector({
	key: 'product_data',
	get: ({ get }): TokenDetailsMap => {
		const period = get(periodState);
		return get(tokenDetailsForPeriod(period));
	},
});
