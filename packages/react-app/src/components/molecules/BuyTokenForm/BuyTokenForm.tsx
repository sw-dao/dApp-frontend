import { Box, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { useWallet } from '@raidguild/quiver';
import { useOnRepetition } from 'eth-hooks';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQueryParams } from 'hookrouter';
import PromiseThrottle from 'promise-throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useDebounce } from 'use-debounce';

import { DEFAULT_CHAIN_ID, DEFAULT_NATIVE_CURRENCY } from '../../../config';
import { chains } from '../../../config/chains';
import { coinBalances } from '../../../state';
import { CoinBalances, Toaster } from '../../../types';
import { debugPrintCoinBalances, decimalsOf, getBalanceOfSymbol } from '../../../utils/contracts';
import { showErrorToast } from '../../../utils/toasts';
import { doTrade, getApproval, getTransactionParameters, updatePrices } from './buy';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import TabButton from './TabButton';
import { BuyTokenProps } from './types';

function trimDecimals(val: string) {
	const parts = val.split('.');
	if (parts.length === 2) {
		return `${parts[0]}.${parts[1].slice(0, 8)}`;
	}
	return val;
}

export function BuyTokenForm(props: BuyTokenProps): JSX.Element {
	const { symbol, breakpoint, allowedTokens, marginTop, width, id = 'BuyTokenForm' } = props;
	const [query, setQuery] = useQueryParams();
	const [amounts, setAmounts] = useState<[string, string]>(['0', '0']);
	const [debouncedAmounts] = useDebounce(amounts, 500);
	const [isLoading, setLoading] = useState(false);
	const [approved, setApproved] = useState(false);
	const [allowanceTarget, setAllowanceTarget] = useState('');
	const [symbolBalance, setSymbolBalance] = useRecoilState(coinBalances(symbol));
	const [lastActiveAddress, setLastActiveAddress] = useState<string | null>(null);
	const [balances, setBalances] = useState<CoinBalances>({});
	const [localToken, setLocalToken] = useState<string>('');

	const wallet = useWallet();
	const { address, provider, isConnected, chainId } = wallet;

	const toast: Toaster = useToast();

	const setTrimmedAmounts = useCallback(([a1, a2]: [string, string]) => {
		setAmounts([trimDecimals(a1), trimDecimals(a2)]);
	}, []);

	const token = useMemo(() => {
		if (query.token) {
			return query.token;
		}
		if (localToken) {
			return localToken;
		}
		const cId = chainId || DEFAULT_CHAIN_ID;
		const chain = chains[cId];
		return chain?.nativeCurrency.symbol || DEFAULT_NATIVE_CURRENCY;
	}, [query.token, localToken, chainId]);

	const [tokenBalance, setTokenBalance] = useRecoilState(coinBalances(token));

	const balancesLoaded = useMemo(
		() => symbolBalance !== null || tokenBalance !== null,
		[symbolBalance, tokenBalance],
	);

	const balancesLoading = useMemo(
		() => symbolBalance === null || tokenBalance === null,
		[symbolBalance, tokenBalance],
	);

	useEffect(() => {
		if (chainId && (debouncedAmounts[0] === '0' || debouncedAmounts[1] === '0')) {
			try {
				const params = getTransactionParameters(debouncedAmounts, {
					symbol,
					token,
					allowedTokens,
				});
				if (params.valid) {
					updatePrices(
						chainId,
						params,
						setTrimmedAmounts,
						setApproved,
						setAllowanceTarget,
						toast,
						wallet,
					);
				}
			} catch (err: any) {
				if (!err?.message?.includes('isNAN')) {
					showErrorToast('update-prices', {}, err, toast);
				}
			}
		}
	}, [token, debouncedAmounts, symbol, allowedTokens, toast, wallet, chainId, setTrimmedAmounts]);

	const updateBalancesFor = useCallback(
		async (s1: string, s2: string, address: string, provider: Web3Provider) => {
			const tokens = [s1, s2];
			// console.log(`getting tokens: ${tokens}`);
			const promiseThrottle = new PromiseThrottle({
				requestsPerSecond: 1,
				promiseImplementation: Promise,
			});
			const promises = [
				promiseThrottle.add(async () =>
					getBalanceOfSymbol(s1, address, allowedTokens, provider).then((bal) => {
						setSymbolBalance(bal);
						// console.log(`got ${s1} balance: ${formatUnits(bal, decimalsOf(s1))}`);
						return bal;
					}),
				),
				promiseThrottle.add(async () =>
					getBalanceOfSymbol(s2, address, allowedTokens, provider).then((bal) => {
						setTokenBalance(bal);
						// console.log(`got ${s2} balance: ${formatUnits(bal, decimalsOf(s2))}`);
						return bal;
					}),
				),
			];

			const [b1, b2]: BigNumber[] = await Promise.all(promises);
			const nb: CoinBalances = {
				...balances,
				[s1]: b1,
				[s2]: b2,
			};
			// console.log(`got balances: ${debugPrintCoinBalances(nb)}`);
			setBalances(nb);
		},
		[allowedTokens, balances, setSymbolBalance, setTokenBalance],
	);

	const updateBalances = useCallback(async () => {
		if (isConnected && provider && address) {
			updateBalancesFor(symbol, token, address, provider);
		}
	}, [address, isConnected, provider, symbol, token, updateBalancesFor]);

	useOnRepetition(updateBalances, {
		pollTime: 60 * 1000 * 1, // 1 minute
		leadingTrigger: isConnected,
	});

	const setToken = useCallback(
		(t: string) => {
			setQuery({ ...query, token: t });
			setLocalToken(t);
			if (address && provider) {
				updateBalancesFor(symbol, t, address, provider);
			}
		},
		[setQuery, query, address, provider, updateBalancesFor, symbol],
	);

	// update balances on address change
	useEffect(() => {
		if (address && isConnected && address !== lastActiveAddress) {
			if (lastActiveAddress !== null) {
				updateBalances();
			}
			setLastActiveAddress(address);
		}
	}, [address, isConnected, lastActiveAddress, updateBalances]);

	const handleBuy = useCallback(async () => {
		if (!chainId || !isConnected) {
			showErrorToast('buy_err', { title: 'Not connected' }, {}, toast);
			return;
		}
		const params = getTransactionParameters(['0', debouncedAmounts[1]], {
			symbol,
			token,
			allowedTokens,
		});
		setLoading(true);

		let isApproved = approved;
		if (!isApproved) {
			isApproved = await getApproval(params, allowanceTarget, wallet, toast);
		}

		if (isApproved) {
			const result = await doTrade(chainId, params, wallet, allowedTokens, toast);
			if (result) {
				setAmounts(['0', '0']);
			}
		}
		setApproved(isApproved);
		setLoading(false);
		updateBalances();
	}, [
		allowanceTarget,
		allowedTokens,
		approved,
		chainId,
		debouncedAmounts,
		isConnected,
		symbol,
		toast,
		token,
		updateBalances,
		wallet,
	]);

	const handleSell = useCallback(async () => {
		if (!chainId || !isConnected) {
			showErrorToast('buy_err', { title: 'Not connected' }, {}, toast);
			return;
		}
		const params = getTransactionParameters(['0', debouncedAmounts[0]], {
			symbol: token,
			token: symbol,
			allowedTokens,
		});
		let buy = 0;
		try {
			buy = parseFloat(debouncedAmounts[1]);
		} catch (err) {
			console.error('error parsing buy amount', err);
		}
		params.buyAmount = buy;
		setLoading(true);

		let isApproved = approved;
		if (!isApproved) {
			isApproved = await getApproval(params, allowanceTarget, wallet, toast);
		}

		if (isApproved) {
			const result = await doTrade(chainId, params, wallet, allowedTokens, toast);
			if (result) {
				setAmounts(['0', '0']);
			}
		}
		setApproved(isApproved);
		setLoading(false);
		updateBalances();
	}, [
		allowanceTarget,
		allowedTokens,
		approved,
		chainId,
		debouncedAmounts,
		isConnected,
		symbol,
		toast,
		token,
		updateBalances,
		wallet,
	]);

	const handleBuyAmountChange = useCallback(
		(amount: string): void => {
			setAmounts([trimDecimals(amount), '0']);
		},
		[setAmounts],
	);

	const handlePayAmountChange = useCallback(
		(amount: string): void => {
			setAmounts(['0', trimDecimals(amount)]);
		},
		[setAmounts],
	);

	const handleTokenChange = useCallback(
		(s: string): void => {
			setToken(s);
			setAmounts([amounts[0], '0']);
		},
		[setToken, setAmounts, amounts],
	);

	const needsApproval = approved === false;

	const [buyButtonLabel, sellButtonLabel] = useMemo(() => {
		if (needsApproval && allowanceTarget) {
			return ['Approve & Buy', 'Approve & Sell'];
		}
		return ['Buy', 'Sell'];
	}, [allowanceTarget, needsApproval]);

	const buttonEnabled = useMemo(() => isConnected && !isLoading, [isConnected, isLoading]);

	const finalWidth = useMemo(() => (`${width}`.endsWith('rem') ? width : `${width}%`), [width]);

	return (
		<Box width={finalWidth} id={id} marginTop={marginTop}>
			<Tabs
				variant="unstyled"
				width="100%"
				align="center"
				bgColor="blue5"
				borderColor="blue5"
				borderWidth="2px"
				borderRadius="1.3rem"
				isLazy
			>
				<TabList
					variant="unstyled"
					bgColor="blue5"
					borderRadius="1.25em 1.25em 0 0"
					padding="0.5rem 1rem"
					spacing=".5rem"
					margin="0 auto"
					width="100%"
				>
					<TabButton label="Buy" />
					<TabButton label="Sell" />
				</TabList>
				<TabPanels bgColor="blue7" pb="2rem" width="100%" borderRadius="0 0 1.3rem 1.3rem">
					<TabPanel>
						<BuyForm
							allowedTokens={allowedTokens}
							amounts={amounts}
							approved={approved}
							balances={balances}
							breakpoint={breakpoint}
							buttonEnabled={buttonEnabled}
							buttonLabel={buyButtonLabel}
							buySymbol={symbol}
							disabled={!isConnected}
							disabledLabel={!isConnected ? 'Not connected' : ''}
							isBusy={isLoading}
							loaded={balancesLoaded}
							loading={balancesLoading}
							onBuyAmountChange={handleBuyAmountChange}
							onSellAmountChange={handlePayAmountChange}
							onSubmit={handleBuy}
							onSymbolChange={handleTokenChange}
							sellSymbol={token}
						/>
					</TabPanel>
					<TabPanel>
						<SellForm
							allowedTokens={allowedTokens}
							amounts={amounts}
							approved={approved}
							balances={balances}
							breakpoint={breakpoint}
							buttonEnabled={buttonEnabled}
							buttonLabel={sellButtonLabel}
							buySymbol={symbol}
							disabled={!isConnected}
							isBusy={isLoading}
							loaded={balancesLoaded}
							loading={balancesLoading}
							onBuyAmountChange={handleBuyAmountChange}
							onSellAmountChange={handlePayAmountChange}
							onSubmit={handleSell}
							onSymbolChange={handleTokenChange}
							sellSymbol={token}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}
