export interface ContractProps {
	address: string;
	abi: any;
}

export interface ChainContracts {
	[key: string]: ContractProps;
}

export interface Contracts {
	[chain: string]: ChainContracts;
}

export interface NativeCurrency {
	name: string;
	symbol: string;
	decimals: number;
}

export interface ENS {
	registry: string;
}

export interface Explorer {
	name: string;
	url: string;
	standard: string;
}

export interface Chain {
	name: string;
	network: string;
	chainId: number;
	networkId: number;
	nativeCurrency: NativeCurrency;
	contracts: ChainContracts;
	infoURL?: string;
	shortName?: string;
	explorers: Array<Explorer>;
	ens?: ENS;
	zeroExUrl?: string;
	coingecko_market?: string;
}

export interface Chains {
	[key: string]: Chain;
}

export interface PoolDescription {
	name: string;
	symbols: string[];
	poolIndex: number;
}

export interface StringStringMap {
	[key: string]: string;
}

export interface TimePeriod {
	label: string;
	icon: JSX.Element;
	seconds: number;
}

export interface TimePeriods {
	[key: string]: TimePeriod;
}
