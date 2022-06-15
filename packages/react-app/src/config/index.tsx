import { NetworkConfig } from '@raidguild/quiver';
import React from 'react';

import { CalendarIcon, DeskClockIcon } from '../components/atoms/ClientIcons';
import { PoolDescription, TimePeriods } from './types';

// these variables are set by the .env files
export const {
	REACT_APP_BACKEND_SERVER_URL: BACKEND_SERVER_URL = '',
	REACT_APP_INFURA_ID: INFURA_ID = 'INVALID',
} = process.env;

export const {
	REACT_APP_SUBGRAPH_SWD_URL:
		SUBGRAPH_SWD_URL = 'https://api.thegraph.com/subgraphs/name/bitbeckers/swd-poc-dev',
} = process.env;

export const SUPPORTED_NETWORKS: NetworkConfig = {
	/* '0x1': {
		name: 'Ethereum Mainnet',
		chainId: '0x1',
		symbol: 'ETH',
		explorer: 'https://etherscan.io',
		rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
	},
	'0x3': {
		chainId: '0x3',
		name: 'Ropsten Testnet',
		symbol: 'ETH',
		explorer: 'https://ropsten.etherscan.io',
		rpc: `https://ropsten.infura.io/v3/${INFURA_ID}`,
	},
	'0x4': {
		chainId: '0x4',
		name: 'Rinkeby Testnet',
		symbol: 'ETH',
		explorer: 'https://rinkeby.etherscan.io',
		rpc: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
	},
	'0x539': {
		chainId: '0x539',
		name: 'Hardhat',
		symbol: 'ETH',
		explorer: 'http://localhost:1234',
		rpc: 'http://localhost:8545',
	}, */
	'0x89': {
		chainId: '0x89',
		name: 'Polygon',
		symbol: 'MATIC',
		explorer: 'https://polygonscan.com',
		rpc: 'https://polygon-rpc.com/',
	},
	'0x13881': {
		chainId: '0x13881',
		name: 'Mumbai Testnet',
		symbol: 'MATIC',
		explorer: 'https://mumbai.polygonscan.com',
		rpc: 'https://matic-mumbai.chainstacklabs.com',
	},
};

interface CoingeckoIdMap {
	[chainId: string]: string;
}

export const COINGECKO_IDS: CoingeckoIdMap = {
	/* '0x1': 'ethereum',
	'0x3': 'ethereum',
	'0x4': 'ethereum',
	'0x539': 'ethereum', */
	'0x89': 'polygon-pos',
	'0x13881': 'polygon-pos',
};

export const DEFAULT_CHAIN_ID = '0x89';
export const DEFAULT_NATIVE_CURRENCY = 'MATIC';

interface DateFormat {
	[key: string]: string;
}

export const DATE_FORMAT: DateFormat = {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
};

export const DATE_FORMAT_WITH_TIME: DateFormat = {
	...DATE_FORMAT,
	hour: 'numeric',
	minute: 'numeric',
};

export const TIMEOUT = 60000;

export const TOAST_TIMEOUT_ALERT = 6000;
export const TOAST_TIMEOUT_INFO = 3000;
export const TOAST_TIMEOUT_STICKY = null;

export const TIME_PERIODS: TimePeriods = {
	'1D': {
		label: '1 Day',
		icon: <DeskClockIcon mt="0.2rem" fontSize="1.5rem" />,
		seconds: 86400,
	},
	'1W': {
		label: '1 Week',
		icon: <CalendarIcon mt="0.2rem" fontSize="1.5rem" />,
		seconds: 604800,
	},
	'1M': {
		label: '1 Month',
		icon: <CalendarIcon mt="0.2rem" fontSize="1.5rem" />,
		seconds: 2592000,
	},
	'1Y': {
		label: '1 Year',
		icon: <CalendarIcon mt="0.2rem" fontSize="1.5rem" />,
		seconds: 31536000,
	},
	/* ALL: {
		label: 'All',
		icon: <CalendarClockIcon mt="0.2rem" fontSize="1.5rem" />,
	}, */
};

export const SWD_DISTRIBUTION: Array<[string, number]> = [
	['Community Airdrop', 6],
	['Private Sale', 10],
	['Launchpad Offering', 5],
	['Liquidity Mining Program', 6],
	['Team', 24],
	['DAO Treasury', 49],
];

export const SWD_FARMS: Array<PoolDescription> = [
	{
		name: 'SWD-ETH',
		symbols: ['SWD', 'ETH'],
		poolIndex: 0,
	},
	/*
	{
		name: 'SWD-USDC',
		symbols: ['SWD', 'USDC'],
	},
	*/
];

export const TOKENSETS_RATINGS = {
	SWD: {
		buy: 50,
		sell: 10,
		hold: 10,
	},
	SWAP: {
		buy: 150,
		sell: 15,
		hold: 10,
	},
	SWYF: {
		buy: 201,
		sell: 31,
		hold: 17,
	},
};

interface Breakpoints {
	[key: string]: number;
}

export const MIN_TRADE = 0.000001;

// tokens allowed to appear on trade forms.
export const TRADING_TOKENS = ['MATIC', 'WETH', 'WBTC', 'DAI', 'USDC', 'USDT'];

export const UI_BREAKPOINTS: Breakpoints = {
	sm: 720,
	md: 1024,
	lg: 1280,
	xl: 1440,
};

export const SIDE_PADDING: Record<string, string> = {
	sm: '1rem',
	md: '2rem',
	lg: '6rem',
	xl: '10rem',
};

export const WIDTHS: Record<string, string> = {
	sm: '100%',
	md: '100%',
	lg: '100%',
	xl: '100%',
};

// https://capital.us5.list-manage.com/subscribe/post?u=b7cf75761eafc2de03d5d5570&amp;id=43b4351721

// console.log(`env: NETWORK_ID=${NETWORK_ID}`);
