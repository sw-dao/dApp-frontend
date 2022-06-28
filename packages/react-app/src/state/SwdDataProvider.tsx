import { useTokenBalance, useWallet } from '@raidguild/quiver';
import { Contract } from 'ethers';
import PromiseThrottle from 'promise-throttle';
import { useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { DEFAULT_CHAIN_ID } from '../config';
import { PRODUCTS_BY_SYMBOL } from '../config/products';
import { useSiteBreakpoint } from '../hooks/useWindowSize';
import {
	getAllSwappableTokens,
	getExtendedTokenDetails,
	getFullTokenProductData,
} from '../services/backend';
import {
	ExtendedTokenDetailsMap,
	SwappableTokens,
	TokenDetails,
	TokenDetailsMap,
	TokenSummaryInfoMap,
} from '../types';
import { getTokenUrl } from '../utils';
import { getErc20Contract } from '../utils/contracts';
import {
	allSwappableTokensState,
	breakpointState,
	extendedTokenDetailsState,
	periodState,
	swdBalanceState,
	tokenDetailsFor1D,
	tokenDetailsFor1M,
	tokenDetailsFor1W,
	tokenDetailsFor1Y,
	tokensLoadedState,
} from './index';

// get token details for current period and always 1 day results
interface TokenPeriodProps {
	[key: string]: any;
}
interface TokenPeriodSettings {
	[key: string]: SetterOrUpdater<any>;
}

// check for error headers
interface Response {
	headers?: Array<{ name: string; value: string }>;
	status: number;
}

const goodResponse = (response: Response): boolean =>
	!!response && !response.headers && response.status !== 200;

type rawSummaryInfo = {
	[key: string]: string;
};
function toTokenSummaryInfoMap(data: rawSummaryInfo): TokenSummaryInfoMap {
	const summary: TokenSummaryInfoMap = {};
	for (const key in data) {
		const address = data[key];
		summary[key] = {
			address,
			icon: getTokenUrl(key)[0],
		};
	}
	return summary;
}

/**
 * Sets up calls to get data, and pushes to recoil.
 * @param {*} Any children
 * @returns children
 */
export function SwdDataProvider({ children }: { children: JSX.Element }): JSX.Element {
	const [tokensDay, setTokensDay] = useRecoilState(tokenDetailsFor1D);
	const [tokensWeek, setTokensWeek] = useRecoilState(tokenDetailsFor1W);
	const [tokensMonth, setTokensMonth] = useRecoilState(tokenDetailsFor1M);
	const [tokensYear, setTokensYear] = useRecoilState(tokenDetailsFor1Y);
	const [allSwappableTokens, setAllSwappableTokens] = useRecoilState(allSwappableTokensState);
	const [tokensLoaded, setTokensLoaded] = useRecoilState(tokensLoadedState);
	const setExtendedTokensMap = useSetRecoilState(extendedTokenDetailsState);
	const setSwdBalance = useSetRecoilState(swdBalanceState);
	const period = useRecoilValue(periodState);
	const [contract, setContract] = useState<Contract | null>(null);
	const [updated, setUpdated] = useState(0);
	const [updatedTokens, setUpdatedTokens] = useState(0);
	const [updating, setUpdating] = useState(false);
	// const [loadedExtended, setLoadedExtended] = useState('');
	const setBreakpoint = useSetRecoilState(breakpointState);
	const breakpoint = useSiteBreakpoint();

	const wallet = useWallet();
	const { provider, chainId, isConnected } = wallet;

	const swdBalance = useTokenBalance(contract, undefined, 120000);

	useEffect(() => {
		setBreakpoint(breakpoint);
	}, [breakpoint, setBreakpoint]);

	useEffect(() => {
		if (swdBalance) {
			setSwdBalance(swdBalance);
		}
	}, [swdBalance, setSwdBalance]);
	useEffect(() => {
		const cId = chainId || DEFAULT_CHAIN_ID;
		// if (loadedExtended !== cId) {
		if (new Date().getTime() - updatedTokens > 10000) {
			setUpdatedTokens(new Date().getTime());
			const tokenKeys = Object.keys(PRODUCTS_BY_SYMBOL);
			const promiseThrottle = new PromiseThrottle({
				requestsPerSecond: 1,
				promiseImplementation: Promise,
			});
			const xMap: ExtendedTokenDetailsMap = {};
			const promises: any[] = [];
			tokenKeys.map(
				(symbol) =>
					// promiseThrottle.add(() =>
					promises.push(
						getExtendedTokenDetails(cId, symbol).then((detail) => {
							xMap[symbol] = detail;
						}),
					),
				// ),
			);

			Promise.all(promises).then(() => {
				// setLoadedExtended(cId);
				setExtendedTokensMap(xMap);
			});
		}
	}, [
		allSwappableTokens.TokenProducts,
		chainId,
		// loadedExtended,
		setExtendedTokensMap,
		tokensLoaded,
	]);

	// Get token list and then the SWD contract
	useEffect(() => {
		const cId = chainId || DEFAULT_CHAIN_ID;
		const updateTokenList = async () => {
			const allSwappableTokens = await getAllSwappableTokens(cId);
			if (goodResponse(allSwappableTokens)) {
				const decoratedTokens: SwappableTokens = {
					ERC20: toTokenSummaryInfoMap(allSwappableTokens.ERC20),
					TokenProducts: toTokenSummaryInfoMap(allSwappableTokens.TokenProducts),
				};
				setAllSwappableTokens(decoratedTokens);
				setTokensLoaded(true);
			}
		};
		updateTokenList();
	}, [chainId, setAllSwappableTokens, setTokensLoaded]);

	useEffect(() => {
		if (chainId && isConnected && provider && tokensLoaded) {
			const swdAddress = allSwappableTokens.TokenProducts?.SWD.address;
			if (!swdAddress) {
				console.warn(
					`no SWD contract address on network: ${chainId}, ${JSON.stringify(
						allSwappableTokens,
						null,
						2,
					)}`,
				);
			} else {
				const c = getErc20Contract(swdAddress, provider);
				if (c) {
					c.deployed()
						.then((contract) => {
							setContract(contract);
						})
						.catch((e) => {
							console.warn(`Error getting contract: ${swdAddress} on chain ${chainId}`, e);
						});
				}
			}
		}
	}, [allSwappableTokens, chainId, isConnected, provider, tokensLoaded]);

	useEffect(() => {
		const tokensByPeriod: TokenPeriodProps = {
			'1D': tokensDay,
			'1W': tokensWeek,
			'1M': tokensMonth,
			'1Y': tokensYear,
		};

		const tokenSettersByPeriod: TokenPeriodSettings = {
			'1D': setTokensDay,
			'1W': setTokensWeek,
			'1M': setTokensMonth,
			'1Y': setTokensYear,
		};

		if (!updating) {
			const periodsNeeded = Object.keys(tokensByPeriod);
			const needsUpdate = new Date().getTime() - updated > 100000;

			if (needsUpdate) {
				setUpdating(true);
				setUpdated(new Date().getTime());
				const promises: any[] = [];
				periodsNeeded.map((period) => {
					promises.push(
						getFullTokenProductData(chainId || DEFAULT_CHAIN_ID, period).then((data) => {
							if (goodResponse(data)) {
								const tokenList = data as Array<TokenDetails>;
								const tokenMap: TokenDetailsMap = {};
								tokenList.forEach((detail) => {
									tokenMap[detail.symbol.toUpperCase()] = detail;
								});
								// console.log(`Updating period ${period}`, tokenMap);
								tokenSettersByPeriod[period](tokenMap);
							}
						}),
					);
				});

				Promise.all(promises).then(() => {
					// console.log(`Updated ${periodsNeeded.join(', ')}`);
					setUpdating(false);
				});
			}
		}
	}, [
		chainId,
		period,
		setTokensDay,
		setTokensMonth,
		setTokensWeek,
		setTokensYear,
		tokensDay,
		tokensMonth,
		tokensWeek,
		tokensYear,
		updated,
		updating,
	]);

	return children;
}
