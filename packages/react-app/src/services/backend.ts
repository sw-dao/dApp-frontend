import axios, { AxiosRequestConfig } from 'axios';
import { BigNumber } from 'ethers';

import { BACKEND_SERVER_URL, TIMEOUT } from '../config';
import {
	BuySellMap,
	ExtendedTokenDetails,
	ExtendedTokenDetailsMap,
	PortfolioHoldings,
	Transaction,
} from '../types';

function numberOrZero(value: string | null) {
	if (!value) {
		return 0.0;
	}
	try {
		return parseFloat(value);
	} catch (e) {
		return 0.0;
	}
}

const request = axios.create({
	baseURL: BACKEND_SERVER_URL,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
	timeout: TIMEOUT,
});

function handleError(error: any) {
	console.log(error);
	if (error.response) {
		// Request made and server responded
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
		return error.response;
	}
	return null;
}

export const getAllSwappableTokens = async (chainId: string) => {
	const call = '/api/tokens/swappable/all';

	const config: AxiosRequestConfig = {
		params: { chainId },
	};

	return await request
		.get(call, config)
		.then((res) => {
			return res.data;
		})
		.catch(handleError);
};

export const getEthPrice = async (chainId: string) => {
	const call = '/api/tokens/swappable/price/ethereum';

	const config: AxiosRequestConfig = {
		params: {
			chainId,
			currency: 'USD',
		},
	};

	return request
		.get(call, config)
		.then((res) => {
			console.log('getEthPrice', res.data);
			return res.data;
		})
		.catch(handleError);
};

export const getTokenProductData = async (chainId: string, token: string, period = '1D') => {
	const call = `/api/tokens/swappable/products/${token}/usd/${period}`;
	// console.log(`[getTokenProducData] Req: ${call}`);

	const config: AxiosRequestConfig = {
		params: {
			chainId,
		},
	};

	return await request
		.get(call, config)
		.then((res) => {
			// console.log('[getTokenProducData] Res: ', res.data);
			return res.data;
		})
		.catch(handleError);
};

export const getFullTokenProductData = async (chainId: string, period = '1D') =>
	getTokenProductData(chainId, 'full', period);

export const getPrice = async (
	chainId: string,
	buyToken: string,
	sellToken: string,
	sellAmount: BigNumber, // amount of sellToken to buy in wei
	userAddress: string,
) => {
	const call = `/api/prices/${buyToken}/${sellToken}/${sellAmount.toString()}`;
	const config: AxiosRequestConfig = {
		data: {
			account: userAddress,
			chainId,
		},
	};

	return await request
		.post(call, config)
		.then((res) => {
			return res.data;
		})
		.catch(handleError);
};

export const getQuote = async (
	chainId: string,
	buyToken: string,
	sellToken: string,
	sellAmount: BigNumber,
	userAddress: string,
) => {
	console.log(`getting Quote for ${userAddress}`);
	const call = `/api/quotes/${buyToken}/${sellToken}/${sellAmount.toString()}`;
	const config: AxiosRequestConfig = {
		data: {
			account: userAddress,
			chainId,
		},
	};

	return await request
		.post(call, config)
		.then((res) => {
			return res.data;
		})
		.catch(handleError);
};

export const getExtendedTokenDetails = async (
	chainId: string,
	symbol: string,
): Promise<ExtendedTokenDetailsMap> => {
	return request
		.get(`/api/tokens/detail/${symbol.toUpperCase()}?chainId=${chainId}`)
		.then((res) => {
			const { data } = res;

			const dataAll: { [symbol: string]: ExtendedTokenDetails } = {};
			for (const symbol in data) {
				const d = data[symbol];
				dataAll[d.symbol] = {
					...d,
					marketCap: numberOrZero(d.marketCap),
					changePercent1Day: numberOrZero(d.changePercent1Day),
					volume1Day: numberOrZero(d.volume1Day),
					currentPrice: numberOrZero(d.currentPrice),
					totalSupply: numberOrZero(d.totalSupply),
				};
			}
			return dataAll;
		})
		.catch(handleError);
};

export const getPositions = async (address: string): Promise<PortfolioHoldings> => {
	return request
		.get(`/api/portfolio/holdings/${address}`)
		.then((res) => {
			return res['data'];
		})
		.catch(handleError);
};

export const getTxHistory = async (
	address: string,
): Promise<{
	txHistory: Transaction[];
	charts: BuySellMap[];
}> => {
	return request
		.get(`/api/portfolio/history/${address}`)
		.then((res) => {
			return res['data'];
		})
		.catch(handleError);
};

export const getSingleTokenPrice = async (
	address: string,
): Promise<{ currentPrice: number; changePercentDay: number }> => {
	return request
		.get(`/api/tokens/swappable/price/${address}`)
		.then((res) => {
			return res['data'];
		})
		.catch(handleError);
};

export const getTokenSetAllocation = async (
	address: string,
): Promise<
	{
		component: string;
		unit: string;
	}[]
> => {
	return request
		.get(`/api/tokens/tokenset/${address}`)
		.then((res) => {
			return res['data'];
		})
		.catch(handleError);
};
