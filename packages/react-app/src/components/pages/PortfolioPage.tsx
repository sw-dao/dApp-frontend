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
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PRODUCTS } from '../../config/products';
import { getPositions, getTxHistory } from '../../services/backend';

import { extendedTokenDetailsState, tokenDetailsForCurrentPeriod } from '../../state';
import {
	ChartData,
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
// interface BuySell {
// 	amount: number;
// 	timestamp: number;
// 	value: number;
// }
// interface BuySellMap {
// 	[symbol: string]: BuySell[];
// }

// // interface PreChart {}

// const CHART_DATA_PLUS: BuySellMap = {
// 	SWD: [
// 		{
// 			amount: 6.9157720628e-7,
// 			timestamp: 1656126439,
// 			value: 0.000004750739133404401,
// 		},
// 		{
// 			amount: 14.884087640518457,
// 			timestamp: 1648603109,
// 			value: 101.31820229806758,
// 		},
// 		{
// 			amount: 15.200905151515181,
// 			timestamp: 1646892888,
// 			value: 100.206464483699,
// 		},
// 		{
// 			amount: 317.49841749017236,
// 			timestamp: 1653221831,
// 			value: 998.2270895289665,
// 		},
// 	],
// 	SWYF: [
// 		{
// 			amount: 4.99841534636992,
// 			timestamp: 1653736755,
// 			value: 5.921943428153019,
// 		},
// 		{
// 			amount: 0.10016835664851025,
// 			timestamp: 1653736809,
// 			value: 0.11845987536915001,
// 		},
// 		{
// 			amount: 5.875433971898958,
// 			timestamp: 1655183972,
// 			value: 6.62182029546848,
// 		},
// 	],
// 	QME: [
// 		{ amount: 0.037, timestamp: 1654414601, value: 17.628510435414263 },
// 		{
// 			amount: 0.000999,
// 			timestamp: 1655783387,
// 			value: 0.2991188722200339,
// 		},
// 		{ amount: 0.024, timestamp: 1654125214, value: 11.610666881044 },
// 		{ amount: 3.786, timestamp: 1654414461, value: 1803.6510874326216 },
// 	],
// };
// const CHART_DATA_MINUS: BuySellMap = {
// 	SWYF: [
// 		{
// 			amount: 10.97401767,
// 			timestamp: 1655525079,
// 			value: 12.990251086564914,
// 		},
// 	],
// 	QME: [{ amount: 0.001, timestamp: 1655781547, value: 0.2992440971591555 }],
// };

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

// const convertTimestamp = (epoch: number) => {
// 	const date = new Date(epoch * 1000);
// 	return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
// };

// const getChartData = (detailMap: ExtendedTokenDetailsMap) => {
// 	const chart = [];
// 	for (const symbol in CHART_DATA_PLUS) {
// 		chart.push(detailMap[symbol]);
// 		for (const txIndex in CHART_DATA_PLUS[symbol]) {
// 			const tx = CHART_DATA_PLUS[symbol][txIndex];
// 			const tS = new Date(convertTimestamp(tx.timestamp)).getTime();
// 			for (const data in chart[symbol])
// 		}
// 	}
// };

export function PortfolioPage(): JSX.Element {
	const [query] = useQueryParams();
	const [userHolding, setUserHolding] = useState<PortfolioTokenDetails[]>();
	const [txHistory, setTxHistory] = useState<Transaction[]>();
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const [timeout, setTimeout] = useState(0);
	const detailMap = useRecoilValue(extendedTokenDetailsState); // NEW
	const [refresh, setRefresh] = useState(false);
	const [ogAddress, setOgAddress] = useState<string>();

	const { isConnected, address: walletAddress } = useWallet();

	const userHoldings: PortfolioTokenDetails[] = [];
	if ((refresh && walletAddress) || (walletAddress && new Date().getTime() - timeout > 899999)) {
		setRefresh(false);
		setTimeout(new Date().getTime());
		setOgAddress(walletAddress);
		getTxHistory(walletAddress).then((h) => {
			setTxHistory(h);
		});
		getPositions(walletAddress).then((holdings) => {
			for (const e in holdings) {
				// console.log(holdings, holdings[e], detailMap);
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
		});
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
		setRefresh(true);
	}
	const [loadDate, setLoadDate] = useState(Date.now());

	const holdingsHistory: ChartData = [];

	const handleReload = (evt: any) => {
		evt.preventDefault();
		setUserHolding(undefined);
		setTxHistory(undefined);
		setRefresh(true);
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
						{/* <TokenChart
							symbol="Total"
							prices={holdingsHistory}
							onDateChange={noop}
							size={[100, 500]}
							heading={{ textAlign: 'center', id: 'chartHead' }}
							period="1D"
							allowChangePeriod={false}
							showComparison={false}
						/> */}
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
										transactions={txHistory}
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
