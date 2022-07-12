import {
	Box,
	Center,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { useWallet } from '@raidguild/quiver';
import { eachDayOfInterval, fromUnixTime, startOfDay } from 'date-fns';
import { utils } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useQuery } from 'graphql-hooks';
import { useQueryParams } from 'hookrouter';
import { isUndefined, random } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { PRODUCTS } from '../../config/products';
import { getPositions, getTxHistory } from '../../services/backend';

import { extendedTokenDetailsState, periodState, tokenDetailsForCurrentPeriod } from '../../state';
import {
	ChartData,
	ChartDataMap,
	ExtendedTokenDetailsMap,
	Holding,
	PortfolioTokenDetails,
	TokenDetails,
	TokenDetailsMap,
	Transaction,
} from '../../types';
import { getOverriddenDetails, timestampSorter } from '../../utils';
import { findBestPrice } from '../../utils';
import { decimalsOf } from '../../utils/contracts';
import { ReloadIcon } from '../atoms/ClientIcons';
import { HoldingsTable } from '../molecules/HoldingsTable';
import { PriceAndDateHeader } from '../molecules/PriceAndDateHeader';
import { StyledSection } from '../molecules/StyledSection';
import { TokenChart } from '../molecules/TokenChart/TokenChart';
import { TransactionsTable } from '../molecules/TransactionsTable';
import { FullHeightPage } from '../templates/FullHeightPage';

const styles = {
	active: {
		color: 'black',
		bgColor: '#BCE7FE',
		borderColor: 'transparent',
	},
	inactive: {
		color: 'tableheader',
		bgColor: 'transparent',
		padding: '0.2rem 1.5rem',
		margin: '0 0.5rem',
		borderRadius: '2em',
		borderColor: 'transparent',
	},
};
interface BuySell {
	amount: number;
	timestamp: number;
	value: number;
}
interface BuySellMap {
	[symbol: string]: BuySell[];
}

interface TxChart {
	txHistory: Transaction[];
	charts: BuySellMap[];
}

function TabButton({ label }: { label: string }): JSX.Element {
	return (
		<Tab
			className="js-focus-visible focus-visible tab"
			_selected={styles.active}
			_hover={styles.active}
			_active={styles.active}
			{...styles.inactive}
		>
			{label}
		</Tab>
	);
}

const noop = () => {
	//noop
};

const convertTimestamp = (epoch: number) => {
	const date = new Date(epoch);
	return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
};

const getChartData = (tokenDetails: TokenDetailsMap, chartData: BuySellMap) => {
	const chart: ChartDataMap = {};
	for (const symbol in chartData) {
		if (!chart[symbol]) {
			chart[symbol] = [];
		}
		if (isUndefined(tokenDetails[symbol].prices)) {
			continue;
		}
		const product = tokenDetails[symbol].prices;
		for (const txIndex in chartData[symbol]) {
			const tx = chartData[symbol][txIndex];
			product.forEach((data) => {
				const timestamp = data[0];
				const value = data[1];
				if (timestamp >= tx.timestamp) {
					let temp = false;
					chart[symbol].every((e) => {
						if (e[0] === timestamp) {
							e[1] = (parseFloat(e[1]) + parseFloat(value) * tx.amount).toString();
							temp = true;
							return;
						}
					});
					if (!temp) {
						chart[symbol].push([timestamp, (parseFloat(value) * tx.amount).toString()]);
						// chart[symbol].push([timestamp, tx.amount.toString()]);
					}
				}
				// else {
				// 	let temp = false;
				// 	chart[symbol].every((e) => {
				// 		if (e[0] == timestamp) {
				// 			temp = true;
				// 			return;
				// 		}
				// 	});
				// }
			});
		}
	}
	return chart;
};

const combinePlusChartData = (plus: ChartDataMap) => {
	const combinedChart: ChartData = [];
	for (const symbol in plus) {
		plus[symbol].forEach((data) => {
			let temp = false;
			// if (!combinedChart[symbol]) {
			// 	combinedChart[symbol] = [];
			// }
			combinedChart.forEach((e) => {
				if (e[0] === data[0]) {
					e[1] = (parseFloat(e[1]) + parseFloat(data[1])).toString();
					temp = true;
				}
			});
			if (!temp) {
				combinedChart.push(data);
			}
		});
	}
	return combinedChart;
};
const combinePlusWithMinusChartData = (combinedPlus: ChartData, minus: ChartDataMap) => {
	const combinedChart: ChartData = combinedPlus;
	for (const symbol in minus) {
		minus[symbol].forEach((data) => {
			combinedChart.forEach((e) => {
				if (e[0] === data[0]) {
					e[1] = (parseFloat(e[1]) - parseFloat(data[1])).toString();
				}
			});
		});
	}
	return combinedChart;
};

export function PortfolioPage(): JSX.Element {
	const [query, setQuery] = useQueryParams();
	const { period = '1Y' } = query;
	const [userHolding, setUserHolding] = useState<PortfolioTokenDetails[]>();
	const [txHistory, setTxHistory] = useState<TxChart>();
	// const [charts, setCharts] = useState<BuySellMap[]>();
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const [timeout, setTimeout] = useState(0);
	const detailMap = useRecoilValue(extendedTokenDetailsState); // NEW
	const [refresh, setRefresh] = useState(false);
	const [ogAddress, setOgAddress] = useState<string>();
	const [periodVal, setPeriodState] = useRecoilState(periodState);
	const { isConnected, address: walletAddress } = useWallet();
	const [holdingsCharts, setHoldingsCharts] = useState<ChartDataMap>({});
	const [chartData, setChartData] = useState<ChartData>([]);
	const userHoldings: PortfolioTokenDetails[] = [];
	if ((refresh && walletAddress) || (walletAddress && new Date().getTime() - timeout > 899999)) {
		setRefresh(false);
		setTimeout(new Date().getTime());
		setOgAddress(walletAddress);
		getTxHistory(walletAddress)
			.then((h) => {
				setTxHistory(h);
			})
			.catch((e) => console.error(e));
		getPositions(walletAddress)
			.then((holdings) => {
				for (const e in holdings) {
					userHoldings.push({
						amount: holdings[e].toString(),
						price: '0', //detailMap[e].currentPrice.toString()
						total: 0, //holdings[e] * detailMap[e].currentPrice
						name: '',
						symbol: e,
						timestamp: '',
					});
				}
				setUserHolding(userHoldings);
			})
			.catch((e) => console.error(e));
	}
	if (
		(txHistory && tokenDetails.SWD && !holdingsCharts[periodVal]) ||
		(refresh && txHistory && tokenDetails.SWD)
	) {
		const plusCharts = getChartData(tokenDetails, txHistory.charts[0]);
		const minusCharts = getChartData(tokenDetails, txHistory.charts[1]);
		const plus = combinePlusChartData(plusCharts);
		console.log(plusCharts, minusCharts, plus);
		const chart = combinePlusWithMinusChartData(plus, minusCharts);
		chart.sort((b, a) => timestampSorter(b[0].toString(), a[0].toString()));
		holdingsCharts[periodVal] = chart;
		setHoldingsCharts(holdingsCharts);
		setChartData(holdingsCharts[periodVal]);
	}
	let balance = 0;
	let oldBalance = 0;
	let priceChange = 0;
	if (walletAddress && detailMap.SWD && tokenDetails.SWD && userHolding) {
		userHolding.forEach((h) => {
			if (detailMap[h.symbol]) {
				h.price = detailMap[h.symbol].currentPrice.toString();

				h.total = parseFloat(h.amount) * detailMap[h.symbol].currentPrice;
				balance += parseFloat(h.amount) * detailMap[h.symbol].currentPrice;
				oldBalance += parseFloat(h.amount) * parseFloat(tokenDetails[h.symbol].prices[0][1]);
			}
		});
		const cP = balance;
		const p = oldBalance;
		priceChange = ((cP - p) / p) * 100;
	}
	if (ogAddress && walletAddress && ogAddress != walletAddress) {
		setUserHolding(undefined);
		setTxHistory(undefined);
		setHoldingsCharts({});
		setChartData([]);
		setRefresh(true);
	}
	const [loadDate, setLoadDate] = useState(Date.now());

	const handleReload = (evt: any) => {
		evt.preventDefault();
		setUserHolding(undefined);
		setTxHistory(undefined);
		setHoldingsCharts({});
		setChartData([]);
		setRefresh(true);
	};
	useEffect(() => {
		if (periodVal !== period) {
			setPeriodState(period);
		}
		if (holdingsCharts[periodVal] && chartData !== holdingsCharts[periodVal]) {
			setChartData(holdingsCharts[periodVal]);
		}
	}, [periodVal, period, setPeriodState]);
	const setPeriod = (p: string) => {
		setQuery({ ...query, period: p });
		setPeriodState(p);
	};
	return (
		<FullHeightPage pageKey="portfoliopage">
			<Center>
				<StyledSection
					id="portfolio"
					section="body"
					paddingRight="3rem"
					paddingLeft="3rem"
					marginBottom="3rem"
					width="max(90%, 28rem)"
				>
					<VStack spacing="2rem" align="left" className="bodycontent">
						<Box textAlign="left">
							<Heading fontSize="2rem">
								Portfolio Balance
								<ReloadIcon
									color="bodytext"
									onClick={handleReload}
									d="inline-block"
									ml="1rem"
									fontSize="1.25rem"
									cursor="pointer"
								/>
							</Heading>
						</Box>
						<PriceAndDateHeader
							symbol="PORTFOLIO"
							price={balance}
							// change={priceChange}
							change={0}
							date={loadDate}
							showTime={true}
							showZero={false}
						/>
						<TokenChart
							update={chartData.length + random(1, 100)}
							symbol="Total"
							prices={chartData}
							onDateChange={setPeriod}
							size={[100, 500]}
							heading={{ textAlign: 'center', id: 'chartHead' }}
							period={period}
							allowChangePeriod={true}
							showComparison={false}
						/>
						<Tabs id="portfoliotabs">
							<TabList
								variant="unstyled"
								bgColor="lightline"
								borderRadius="2em 2em 0 0"
								padding="1rem"
								spacing=".5rem"
								margin="0 auto"
								width="100%"
								borderBottom="1px solid #120046"
								borderColor="#120046"
							>
								<TabButton label="Portfolio" />
								<TabButton label="Transactions" />
							</TabList>

							<TabPanels
								bgColor="bodydark"
								width="100%"
								borderBottomRadius="2em"
								padding="0"
								borderTop="1px solid #120046"
								borderColor="#120046"
							>
								<TabPanel p="0">
									<HoldingsTable isConnected={isConnected} first={false} holdings={userHolding} />
								</TabPanel>
								<TabPanel p="0">
									<TransactionsTable
										isConnected={isConnected}
										first={false}
										transactions={txHistory?.txHistory}
									/>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</VStack>
				</StyledSection>
			</Center>
		</FullHeightPage>
	);
}
