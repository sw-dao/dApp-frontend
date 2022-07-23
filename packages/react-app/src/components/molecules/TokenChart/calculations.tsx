import { DATE_FORMAT, TIME_PERIODS } from '../../../config';
import { ChartData } from '../../../types';
import { closest } from '../../../utils';
import { DateTime } from 'luxon';

type Formatter = (timestamp: string) => string;

export const dateFormatter: Formatter = (timestamp: string) => {
	let ts = parseInt(timestamp);
	if (ts < 2000000000) {
		ts *= 1000;
	}
	return new Date(ts).toLocaleString(undefined, DATE_FORMAT);
};

export const timeFormatter: Formatter = (timestamp: string) => {
	const ts = parseInt(timestamp);
	return new Date(ts).toLocaleTimeString(undefined);
};

type Filter = (timestamp: string) => boolean;

export const looksLikeMilliseconds: Filter = (timestamp: string) =>
	parseInt(timestamp) > 2000000000;

export type MergedPrice = {
	timestamp: string;
	symbol: string;
	coin: number;
	coinScaled: number;
	btc: number;
	btcScaled: number;
	eth: number;
	ethScaled: number;
};

const blankMergedPrice = {
	timestamp: '',
	symbol: '',
	coin: 0,
	coinScaled: 0,
	btc: 0,
	btcScaled: 0,
	eth: 0,
	ethScaled: 0,
};

/*
Given a list of prices, return a list of `MergedPrice` objects.
The "scaling" calculations are done to make the chart more readable,
and are based on only the visible portion of the chart.
*/
export function mergePrices(
	symbol: string,
	prices: ChartData,
	ethPrices: ChartData | undefined,
	btcPrices: ChartData | undefined,
	compareEth: boolean,
	compareBtc: boolean,
	period: string,
): { merged: MergedPrice[]; flat: boolean } {
	const merged: MergedPrice[] = [];
	if (!prices) {
		return { merged, flat: true };
	}
	const { map: priceMap, flat } = chartDataToMap(prices);
	// console.log(`Compare ETH ${compareEth} with ${ethPrices?.length}`);
	// console.log(`Compare BTC ${compareBtc} with ${btcPrices?.length}`);
	const ethPriceMap = compareEth && ethPrices ? chartDataToMap(ethPrices).map : {};
	const btcPriceMap = compareBtc && btcPrices ? chartDataToMap(btcPrices).map : {};
	const ethTimestamps: number[] =
		compareEth && ethPrices ? Object.keys(ethPriceMap).map((k) => parseInt(k)) : [];
	ethTimestamps.sort();
	const btcTimestamps: number[] =
		compareBtc && btcPrices ? Object.keys(btcPriceMap).map((k) => parseInt(k)) : [];
	btcTimestamps.sort();

	const keys = Object.keys(priceMap);
	if (keys.length === 0) {
		console.log(`No prices found for ${symbol} in ${period}`);
		return { merged, flat: true };
	}
	keys.sort((a, b) => parseInt(a) - parseInt(b));
	const endTs = Math.round(DateTime.now().toSeconds());
	const startTs =
		Math.round(DateTime.now().startOf('day').toSeconds()) - TIME_PERIODS[period].seconds;
	const isMilliseconds = looksLikeMilliseconds(keys[0]);
	// build initial set of merged prices
	keys.forEach((timestamp) => {
		let ts = parseInt(timestamp);
		if (isMilliseconds) {
			ts = Math.round(ts / 1000);
		}
		if (ts >= startTs && ts <= endTs) {
			const mergedPrice: MergedPrice = {
				...blankMergedPrice,
				timestamp: `${ts}`,
				symbol,
				coin: priceMap[timestamp],
			};
			if (ethTimestamps.length > 0) {
				mergedPrice.eth = ethPriceMap[closest(ts, ethTimestamps)];
			}
			if (btcTimestamps.length > 0) {
				mergedPrice.btc = btcPriceMap[closest(ts, btcTimestamps)];
			}
			merged.push(mergedPrice);
		}
	});

	// Don't bother scaling if we aren't comparing
	if (!compareEth && !compareBtc) {
		for (let i = 0; i < merged.length; i++) {
			merged[i].coinScaled = merged[i].coin;
		}
	} else if (merged.length > 0) {
		// scale the prices to make the chart more readable
		// moving all prices to start at the same visible value
		let priceScale = 1;
		let btcScale = 1;
		let ethScale = 1;
		const { coin: coinStart, btc: btcStart, eth: ethStart } = merged[0];
		const maxVal = Math.max(ethStart, btcStart, coinStart);
		if (compareEth && ethStart > 0) {
			ethScale = maxVal / ethStart;
		}
		if (compareBtc && btcStart > 0) {
			btcScale = maxVal / btcStart;
		}
		if (coinStart > 0) {
			priceScale = maxVal / coinStart;
		}
		for (let i = 0; i < merged.length; i++) {
			const { coin, btc, eth } = merged[i];
			merged[i].coinScaled = coin * priceScale;
			merged[i].btcScaled = btc * btcScale;
			merged[i].ethScaled = eth * ethScale;
		}
	}

	// if (merged.length === 0) {
	// 	console.log(
	// 		`No data for ${symbol} in ${period}.  First date was ${dateFormatter(
	// 			keys[0],
	// 		)}, Last date was ${dateFormatter(keys[keys.length - 1])}`,
	// 	);
	// } else {
	// 	console.log(
	// 		`Returning ${merged.length} prices for ${symbol} in ${period}.  ${dateFormatter(
	// 			keys[0],
	// 		)} - ${dateFormatter(
	// 			keys[keys.length - 1],
	// 		)}, where the query for period ${period} was ${dateFormatter(`${startTs}`)} - ${dateFormatter(
	// 			`${endTs}`,
	// 		)}`,
	// 	);
	// }

	return { merged, flat };
}

type TimestampedMap = { [key: string]: number };

function chartDataToMap(prices: ChartData): { map: TimestampedMap; flat: boolean } {
	const map: TimestampedMap = {};
	let flat = true;
	let firstPrice;
	for (let i = 0; i < prices.length; i++) {
		const [timestamp, price] = prices[i];
		if (flat) {
			if (i === 0) {
				firstPrice = price;
			} else {
				if (price != firstPrice) flat = false;
			}
		}
		map[timestamp.toString()] = parseFloat(`${price}`);
	}
	return { map, flat };
}
