import { CONTRACTS } from './contracts';
import { Chains } from './types';

const chains: Chains = {
	NO: {
		name: 'No Network',
		chainId: 0,
		network: 'none',
		networkId: 0,
		explorers: [],
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		contracts: {},
		zeroExUrl: 'https://api.0x.org/swap/v1',
	},
	UNKNOWN: {
		name: 'Unknown Network',
		chainId: 0,
		network: 'unknown',
		networkId: 0,
		explorers: [],
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		contracts: {},
	},
	'0x1': {
		name: 'Ethereum',
		network: 'mainnet',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		infoURL: 'https://ethereum.org',
		shortName: 'eth',
		chainId: 1,
		networkId: 1,
		ens: { registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
		explorers: [{ name: 'etherscan', url: 'https://etherscan.io', standard: 'EIP3091' }],
		zeroExUrl: 'https://polygon.api.0x.org/swap/v1',
		contracts: CONTRACTS.mainnet || {},
		coingecko_market: 'ethereum',
	},
	'0x3': {
		name: 'Ethereum Testnet Ropsten',
		network: 'ropsten',
		nativeCurrency: { name: 'Ropsten Ether', symbol: 'ROP', decimals: 18 },
		infoURL: 'https://github.com/ethereum/ropsten',
		shortName: 'rop',
		chainId: 3,
		networkId: 3,
		ens: { registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010' },
		explorers: [
			{
				name: 'etherscan',
				url: 'https://ropsten.etherscan.io',
				standard: 'EIP3091',
			},
		],
		zeroExUrl: 'https://ropsten.api.0x.org/swap/v1',
		contracts: CONTRACTS.ropsten,
	},
	'0x4': {
		name: 'Ethereum Testnet Rinkeby',
		network: 'rinkeby',
		nativeCurrency: { name: 'RInkeby Ether', symbol: 'rETH', decimals: 18 },
		infoURL: 'https://github.com/ethereum/rinkeby',
		shortName: 'rop',
		chainId: 3,
		networkId: 3,
		explorers: [
			{
				name: 'etherscan',
				url: 'https://rinkeby.etherscan.io',
				standard: 'EIP3091',
			},
		],
		contracts: CONTRACTS.rinkeby,
	},
	'0x89': {
		name: 'Polygon',
		network: 'polygon',
		nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
		infoURL: '',
		shortName: 'poly',
		chainId: 137,
		networkId: 137,
		explorers: [
			{
				name: 'Polygonscan',
				url: 'https://polygonscan.com',
				standard: 'EIP3091',
			},
		],
		zeroExUrl: 'https://polygon.api.0x.org/swap/v1',
		contracts: CONTRACTS.polygon,
		coingecko_market: 'polygon-pos',
	},
	'0x13881': {
		name: 'Mumbai',
		network: 'mumbai',
		nativeCurrency: { name: 'mMatic', symbol: 'mMATIC', decimals: 18 },
		infoURL: '',
		shortName: 'mumbai',
		chainId: 137,
		networkId: 137,
		explorers: [
			{
				name: 'Polygonscan Mumbai',
				url: 'https://mumbai.polygonscan.com',
				standard: 'EIP3091',
			},
		],
		contracts: CONTRACTS.mumbai,
	},
};

export { chains };
