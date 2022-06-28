import { WalletContextType } from '@raidguild/quiver';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { TransactionDescription } from '../components/atoms/TransactionDescription';
import { DEFAULT_CHAIN_ID, DEFAULT_NATIVE_CURRENCY, TOAST_TIMEOUT_STICKY } from '../config';
import { chains } from '../config/chains';
import { KNOWN_TOKENS, PRODUCTS_BY_SYMBOL } from '../config/products';
import { Chain } from '../config/types';
import { getErrorCode } from '../Errors';
import { AllowanceRequestProps, ChartData, MessagesProps, Toaster } from '../types';
import * as contractImpl from './contracts';
import { isNative } from './contracts';
import * as toastImpl from './toasts';

export const contracts = contractImpl;
export const toasts = toastImpl;

export const getNetworkInfo = (id: string): Chain => {
	if (!id) {
		return chains.NO;
	}
	if (id in chains) {
		return chains[id];
	}
	return {
		...chains.UNKNOWN,
		chainId: parseInt(id, 10),
		name: `${chains.UNKNOWN.name} #${id}`,
	};
};

interface TokenOverride {
	name?: string;
	symbol?: string;
	label?: string;
	image?: string;
}

export const getOverriddenDetails = (sym: string): TokenOverride => {
	const symbol = sym.toUpperCase();

	const name = getTokenName(symbol);

	return {
		name,
		symbol,
		label: [symbol, name].join(' - '),
		image: getTokenUrl(symbol)[0],
	};
};

export function getTokenName(symbol: string): string {
	const product = PRODUCTS_BY_SYMBOL[symbol.toUpperCase()];
	if (product) {
		return product.name;
	}
	return symbol;
}

export function getTokenUrl(symbol: string): [string, boolean] {
	const product = PRODUCTS_BY_SYMBOL[symbol.toUpperCase()];
	let url = '/images/token-unk.png';
	let found = false;
	if (product && !product.missing_icon) {
		url = `/images/token-${symbol.toLowerCase()}.png`;
		found = true;
	}
	if (!found && KNOWN_TOKENS.includes(symbol.toUpperCase())) {
		url = `/images/token-${symbol.toLowerCase()}.png`;
		found = true;
	}
	return [url, found];
}

export async function isApproved(
	params: AllowanceRequestProps,
	allowanceTarget: string,
	wallet: WalletContextType,
): Promise<boolean> {
	const { sellToken, sellAddr, sellUnits } = params;
	if (isNative(sellToken)) {
		return true;
	}
	const chainId = wallet.chainId ?? DEFAULT_CHAIN_ID;
	const chain = getNetworkInfo(chainId);
	const native = chain?.nativeCurrency?.symbol || DEFAULT_NATIVE_CURRENCY;
	let approved = sellToken === native;
	if (!approved) {
		console.log('checking allowances', {
			address: wallet.address,
			allowanceTarget,
			sellAddr,
			sellUnits: formatUnits(sellUnits, contracts.decimalsOf(sellToken)),
		});
		approved = await contracts.isApproved(sellAddr, sellUnits, allowanceTarget, wallet);
		console.log('allowance check result', { approved });
	}
	return approved;
}

export function closest(val: number, arr: number[]): number {
	let mid: number;
	let lo = 0;
	let hi = arr.length - 1;
	while (hi - lo > 1) {
		mid = Math.floor((lo + hi) / 2);
		if (arr[mid] < val) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (val - arr[lo] <= arr[hi] - val) {
		return arr[lo];
	}
	return arr[hi];
}

export function findBestPrice(prices: ChartData, timestamp: string): number {
	if (!prices.length) {
		return 0;
	}
	const ts = parseInt(timestamp);
	const closestTS = closest(
		ts,
		prices.map(([timestamp]) => timestamp),
	);
	const closestPrice = prices.find(([timestamp]) => timestamp === closestTS);
	return closestPrice ? parseFloat(closestPrice[1]) : 0;
}

/**
 *
 * @param {Object} params with the following properties:sellToken, sellAddr, sellAmount, sellUnits
 * @param {String} allowanceTarget address
 * @param {Wallet} wallet from useWallet
 * @param {Toast} toast object from useToast
 * @param {Object} messages with the following properties: waiting, rejected, success
 * @returns
 */
export async function getRequiredApprovals(
	params: AllowanceRequestProps,
	allowanceTarget: string,
	wallet: WalletContextType,
	toast: Toaster,
	messages: MessagesProps,
): Promise<boolean> {
	const { sellToken, sellAddr, sellAmount } = params;
	const approved = await isApproved(params, allowanceTarget, wallet);
	if (approved || !wallet.provider) {
		return true;
	}

	const toastKey = `approve_${sellToken}_${sellAmount}`;

	console.log('approval', allowanceTarget, params);
	const chainId = wallet.chainId ?? DEFAULT_CHAIN_ID;
	try {
		const approvalTx = await contracts.requestApproval(
			sellAddr,
			allowanceTarget,
			parseUnits('999999999', contracts.decimalsOf(sellToken)),
			wallet,
		);
		console.log('approvalTx', approvalTx);
		const waitDescription = (
			<TransactionDescription message={messages.waiting} tx={approvalTx.hash} chainId={chainId} />
		);
		toasts.showToast(
			toastKey,
			{
				title: 'Approval Sent',
				description: waitDescription,
				duration: TOAST_TIMEOUT_STICKY,
			},
			toast,
		);

		await wallet.provider.waitForTransaction(approvalTx.hash, 2);
	} catch (err) {
		const code = getErrorCode(err);
		console.log(err);
		if (code === 4001) {
			toast.closeAll();
			toasts.showErrorToast(
				`${toastKey}_error`,
				{
					title: 'Transaction Rejected',
					description: messages.rejected,
				},
				err,
				toast,
			);
		} else {
			toasts.showErrorToast(toastKey, {}, err, toast);
		}
		return false;
	}

	toast.closeAll();
	toasts.showToast(
		`${toastKey}_success`,
		{
			title: 'Info',
			description: messages.success,
			status: 'info',
		},
		toast,
	);
	return true;
}

export async function getMultipleRequiredApprovals(
	params: AllowanceRequestProps[],
	allowanceTarget: string,
	wallet: WalletContextType,
	toast: Toaster,
	messages: MessagesProps,
): Promise<boolean> {
	const results = [];
	for (const param of params) {
		results.push(await getRequiredApprovals(param, allowanceTarget, wallet, toast, messages));
	}
	return results.every((result) => result);
}

export const timestampSorter = (a: string, b: string): number => parseInt(a) - parseInt(b);

const DECIMAL_RE = new RegExp(/^([0-9]+\.?[0-9]*|\.[0-9]+)$/);
export const isValidNumber = (value: string): boolean => {
	if (value.length === 0) {
		return false;
	}
	return DECIMAL_RE.test(value);
};
