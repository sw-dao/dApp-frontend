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
import { getPositions } from '../../services/backend';

import { extendedTokenDetailsState, tokenDetailsForCurrentPeriod } from '../../state';
import {
	ChartData,
	ExtendedTokenDetailsMap,
	Holding,
	PortfolioTokenDetails,
	TokenDetails,
	TokenDetailsMap,
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

function startOfUnixDay(unix: number) {
	return startOfDay(fromUnixTime(unix)).getTime();
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

const holdingsQuery = `query UserHoldings($address: String!) {
	swdUsers(
		where: {address: $address}
		) {
		address,
		holdings {
			balance,
			timestamp,
			token {
				address
			}
		},
		sellTransactions {
			id,
			transactionReceipt {
				token {
					id,
					address
				},
				timestamp,
				from,
				to,
				value
			}
		},
		buyTransactions {
			id,
			transactionReceipt {
				token {
					id,
					address
				},
				timestamp,
				from,
				to,
				value
			}
		}
	}
}`;

const UNKNOWN_TOKEN: TokenDetails = {
	symbol: '???',
	currentPrice: 0,
	changePercent1Day: 0,
	prices: [],
	marketCap: 0,
	volume1Day: 0,
	totalSupply: 0,
	address: '',
};

function holdingDetails(holding: Holding, tokens: TokenDetailsMap): PortfolioTokenDetails {
	const { balance, timestamp, address } = holding;

	const tokenList: Array<TokenDetails> = Object.values(tokens);
	let token: TokenDetails | undefined = tokenList.find((t) => t.address === address);
	if (!token) {
		console.warn(`Cannot find token details for address: ${address}`);
		token = { ...UNKNOWN_TOKEN, address };
	}
	const bigBalance = BigNumber.from(balance);
	const amount = formatUnits(bigBalance, decimalsOf(token.symbol));
	const cleanBalance = parseFloat(amount);
	// latest price
	const price = token.currentPrice;
	const total = cleanBalance * price;
	const overrides = getOverriddenDetails(token.symbol);

	return {
		amount,
		price: price.toFixed(2),
		total,
		name: overrides.name || token.symbol,
		symbol: token.symbol,
		timestamp,
	};
}

interface HoldingsMap {
	[address: string]: Holding[];
}

function holdingsListToMap(holdings: Holding[]) {
	const map: HoldingsMap = {};
	holdings.forEach((holding) => {
		const { balance, timestamp, token } = holding;
		const address = token?.address || '0X0000000000000000000000000000000000000000';
		const key = address.toUpperCase();
		if (!map[key]) {
			map[key] = [];
		}
		map[key].push({ balance, timestamp, address });
	});
	// sort those holdings by timestamp, descending
	for (const key in map) {
		map[key].sort((a, b) => timestampSorter(b.timestamp, a.timestamp));
	}
	return map;
}

interface HoldingsHistory {
	[key: string]: number;
}

interface HoldingsHistoryMap {
	[key: string]: HoldingsHistory;
}

type HoldingsHistoryArray = [string, HoldingsHistory][];

function holdingsToHistory(holdings: HoldingsMap, detailMap: ExtendedTokenDetailsMap): ChartData {
	const history: HoldingsHistoryMap = {};

	Object.keys(holdings).forEach((key) => {
		const token = detailMap[key];
		const { symbol } = token;
		holdings[key].forEach((holding) => {
			const { timestamp, balance } = holding;

			const fullTimestamp = startOfUnixDay(parseInt(timestamp, 10)) + '';
			const sym = symbol || 'SWD';
			const amount = parseFloat(utils.formatUnits(BigNumber.from(balance), decimalsOf(sym)));

			if (!history[fullTimestamp]) {
				history[fullTimestamp] = {};
			}
			if (!history[fullTimestamp][sym]) {
				history[fullTimestamp][sym] = 0;
			}
			history[fullTimestamp][sym] += amount;
		});
	});

	let historyArray: HoldingsHistoryArray = Object.keys(history).map((key) => [key, history[key]]);
	historyArray.sort((a, b) => timestampSorter(a[0], b[0]));
	// That's the sparse array, we need to fill in the gaps
	// chop to one year
	const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
	historyArray = historyArray.filter((h) => parseInt(h[0]) > yearAgo);
	if (historyArray.length === 0) {
		return [];
	}

	let current = historyArray.shift();
	while (!current) {
		current = historyArray.shift();
	}
	const startTime = parseInt(current[0]);
	let dayHoldings = current[1];
	// for each day in from the start of the period, fill in the missing
	// carry the balance forward unless there is a new transaction
	const full: HoldingsHistoryArray = eachDayOfInterval({
		start: new Date(startTime),
		end: startOfDay(Date.now()),
	}).map((day) => {
		const timestamp = day.getTime();
		if (history[timestamp]) {
			dayHoldings = history[timestamp];
		}
		return [timestamp + '', dayHoldings];
	});

	const fullTotals: ChartData = full.map((h) => {
		const [timestamp, holdings] = h;
		const total = Object.keys(holdings).reduce(
			(acc, key) => acc + valueOfHolding(key, holdings[key], detailMap),
			0,
		);
		return [parseInt(timestamp), total + ''];
	});

	return fullTotals;
}

interface ITransactionReceipt {
	token: { id: string };
	from: string;
	to: string;
	value: number;
	timestamp: string;
}

interface TransactionWithId {
	id: string;
	transactionReceipt: ITransactionReceipt;
}

function txDetails(tx: TransactionWithId, tokens: TokenDetailsMap) {
	const {
		id,
		transactionReceipt: {
			token: { id: tokenId },
			from,
			to,
			value,
			timestamp,
		},
	} = tx;
	const [txId, seq] = id.split('-');

	const address = tokenId.toLowerCase();
	const tokenList: Array<TokenDetails> = Object.values(tokens);
	console.log(`tokenList: ${JSON.stringify(tokenList)}`);
	const token = tokenList.find((t) => t?.address?.toLowerCase() === address);
	const amount = utils.formatUnits(value, decimalsOf(token?.symbol || 'ETH'));
	return {
		id: tx.id,
		txId,
		timestamp,
		seq,
		from,
		to,
		amount,
		symbol: token ? token.symbol.toUpperCase() : '???',
		token,
	};
}

const noop = () => {
	// noop
};

interface HoldingsQueryResults {
	data?: any;
	loading: boolean;
	refetch: () => void;
}

const valueOfHolding = (
	symbol: string,
	amount: number,
	// timestamp: string,
	detailMap: ExtendedTokenDetailsMap,
) => {
	const price = detailMap[symbol].currentPrice;
	if (!price) {
		console.warn(`No prices for token: ${symbol}`);
	}
	// const price = findBestPrice(prices, timestamp);
	const total = amount * price;
	return total;
};

export function PortfolioPage(): JSX.Element {
	const [query] = useQueryParams();
	const { address } = query; // TODO: remove after testing
	const [userHolding, setUserHolding] = useState<PortfolioTokenDetails[]>([]);
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const [timeout, setTimeout] = useState(0);
	const detailMap = useRecoilValue(extendedTokenDetailsState); // NEW

	const { address: walletAddress } = useWallet();

	const userHoldings: PortfolioTokenDetails[] = [];
	if (walletAddress && new Date().getTime() - timeout > 10000) {
		setTimeout(new Date().getTime());
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
	if (detailMap.SWD && tokenDetails.SWD) {
		userHolding.forEach((h) => {
			h.price = detailMap[h.symbol].currentPrice.toString();
			h.total = parseFloat(h.amount) * detailMap[h.symbol].currentPrice;
			balance += parseFloat(h.amount) * detailMap[h.symbol].currentPrice;
			oldBalance += parseFloat(h.amount) * parseFloat(tokenDetails[h.symbol].prices[0][1]);
		});
		const cP = balance;
		const p = oldBalance;
		priceChange = ((cP - p) / p) * 100;
	}

	// const priceChange = useMemo(() => {
	// 	if (prices.length > 0) {
	// 		const cP = parseInt(currentPrice);
	// 		const p = parseInt(prices[0][1]);
	// 		return ((cP - p) / p) * 100;
	// 	}
	// 	return row?.changePercent1Day || details?.changePercent1Day || 0;
	// }, [details, row]);

	const [loadDate, setLoadDate] = useState(Date.now());
	// const priceChange = 0;

	const userAddress = useMemo(() => {
		if (address) {
			return address === 'test' ? '0x27239549dd40e1d60f5b80b0c4196923745b1fd2' : walletAddress;
		}
		return walletAddress;
	}, [address, walletAddress]);

	const holdingsParams = useMemo(() => {
		const skip = !userAddress;
		return {
			skip,
			variables: {
				address: userAddress,
			},
		};
	}, [userAddress]);

	console.log(tokenDetails, walletAddress);
	const {
		data: holdingsData,
		loading: holdingsLoading,
		refetch: holdingsRefetch,
	}: HoldingsQueryResults = useQuery(holdingsQuery, holdingsParams);

	const {
		holdings,
		transactions,
		currentBalance,
		holdingsHistory,
	}: {
		holdings: PortfolioTokenDetails[];
		transactions: any[];
		currentBalance: number;
		holdingsHistory: ChartData;
	} = useMemo(() => {
		if (holdingsLoading || !holdingsData) {
			return {
				holdings: [] as PortfolioTokenDetails[],
				transactions: [] as any[],
				currentBalance: 0,
				holdingsHistory: [],
			};
		}
		const { swdUsers } = holdingsData;
		if (swdUsers.length === 0) {
			return {
				holdings: [] as PortfolioTokenDetails[],
				transactions: [] as any[],
				currentBalance: 0,
				holdingsHistory: [],
			};
		}
		const holdingsByCoin = holdingsListToMap(swdUsers[0].holdings);
		const sellTransactions = swdUsers[0].sellTransactions.map((tx: TransactionWithId) =>
			txDetails(tx, tokenDetails),
		);
		const buyTransactions = swdUsers[0].buyTransactions.map((tx: TransactionWithId) =>
			txDetails(tx, tokenDetails),
		);

		const holdings: PortfolioTokenDetails[] = [];

		// const transactions = Array.prototype.push.apply(sellTransactions, buyTransactions);
		const transactions = sellTransactions.concat(buyTransactions);
		//const currentBalance = holdings.reduce((acc, holding) => acc + holding.total, 0);
		let holdingsHistory: ChartData = [];
		if (tokenDetails && Object.keys(tokenDetails).length > 0) {
			// get the most recent balance on each - remember they are already sorted
			Object.values(holdingsByCoin)
				// only the ones with activity
				.filter((holdingList) => holdingList.length > 0)
				// turn the last one into a "Holding" for the table below
				.forEach((holdingList) => {
					const current = holdingList[holdingList.length - 1];
					holdings.push(holdingDetails(current, tokenDetails));
				});
			holdingsHistory = holdingsToHistory(holdingsByCoin, tokenDetails);
		}

		const currentBalance =
			holdingsHistory.length > 0 ? parseFloat(holdingsHistory[holdingsHistory.length - 1][1]) : 0;

		setLoadDate(Date.now());

		return {
			holdings,
			transactions,
			currentBalance,
			holdingsHistory,
		};
	}, [holdingsLoading, holdingsData, tokenDetails]);

	const handleReload = (evt: any) => {
		evt.preventDefault();
		holdingsRefetch();
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
					width="70%"
				>
					<VStack spacing="2rem" align="left" className="bodycontent">
						<Box textAlign="left">
							<Heading fontSize="2rem">
								Portfolio Balance
								{/* <ReloadIcon
									color="bodytext"
									onClick={handleReload}
									d="inline-block"
									ml="1rem"
									fontSize="1.25rem"
									cursor="pointer"
								/> */}
							</Heading>
						</Box>
						<PriceAndDateHeader
							symbol="PORTFOLIO"
							price={balance}
							change={priceChange}
							date={loadDate}
							showTime={true}
							showZero={true}
						/>
						<TokenChart
							symbol="Total"
							prices={holdingsHistory}
							onDateChange={noop}
							size={[100, 500]}
							heading={{ textAlign: 'center', id: 'chartHead' }}
							period="1D"
							allowChangePeriod={false}
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
								<TabButton label="Holdings" />
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
									<HoldingsTable first={false} loading={holdingsLoading} holdings={userHolding} />
								</TabPanel>
								<TabPanel p="0">
									<TransactionsTable
										first={false}
										transactions={transactions}
										loading={holdingsLoading}
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
