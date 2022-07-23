import { Box, Checkbox, HStack, Spinner, Text } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import PromiseThrottle from 'promise-throttle';
import React, { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from 'react-error-boundary';
import { DotProps, Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { useRecoilValue } from 'recoil';

import { DEFAULT_CHAIN_ID, TIME_PERIODS } from '../../../config';
import { getTokenProductData } from '../../../services/backend';
import { breakpointState, tokenDetailsForCurrentPeriod } from '../../../state';
import { ChartData } from '../../../types';
import { MergedPrice, mergePrices } from './calculations';
import ChartDot from './ChartDot';
import ChartTooltip from './ChartTooltip';
import { ErrorFallback } from './ErrorFallback';
import { TimeButton } from './TimeButton';

interface TokenChartProps {
	update?: number;
	onDateChange: (date: string) => void;
	size: [number, number]; // percentage w, pixels h
	allowChangePeriod?: boolean;
	heading?: any;
	period: string;
	symbol: string;
	showComparison?: boolean;
	marginRight?: string;
	prices?: ChartData;
	loadPrices?: boolean;
}

export function TokenChart(props: TokenChartProps): JSX.Element {
	const {
		update,
		onDateChange,
		size = [500, 500],
		allowChangePeriod = true,
		heading = {},
		period,
		symbol,
		showComparison = true,
		marginRight = '0',
		prices: defaultPrices = [] as ChartData,
		loadPrices = true,
	} = props;
	const breakpoint = useRecoilValue(breakpointState);
	const { chainId } = useWallet();

	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);

	const [prices, setPrices] = useState<ChartData>(defaultPrices); // SWD prices
	const [ethPrices, setEthPrices] = useState<ChartData>([]); // ethereum prices
	const [btcPrices, setBtcPrices] = useState<ChartData>([]); // bitcoin prices
	const [compareEth, setCompareEth] = useState(false);
	const [compareBtc, setCompareBtc] = useState(false);
	const [mergedPrices, setMergedPrices] = useState<MergedPrice[]>([]);
	const [loadedPrices, setLoadedPrices] = useState('');
	const [loading, setLoading] = useState(false);
	let borderRadius = '0';
	if (!showComparison) {
		borderRadius = '0 0 1.25em 1.25em';
	}

	useEffect(() => {
		if (loadPrices && tokenDetails[symbol]) {
			const product = tokenDetails[symbol];
			setPrices(product.prices);
		}
		if (defaultPrices && symbol == 'Total') {
			setPrices(defaultPrices);
		}
	}, [loadPrices, prices, symbol, tokenDetails, update]);

	useEffect(() => {
		if (!loading) {
			const cId = chainId || DEFAULT_CHAIN_ID;
			if (showComparison && loadedPrices !== `${cId}-${period}`) {
				setLoading(true);
				const promiseThrottle = new PromiseThrottle({
					requestsPerSecond: 120,
					promiseImplementation: Promise,
				});
				const promises = [
					promiseThrottle.add(() => {
						console.log('[TokenChart] Getting ETH prices');
						return getTokenProductData(cId, 'WETH', period);
					}),
					promiseThrottle.add(() => {
						console.log('[TokenChart] Getting BTC prices');
						return getTokenProductData(cId, 'WBTC', period);
					}),
				];
				Promise.all(promises)
					.then(([eth, btc]) => {
						if (eth?.length > 0) {
							console.log('setting eth prices', eth[0].prices);
							setEthPrices(eth[0].prices);
						}
						if (btc?.length > 0) {
							console.log('setting btc prices', btc[0].prices);
							setBtcPrices(btc[0].prices);
							setLoadedPrices(cId);
						}
						setLoadedPrices(`${cId}-${period}`);
					})
					.catch((e) => {
						console.error(e);
					})
					.finally(() => {
						// console.log('done loading prices', cId, period);
						setLoading(false);
					});
			}
		}
	}, [loadedPrices, chainId, period, showComparison, loading]);

	useEffect(() => {
		setMergedPrices([]);
		if (prices.length !== 0) {
			const merged = mergePrices(
				symbol,
				prices,
				ethPrices,
				btcPrices,
				compareEth,
				compareBtc,
				period,
			);
			setMergedPrices(merged);
		}
	}, [compareBtc, compareEth, prices, ethPrices, btcPrices, symbol, period]);

	function handleCompareBtc(e: React.ChangeEvent<HTMLInputElement>) {
		setCompareBtc(e.target.checked);
	}

	function handleCompareEth(e: React.ChangeEvent<HTMLInputElement>) {
		setCompareEth(e.target.checked);
	}

	function renderCoinDot(props: DotProps) {
		return <ChartDot dotColor="url(#gradient1)" {...props} />;
	}

	function renderBtcDot(props: DotProps) {
		return <ChartDot dotColor="#F7931A" {...props} />;
	}

	function renderEthDot(props: DotProps) {
		return <ChartDot dotColor="#66A236" {...props} />;
	}

	const setTimePeriod = useMemo(
		() => (period: string) => {
			if (allowChangePeriod) {
				onDateChange(period);
			}
		},
		[allowChangePeriod, onDateChange],
	);

	type TimePeriodKey = '1D' | '1W' | '1M' | '1Y';

	const timeButtons = useMemo(
		() =>
			Object.keys(TIME_PERIODS).map((currPeriod) => {
				const current = currPeriod as TimePeriodKey;
				// get the label - just the first letter of the period, if narrow screen
				const label = breakpoint === 'sm' ? current.slice(-1) : TIME_PERIODS[current].label;
				return (
					<TimeButton
						period={current}
						active={currPeriod === period}
						onClick={setTimePeriod}
						key={currPeriod}
						disabled={!allowChangePeriod}
						label={label}
					/>
				);
			}),
		[allowChangePeriod, breakpoint, period, setTimePeriod],
	);

	return (
		<Box
			align="center"
			width={`${size[0]}%`}
			minHeight={`${size[1]}px`}
			borderRadius="1.3em"
			borderWidth="2px"
			borderColor="blue5"
			bgColor="blue5"
			marginRight={marginRight}
		>
			<HStack
				height="3em"
				spacing="2"
				bgColor="blue5"
				borderRadius="1.25em 1.25em 0 0"
				padding="0 2rem"
				justify="space-between"
				{...heading}
			>
				{timeButtons}
			</HStack>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Box bgColor="blue7" borderRadius={borderRadius}>
					<ResponsiveContainer width="99%" height={size[1] - 4}>
						<LineChart data={mergedPrices}>
							<defs>
								<linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#1f8cfd" stopOpacity={1} />
									<stop offset="95%" stopColor="#7200e6" stopOpacity={1} />
								</linearGradient>
							</defs>
							<YAxis
								domain={['auto', 'auto']}
								type="number"
								axisLine={false}
								tick={false}
								tickLine={false}
								scale="auto"
								hide={true}
							/>
							<Line
								dataKey="coinScaled"
								type="basis"
								stroke="url(#gradient1)"
								strokeWidth={2}
								legendType="none"
								dot={false}
								activeDot={renderCoinDot}
								animationDuration={500}
							/>
							{compareBtc && btcPrices && (
								<Line
									dataKey="btcScaled"
									type="basis"
									stroke="#F7931A"
									strokeWidth={2}
									legendType="none"
									dot={false}
									activeDot={renderBtcDot}
									animationDuration={500}
								/>
							)}
							{compareEth && ethPrices && (
								<Line
									dataKey="ethScaled"
									type="basis"
									stroke="#66A236"
									strokeWidth={2}
									legendType="none"
									dot={false}
									activeDot={renderEthDot}
									animationDuration={500}
								/>
							)}
							{prices.length === 0 && (
								<Box colSpan={6} textAlign="center" color="bodytext">
									<Text fontStyle="italic" p="2rem 2rem 0 2rem">
										Loading your wallet ...
									</Text>
									<Spinner size="lg" margin="2rem auto" />
								</Box>
							)}
							<Tooltip
								offset={-200}
								filterNull={true}
								cursor={{ stroke: '#BCE7FE' }}
								animationDuration={600}
								animationEasing="ease"
								content={ChartTooltip}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>
			</ErrorBoundary>
			{showComparison && (
				<Box
					height="3em"
					bgColor="blue5"
					borderRadius="0 0 1.25em 1.25em"
					padding="0 2rem"
					textAlign="center"
					lineHeight="3em"
				>
					<Text fontSize="sm" color="purple" d="inline-block">
						Compare with
					</Text>
					<Checkbox
						m="0 1rem 0 1rem"
						onChange={handleCompareEth}
						checked={compareEth}
						color="ethcolor"
						borderColor="#AADCFE"
					>
						ETH
					</Checkbox>
					<Checkbox
						onChange={handleCompareBtc}
						checked={compareBtc}
						color="btcorange"
						borderColor="#AADCFE"
					>
						BTC
					</Checkbox>
				</Box>
			)}
		</Box>
	);
}
