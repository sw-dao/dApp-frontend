import CoinGecko from 'coingecko-api';

import { chains } from '../config/chains';

const coinGecko = new CoinGecko();

let coins: any = null;

export async function getCoins() {
	if (!coins) {
		// @ts-expect-error - this method exists
		const res = await coinGecko.coins.list();
		coins = res.data;
	}
	return coins;
}

export async function findCoin(symbol: string) {
	const coins = await getCoins();
	return coins.find((coin: any) => coin.symbol.toLowerCase() === symbol.toLowerCase());
}

export async function getCoinData(symbol: string) {
	const coin = await findCoin(symbol);
	if (!coin) {
		throw new Error(`Coin ${symbol} not found`);
	}
	const res = await coinGecko.coins.fetch(coin.id, {
		community_data: false,
		localization: false,
		tickers: false,
		developer_data: false,
		sparkline: true,
	});
	// console.log(`Coin ${symbol} data fetched`, res.data);
	return res.data;
}

export async function getCoinDataByAddress(address: string, chainId: string) {
	const market = chains[chainId]?.coingecko_market ?? 'polygon-pos';
	// @ts-expect-error - this method exists
	return coinGecko.coins.fetchCoinContractInfo(address.toLowerCase(), market);
}
