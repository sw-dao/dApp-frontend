/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BigNumber } from '@ethersproject/bignumber';
import { Provider, TransactionReceipt, Web3Provider } from '@ethersproject/providers';
import { WalletContextType } from '@raidguild/quiver';
import { Contract, utils } from 'ethers';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import web3 from 'web3';

import { DEFAULT_CHAIN_ID, DEFAULT_NATIVE_CURRENCY } from '../config';
import { chains } from '../config/chains';
import { Chain, ContractProps } from '../config/types';
import {
	ERC20,
	ERC20__factory,
	IssuanceModule,
	IssuanceModule__factory,
	SetToken,
	SetToken__factory,
} from '../typechain';
import { CoinBalances, TokenSummaryInfoMap } from '../types';
import { getNetworkInfo } from '.';

type ERC20ContractMap = { [key: string]: ERC20 };

const erc20Contracts: ERC20ContractMap = {};

export function getAddressForZeroExSymbol(symbol: string): string {
	return symbol.startsWith('0x') ? utils.getAddress(symbol) : symbol;
}

export async function getChainFromProvider(provider: Web3Provider): Promise<Chain> {
	const chainId = (await provider.getNetwork()).chainId;
	return chains[web3.utils.toHex(chainId)];
}

export function getErc20Contract(address: string, provider: Provider): ERC20 | null {
	if (!erc20Contracts[address]) {
		let contract;
		try {
			contract = ERC20__factory.connect(address, provider);
		} catch (e) {
			console.warn(e);
			return null;
		}
		erc20Contracts[address] = contract;
	}
	return erc20Contracts[address];
}

const setTokens: Record<string, SetToken> = {};

export function getSetToken(address: string, provider: Provider): SetToken | null {
	if (!setTokens[address]) {
		let token;
		try {
			token = SetToken__factory.connect(address, provider);
		} catch (e) {
			console.warn(e);
			return null;
		}
		setTokens[address] = token;
	}
	return setTokens[address];
}

export function getSetIssuance(address: string, provider: Provider): IssuanceModule | null {
	try {
		return IssuanceModule__factory.connect(address, provider);
	} catch (e) {
		console.warn(e);
		return null;
	}
}

export function getZeroExIssuance(chainId: string): ContractProps | null {
	const chain = getNetworkInfo(chainId || DEFAULT_CHAIN_ID);
	return chain.contracts?.zeroExExchangeIssuance || null;
}

export async function getZeroExIssuanceContract(
	chainId: string,
	provider: Provider,
): Promise<Contract | null> {
	const chain = getNetworkInfo(chainId || DEFAULT_CHAIN_ID);
	const zeroEx = chain.contracts?.zeroExExchangeIssuance;
	if (!zeroEx) {
		console.warn(`Couldn't find ZeroExIssuance contract ABI on chain: ${chainId}`);
		return null;
	}
	const { address, abi } = zeroEx;
	const contract = new Contract(address, abi, provider);
	await contract.deployed();
	return contract;
}

/**
 * Gets the balance of an address;
 */
export const getBalanceOf = async (
	tokenAddress: string,
	address: string,
	provider: Provider,
): Promise<BigNumber> => {
	try {
		const contract = getErc20Contract(tokenAddress, provider);
		if (!contract) {
			console.warn(`No contract found for ${tokenAddress}`);
			return BigNumber.from(0);
		}
		await contract.deployed();
		return contract.balanceOf(address);
	} catch (e) {
		console.warn(`Getting Balance of ${address} on ${JSON.stringify(tokenAddress)}`, e);
		return BigNumber.from(0);
	}
};

export const getBalanceOfSymbol = async (
	symbol: string,
	account: string,
	tokenAddresses: TokenSummaryInfoMap,
	provider: Web3Provider,
): Promise<BigNumber> => {
	// should use native of current network
	if (isNative(symbol)) {
		// console.log(`Getting native balance of ${account} on ${symbol}`);
		try {
			return provider.getBalance(account);
		} catch (e) {
			return BigNumber.from(0);
		}
	}
	const tokenAddress = tokenAddresses[symbol]?.address;
	// console.log(`tokenAddress for ${symbol} is ${JSON.stringify(tokenAddress)}`);
	if (!tokenAddress) {
		console.warn(`No address for ${symbol}`, tokenAddresses);
		return BigNumber.from(0);
	}
	// console.log(`Getting balance of ${account} on ${symbol}`);
	return getBalanceOf(tokenAddress, account, provider);
};

export const getApprovalAmounts = async (
	contracts: TokenSummaryInfoMap,
	ownerAddress: string,
	spenderAddress: string,
	provider: Provider,
): Promise<CoinBalances> => {
	const approvals: Record<string, BigNumber> = {};
	for (const symbol in contracts) {
		if (isNative(symbol)) {
			approvals[symbol] = parseUnits('1000000000000000', decimalsOf(symbol));
			continue;
		}
		const tokenAddress = contracts[symbol].address;
		const contract = getErc20Contract(tokenAddress, provider);
		if (!contract) {
			console.warn(`No contract found for ${tokenAddress}`);
			continue;
		}
		try {
			const allowance = await contract.allowance(ownerAddress, spenderAddress);
			/* console.log(
				`${symbol} allowance = ${formatUnits(allowance, decimalsOf(symbol))} @ ${decimalsOf(
					symbol,
				)} for ${spenderAddress}`,
			); */
			approvals[symbol] = allowance;
		} catch (e) {
			console.warn(`Getting allowance for ${spenderAddress} on ${tokenAddress}`, e);
		}
	}
	return approvals;
};

export const getNative = (chainId: string): string => {
	const chain = getNetworkInfo(chainId || DEFAULT_CHAIN_ID);
	return chain.nativeCurrency.symbol || DEFAULT_NATIVE_CURRENCY;
};

export const getSymbolMap = async (
	addresses: string[],
	provider: Provider,
): Promise<TokenSummaryInfoMap> => {
	const symbolMap: TokenSummaryInfoMap = {};

	const promises = addresses.map(async (address) => {
		const coin = getErc20Contract(address, provider);
		if (coin) {
			const symbol = await coin.symbol();
			symbolMap[symbol] = { address, icon: '' };
		}
	});

	// todo use PromiseThrottle
	await Promise.all(promises);
	return symbolMap;
};

export const isApproved = async (
	contractAddress: string,
	sellUnits: BigNumber,
	proxyAddress: string,
	wallet: WalletContextType,
): Promise<boolean> => {
	if (wallet.provider && wallet.address) {
		const token = getErc20Contract(contractAddress, wallet.provider);
		if (!token) {
			console.warn(`No contract found for ${contractAddress}`);
			return false;
		}
		const allowance = await token.allowance(wallet.address, proxyAddress);
		return allowance.gte(sellUnits);
	}
	return false;
};

export const requestApproval = async (
	contractAddress: string,
	proxyAddress: string,
	amountInWei: BigNumber,
	wallet: WalletContextType,
): Promise<any> => {
	const { address, provider } = wallet;
	if (!provider) {
		return null;
	}
	if (!address) {
		return null;
	}
	const signer = provider.getSigner(0);
	const token = getErc20Contract(contractAddress, provider);
	if (!token) {
		console.warn(`No contract found for ${contractAddress}`);
		return null;
	}
	const txCount = await provider.getTransactionCount(address, 'pending');
	console.log('got txCount', txCount);
	const gasPrice = await provider.getGasPrice();

	let gasLimit = '250000';
	try {
		const gasLimitRaw: any = await token
			.connect(signer)
			.estimateGas.approve(proxyAddress, amountInWei);
		gasLimit = Number(gasLimitRaw * 1.7).toFixed(0);
	} catch (e) {
		console.log(e);
	}
	const request = {
		nonce: txCount + '',
		from: address,
		gasLimit,
		gasPrice,
	};
	console.log(`approval request for ${proxyAddress} ${formatEther(amountInWei)}`, request);
	return token.connect(signer).approve(proxyAddress, amountInWei, request);
};

const DECIMALS: Record<string, number> = {
	USDT: 6,
	USDC: 6,
	WBTC: 8,
};

export const decimalsOf = (symbol: string): number => DECIMALS[symbol] || 18;

export const isNative = (symbol: string): boolean => symbol === 'MATIC' || symbol === 'ETH';

export const forceDecimalString = (val: number, symbol: string): string => {
	const expanded = val.toLocaleString('en-US', {
		useGrouping: false,
		maximumFractionDigits: decimalsOf(symbol),
	});
	if (expanded.indexOf('.') > -1) {
		// strip trailing decimal zeroes
		return expanded.replace(/\.?0+$/, '');
	}
	return expanded;
};

export const unitsForSymbol = (raw: number, symbol: string): BigNumber => {
	const decimals = decimalsOf(symbol);
	const stringVal = forceDecimalString(raw, symbol);
	try {
		const units = utils.parseUnits(stringVal, decimals);
		return units;
	} catch (err) {
		console.error(raw, symbol, err);
		return BigNumber.from(0);
	}
};

export function safeFixed(val: any, digits = 2, trimZeroes = false): string {
	let work = '';
	try {
		// @ts-ignore - typescript doesn't know about toFixed - testing
		work = val?.toFixed(digits);
	} catch (err) {
		// pass
	}
	if (!work) {
		try {
			work = parseFloat(`${val}`).toFixed(digits);
		} catch (err) {
			// pass
		}
	}
	if (trimZeroes) {
		work = work.replace(/\.?0+$/, '');
	}
	return work;
}

export const safeFloat = (raw: any): number => {
	let val;
	try {
		val = parseFloat(`${raw}`);
	} catch {
		val = 0;
	}
	return val;
};

export const debugPrintCoinBalances = (balances: CoinBalances): string => {
	const lines = [];
	for (const symbol in balances) {
		const balance = balances[symbol];
		lines.push(`${symbol}: ${formatUnits(balance.toString(), decimalsOf(symbol))}`);
	}
	return lines.join('\n');
};

const BIG_ZERO = BigNumber.from(0);

export async function waitForBalancesAfterTrade(
	address: string,
	allowedTokens: TokenSummaryInfoMap,
	buyToken: string,
	buyBalance: BigNumber,
	sellToken: string,
	sellBalance: BigNumber,
	quote: TransactionReceipt,
	provider: Web3Provider,
): Promise<[BigNumber, BigNumber]> {
	let buyBalanceAfter = buyBalance;
	let sellBalanceAfter = sellBalance;
	let buyDelta = BIG_ZERO;
	let sellDelta = BIG_ZERO;
	let tries = 0;
	let quoteTx = quote;
	// wait for a while to see if balances settle, sometimes they take a moment due to 0x.
	while (tries < 10 && (buyDelta.eq(BIG_ZERO) || sellDelta.eq(BIG_ZERO))) {
		tries += 1;
		[buyBalanceAfter, sellBalanceAfter] = await Promise.all([
			getBalanceOfSymbol(buyToken, address, allowedTokens, provider),
			getBalanceOfSymbol(sellToken, address, allowedTokens, provider),
		]);
		buyDelta = buyBalance.sub(buyBalanceAfter).abs();
		sellDelta = sellBalance.sub(sellBalanceAfter).abs();
		if (buyDelta.eq(BIG_ZERO) && sellDelta.eq(BIG_ZERO)) {
			quoteTx = await provider.waitForTransaction(quoteTx.transactionHash, tries);
		}
	}
	return [buyDelta, sellDelta];
}
