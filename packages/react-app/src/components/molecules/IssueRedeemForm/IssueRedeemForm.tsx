import { Box, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import { useWallet } from '@raidguild/quiver';
import { useOnRepetition } from 'eth-hooks';
import { formatUnits } from 'ethers/lib/utils';
import { useQueryParams } from 'hookrouter';
import PromiseThrottle from 'promise-throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { DEFAULT_CHAIN_ID } from '../../../config';
import { ContractProps } from '../../../config/types';
import { coinBalancesState } from '../../../state';
import { PositionStructOutput } from '../../../typechain/SetToken';
import { CoinBalances, Toaster, TokenSummaryInfoMap } from '../../../types';
import {
	decimalsOf,
	getApprovalAmounts,
	getBalanceOfSymbol,
	getNative,
	getSetToken,
	getSymbolMap,
	getZeroExIssuance,
} from '../../../utils/contracts';
import { CheckboxToggle } from '../../atoms/CheckboxToggle';
import TabButton from '../BuyTokenForm/TabButton';
import {
	doIssuance,
	doIssueExact,
	doRedeemExact,
	doRedemption,
	getIssuanceQuotesForSet,
	getRedemptionQuotesForSet,
} from './issuance';
import { IssueExactForm } from './IssueExactForm';
import { IssueForm } from './IssueForm';
import { RedeemExactForm } from './RedeemExactForm';
import { RedeemForm } from './RedeemForm';

interface IssueRedeemFormProps {
	breakpoint: string;
	symbol: string;
	allowedTokens: TokenSummaryInfoMap;
	marginTop: string;
	width: number | string;
	id?: string;
}

export function IssueRedeemForm({
	breakpoint,
	symbol,
	allowedTokens,
	marginTop,
	width,
	id = 'IssueRedeemForm',
}: IssueRedeemFormProps): JSX.Element {
	const [buyAmount, setBuyAmount] = useState('');
	const [sellAmount, setSellAmount] = useState('');
	const [approvals, setApprovals] = useState<CoinBalances>({});
	const [zeroExApprovals, setZeroExAprovals] = useState<CoinBalances>({});
	const [balances, setBalances] = useRecoilState<CoinBalances>(coinBalancesState);
	const [buying, setBuying] = useState(false);
	const [quoting, setQuoting] = useState(false);
	// value of the token to be issued or redeemed.  Not SWAP, the other side of the trade.
	const [exactTradeVal, setExactTradeVal] = useState(0.0);
	const [updatingApprovals, setUpdatingApprovals] = useState(false);
	const [issuanceModule, setIssuanceModule] = useState<string>('');
	const [zeroExIssuance, setZeroExIssuance] = useState<ContractProps | null>(null);
	// lists of tokens we want to track balances for
	const [componentTokens, setComponentTokens] = useState<TokenSummaryInfoMap>({});
	const [componentSymbols, setComponentSymbols] = useState<string[]>([]);
	const wallet = useWallet();
	const { isConnected, provider, address, chainId } = wallet;

	const [addresses, setAddresses] = useState<string[]>([]);
	const [positions, setPositions] = useState<PositionStructOutput[]>([]);
	const [loading, setLoading] = useState(false);
	const [localTrade, setLocalTrade] = useState<string>('');
	const toast: Toaster = useToast();

	const [query, setQuery] = useQueryParams();

	// name of the token to be used as input to issue/redeem.  Not SWAP, the other side of the trade.
	const exactTradeSymbol = useMemo(() => {
		if (query.trade) {
			return query.trade;
		}
		if (localTrade) {
			return localTrade;
		}
		return getNative(wallet.chainId || DEFAULT_CHAIN_ID);
	}, [query.trade, wallet, localTrade]);

	const showUnderlying = useMemo(() => {
		return query.underlying === 'true';
	}, [query.underlying]);

	const setShowUnderlying = useCallback(
		(t: boolean) => {
			setQuery({ ...query, underlying: t ? 'true' : undefined });
		},
		[query, setQuery],
	);

	const settokenContract = useMemo(() => {
		if (isConnected && provider && allowedTokens[symbol]) {
			const address = allowedTokens[symbol]?.address || '';
			if (address) {
				return getSetToken(allowedTokens[symbol].address, provider);
			}
		}
		return null;
	}, [allowedTokens, isConnected, provider, symbol]);

	useEffect(() => {
		if (provider && settokenContract) {
			settokenContract.getModules().then((modules) => {
				setIssuanceModule(modules[0]);
			});
			const issuance = getZeroExIssuance(chainId || DEFAULT_CHAIN_ID);
			if (!issuance) {
				console.log('no zeroex issuance');
			}
			setZeroExIssuance(issuance);
		}
	}, [chainId, provider, settokenContract]);

	useEffect(() => {
		if (isConnected && settokenContract) {
			setLoading(true);
			settokenContract
				.getComponents()
				.then((components) => {
					setAddresses(components);
					return settokenContract.getPositions();
				})
				.then((positions: PositionStructOutput[]) => {
					setPositions(positions);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [isConnected, settokenContract]);

	const updateApprovalBalances = useCallback(
		async (forceSymbol?: string) => {
			if (
				!updatingApprovals &&
				componentSymbols.length > 0 &&
				issuanceModule &&
				zeroExIssuance &&
				isConnected &&
				provider &&
				address
			) {
				setUpdatingApprovals(true);
				const tokens = {
					...componentTokens,
					[symbol]: allowedTokens[symbol],
					[exactTradeSymbol]: allowedTokens[exactTradeSymbol],
				};
				if (forceSymbol) {
					tokens[forceSymbol] = allowedTokens[forceSymbol];
				}
				// console.log(`Updating Approvals - tokens: ${Object.keys(tokens).join(', ')}`);
				const approvals: CoinBalances = await getApprovalAmounts(
					tokens,
					address,
					issuanceModule,
					provider,
				);
				// console.log('Approvals', debugPrintCoinBalances(approvals));
				setApprovals(approvals);

				const zeroExApprovals: CoinBalances = await getApprovalAmounts(
					tokens,
					address,
					zeroExIssuance.address,
					provider,
				);
				setZeroExAprovals(zeroExApprovals);
				setUpdatingApprovals(false);
			}
		},
		[
			address,
			allowedTokens,
			componentSymbols.length,
			componentTokens,
			exactTradeSymbol,
			isConnected,
			issuanceModule,
			provider,
			symbol,
			updatingApprovals,
			zeroExIssuance,
		],
	);

	const balancesLoadState = useMemo(() => {
		const tokenAddresses = {
			[symbol]: allowedTokens[symbol],
			[exactTradeSymbol]: allowedTokens[exactTradeSymbol],
			...componentTokens,
		};
		const tokens = Object.keys(tokenAddresses);
		const status: Record<string, boolean> = {};
		tokens.forEach((token) => {
			status[token] = !!balances[token];
		});
		return status;
	}, [balances, allowedTokens, exactTradeSymbol, symbol, componentTokens]);

	const balancesLoaded = useMemo(() => {
		let loaded = false;
		for (let i = 0; i < Object.keys(balancesLoadState).length; i++) {
			if (balancesLoadState[Object.keys(balancesLoadState)[i]]) {
				loaded = true;
				break;
			}
		}
		return loaded;
	}, [balancesLoadState]);

	/* const balancesLoading = useMemo(() => {
		let loading = false;
		for (let i = 0; i < Object.keys(balancesLoadState).length; i++) {
			if (!balancesLoadState[Object.keys(balancesLoadState)[i]]) {
				loading = true;
				break;
			}
		}
		return loading;
	}, [balancesLoadState]); */

	const updateBalancesFor = useCallback(
		async (token: string, address: string, provider: Web3Provider) => {
			const tokenAddresses = {
				[symbol]: allowedTokens[symbol],
				[token]: allowedTokens[token],
				...componentTokens,
			};
			const tokens = Object.keys(tokenAddresses);

			const coins: CoinBalances = {};
			// console.log(`Updating balances for ${tokens.join(', ')} @ ${new Date().toISOString()}`);
			const promiseThrottle = new PromiseThrottle({
				requestsPerSecond: 1,
				promiseImplementation: Promise,
			});
			const promises = tokens.map(async (token) =>
				promiseThrottle.add(() =>
					getBalanceOfSymbol(token, address, tokenAddresses, provider).then((balance) => {
						coins[token] = balance;
					}),
				),
			);

			await Promise.all(promises);
			setBalances(coins);
		},
		[allowedTokens, componentTokens, setBalances, symbol],
	);

	const updateBalances = useCallback(async () => {
		if (isConnected && provider && address) {
			updateBalancesFor(exactTradeSymbol, address, provider);
		}
	}, [address, exactTradeSymbol, isConnected, provider, updateBalancesFor]);

	useOnRepetition(updateBalances, {
		pollTime: 1000 * 60 * 5,
		leadingTrigger: isConnected && allowedTokens && Object.keys(allowedTokens).length > 0,
	});

	useOnRepetition(updateApprovalBalances, {
		pollTime: 1000 * 60 * 1,
		leadingTrigger: isConnected && componentSymbols.length > 0,
	});

	const setExactTradeSymbol = useCallback(
		(t: string) => {
			setQuery({ ...query, trade: t });
			setLocalTrade(t);
			if (address && provider) {
				updateBalancesFor(t, address, provider);
			}
		},
		[address, provider, query, setQuery, updateBalancesFor],
	);

	useEffect(() => {
		if (isConnected && provider && addresses.length > 0 && componentSymbols.length === 0) {
			// We've got a list of addresses of components of the tokenset
			// but we need a symbol for all of them, so that we can use them
			// in the main getBalance Loop
			getSymbolMap(addresses, provider).then((symbolMap) => {
				setComponentTokens(symbolMap);
				setComponentSymbols(Object.keys(symbolMap));
				updateApprovalBalances();
			});
		}
	}, [
		addresses,
		allowedTokens,
		componentSymbols.length,
		isConnected,
		positions,
		provider,
		symbol,
		updateApprovalBalances,
	]);

	const clearAmounts = useCallback(() => {
		setBuyAmount('');
		setExactTradeVal(0.0);
		setSellAmount('');
	}, [setBuyAmount, setSellAmount, setExactTradeVal]);

	const handleBuyAmountChange = useCallback(
		(amount: string) => {
			setBuyAmount(amount);
		},
		[setBuyAmount],
	);

	const updateIssuanceQuote = useCallback(
		async (amount: number, token: string) => {
			if (provider && address && amount > 0.000001) {
				setQuoting(true);
				try {
					const quote: [string[], BigNumber] = await getIssuanceQuotesForSet(
						address,
						symbol,
						token,
						amount,
						allowedTokens,
						provider,
						chainId || DEFAULT_CHAIN_ID,
						toast,
					);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [_componentQuotes, totalQuote] = quote;
					//const val = totalQuote.toString();
					const val = formatUnits(totalQuote, decimalsOf(exactTradeSymbol));
					setExactTradeVal(parseFloat(val));
				} catch (e) {
					console.error(e);
				} finally {
					setQuoting(false);
				}
			}
		},
		[address, allowedTokens, chainId, exactTradeSymbol, provider, symbol, toast],
	);

	const updateRedeemQuote = useCallback(
		async (amount: number, token: string) => {
			if (provider && address && amount > 0.000001) {
				setQuoting(true);
				try {
					const quote: [string[], BigNumber] = await getRedemptionQuotesForSet(
						symbol,
						token,
						amount,
						allowedTokens,
						provider,
						chainId || DEFAULT_CHAIN_ID,
						toast,
					);
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [_componentQuotes, totalQuote] = quote;
					const val = formatUnits(totalQuote, decimalsOf(token));
					setExactTradeVal(parseFloat(val));
				} catch (e) {
					console.error(e);
				} finally {
					setQuoting(false);
				}
			}
		},
		[address, allowedTokens, chainId, provider, symbol, toast],
	);

	// reverse the token maps to map address to symbol
	const addressMap: Record<string, string> = useMemo(() => {
		const map: Record<string, string> = {};
		const tokenAddresses = {
			...allowedTokens,
			...componentTokens,
		};
		Object.keys(tokenAddresses).forEach((token) => {
			map[tokenAddresses[token].address] = token;
		});
		return map;
	}, [allowedTokens, componentTokens]);

	const positionMap: Record<string, BigNumber> = useMemo(() => {
		const map: Record<string, BigNumber> = {};
		if (addressMap && positions.length > 0) {
			positions.forEach((position) => {
				const { component: address, unit: balance } = position;
				const symbol = addressMap[address];
				map[symbol] = balance;
			});
		}
		// console.log(`Position Map: ${debugPrintCoinBalances(map)}`);
		return map;
	}, [positions, addressMap]);

	const handleIssue = useCallback(
		(amount: string) => {
			if (!buying && isConnected && issuanceModule && settokenContract) {
				setBuying(true);
				doIssuance(
					amount,
					symbol,
					issuanceModule,
					settokenContract,
					approvals,
					allowedTokens,
					componentTokens,
					positionMap,
					wallet,
					toast,
				)
					.then((result) => {
						if (result) {
							clearAmounts();
						}
						updateBalances();
					})
					.finally(() => {
						setBuying(false);
					});
			}
		},
		[
			allowedTokens,
			approvals,
			buying,
			clearAmounts,
			componentTokens,
			isConnected,
			issuanceModule,
			positionMap,
			settokenContract,
			symbol,
			toast,
			updateBalances,
			wallet,
		],
	);

	const handleIssueExact = useCallback(
		(amount: string) => {
			if (!buying && isConnected && issuanceModule && settokenContract) {
				setBuying(true);
				doIssueExact(
					amount,
					symbol,
					exactTradeSymbol,
					exactTradeVal,
					issuanceModule,
					settokenContract,
					zeroExApprovals,
					allowedTokens,
					wallet,
					chainId || DEFAULT_CHAIN_ID,
					toast,
				)
					.then((result) => {
						if (result) {
							clearAmounts();
						} else {
							updateIssuanceQuote(parseFloat(amount), exactTradeSymbol);
						}
						updateBalances();
					})
					.finally(() => {
						setBuying(false);
					});
			}
		},
		[
			allowedTokens,
			buying,
			chainId,
			clearAmounts,
			exactTradeSymbol,
			exactTradeVal,
			isConnected,
			issuanceModule,
			settokenContract,
			symbol,
			toast,
			updateBalances,
			updateIssuanceQuote,
			wallet,
			zeroExApprovals,
		],
	);

	/**
	 * Handle an "issue exact" amount change
	 */
	const handleIssueExactAmountChange = useCallback(
		(amount: string) => {
			setBuyAmount(amount);
			const val = parseFloat(amount);
			if (val === 0.0 || isNaN(val)) {
				setExactTradeVal(0.0);
			} else if (provider && val !== parseFloat(buyAmount)) {
				updateIssuanceQuote(val, exactTradeSymbol);
			}
		},
		[buyAmount, exactTradeSymbol, provider, updateIssuanceQuote],
	);

	const handleIssueExactTokenChange = useCallback(
		(token: string) => {
			setExactTradeSymbol(token);
			const val = parseFloat(buyAmount);
			if (val > 0.0) {
				updateApprovalBalances(token);
				updateIssuanceQuote(val, token);
			}
		},
		[buyAmount, setExactTradeSymbol, updateApprovalBalances, updateIssuanceQuote],
	);

	const handleRedeem = useCallback(
		(amount: string) => {
			if (!buying && isConnected && issuanceModule && settokenContract) {
				setBuying(true);
				doRedemption(
					amount,
					symbol,
					issuanceModule,
					settokenContract,
					approvals,
					componentTokens,
					wallet,
					toast,
				)
					.then(() => {
						clearAmounts();
						updateBalances();
					})
					.finally(() => {
						setBuying(false);
					});
			}
		},
		[
			approvals,
			buying,
			clearAmounts,
			componentTokens,
			isConnected,
			issuanceModule,
			settokenContract,
			symbol,
			toast,
			updateBalances,
			wallet,
		],
	);

	const handleRedeemExact = useCallback(
		(amount: string) => {
			if (!buying && isConnected && issuanceModule && settokenContract) {
				setBuying(true);
				doRedeemExact(
					amount,
					symbol,
					exactTradeSymbol,
					exactTradeVal,
					issuanceModule,
					settokenContract,
					zeroExApprovals,
					allowedTokens,
					wallet,
					chainId || DEFAULT_CHAIN_ID,
					toast,
				)
					.then((result) => {
						if (result) {
							clearAmounts();
						} else {
							updateRedeemQuote(parseFloat(amount), exactTradeSymbol);
						}
						updateBalances();
					})
					.finally(() => {
						setBuying(false);
					});
			}
		},
		[
			allowedTokens,
			buying,
			chainId,
			clearAmounts,
			exactTradeSymbol,
			exactTradeVal,
			isConnected,
			issuanceModule,
			settokenContract,
			symbol,
			toast,
			updateBalances,
			updateRedeemQuote,
			wallet,
			zeroExApprovals,
		],
	);

	const handleRedeemExactAmountChange = useCallback(
		(amount: string) => {
			setSellAmount(amount);
			const val = parseFloat(amount);
			if (val === 0.0 || isNaN(val)) {
				setExactTradeVal(0.0);
			} else if (provider && val !== parseFloat(buyAmount)) {
				updateRedeemQuote(val, exactTradeSymbol);
			}
		},
		[provider, buyAmount, updateRedeemQuote, exactTradeSymbol],
	);

	const handleRedeemExactTokenChange = useCallback(
		(token: string) => {
			setExactTradeSymbol(token);
			const val = parseFloat(sellAmount);
			if (val > 0.0) {
				updateApprovalBalances(token);
				clearAmounts();
				updateRedeemQuote(val, exactTradeSymbol);
			}
		},
		[
			clearAmounts,
			exactTradeSymbol,
			sellAmount,
			setExactTradeSymbol,
			updateApprovalBalances,
			updateRedeemQuote,
		],
	);

	const issueButtonEnabled = useMemo(
		() => isConnected && !buying && !quoting,
		[buying, isConnected, quoting],
	);

	const finalWidth = useMemo(() => (`${width}`.endsWith('rem') ? width : `${width}%`), [width]);

	return (
		<Box id={id} d="inline-block" width={finalWidth} overflow="hidden" marginTop={marginTop}>
			<Tabs
				isLazy
				variant="unstyled"
				width="100%"
				align="center"
				bgColor="blue5"
				borderColor="blue5"
				borderWidth="2px"
				borderRadius="1.3rem"
				onChange={clearAmounts}
			>
				<TabList
					variant="unstyled"
					bgColor="blue5"
					borderRadius="1.25em 1.25em 0 0"
					padding="0.5rem 2rem"
					spacing=".5rem"
					margin="0 auto"
					width="100%"
				>
					<TabButton label="Buy" />
					<TabButton label="Sell" />
				</TabList>
				<TabPanels bgColor="blue7" pb="2rem" borderRadius="0 0 1.3rem 1.3rem">
					<TabPanel>
						<Box>
							<CheckboxToggle
								label="use underlying"
								checked={showUnderlying}
								onChange={setShowUnderlying}
							/>
							{showUnderlying ? (
								<IssueForm
									approvals={approvals}
									balances={balances}
									breakpoint={breakpoint}
									buyAmount={buyAmount}
									buySymbol={symbol}
									components={componentTokens}
									disabled={buying}
									isBusy={quoting || buying}
									loaded={balancesLoaded && !loading}
									onBuy={handleIssue}
									onBuyAmountChange={handleBuyAmountChange}
									positions={positionMap}
								/>
							) : (
								<IssueExactForm
									allowedTokens={allowedTokens}
									approvals={zeroExApprovals}
									balances={balances}
									breakpoint={breakpoint}
									buttonEnabled={issueButtonEnabled}
									buyAmount={buyAmount}
									buySymbol={symbol}
									disabled={buying || !isConnected}
									disabledLabel={buying ? 'Issuing...' : 'Not connected'}
									isBusy={quoting || buying}
									loaded={balancesLoaded && !loading}
									onBuy={handleIssueExact}
									onBuyAmountChange={handleIssueExactAmountChange}
									onSellTokenChange={handleIssueExactTokenChange}
									sellSymbol={exactTradeSymbol}
									sellVal={exactTradeVal}
								/>
							)}
						</Box>
					</TabPanel>
					<TabPanel>
						<Box>
							<CheckboxToggle
								label="use underlying"
								checked={showUnderlying}
								onChange={setShowUnderlying}
							/>
							{showUnderlying ? (
								<RedeemForm
									approvals={approvals}
									balances={balances}
									breakpoint={breakpoint}
									disabled={buying}
									isBusy={quoting || buying}
									loaded={balancesLoaded && !loading}
									onSell={handleRedeem}
									onSellAmountChange={setSellAmount}
									positions={positionMap}
									sellAmount={sellAmount}
									sellSymbol={symbol}
								/>
							) : (
								<RedeemExactForm
									allowedTokens={allowedTokens}
									approvals={zeroExApprovals}
									balances={balances}
									breakpoint={breakpoint}
									buttonEnabled={issueButtonEnabled}
									disabled={buying || !isConnected}
									isBusy={quoting || buying}
									loaded={balancesLoaded && !loading}
									onAmountChange={handleRedeemExactAmountChange}
									onRedeem={handleRedeemExact}
									onTokenChange={handleRedeemExactTokenChange}
									outputSymbol={exactTradeSymbol}
									outputVal={exactTradeVal}
									redeemAmount={sellAmount}
									redeemSymbol={symbol}
								/>
							)}
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}
