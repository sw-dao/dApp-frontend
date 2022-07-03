import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { WalletContextType } from '@raidguild/quiver';
import { Dispatch, SetStateAction } from 'react';
import web3 from 'web3';

import { DEFAULT_CHAIN_ID } from '../../../config';
import { isYieldFund } from '../../../config/products';
import { getErrorCode } from '../../../Errors';
import ValidationError from '../../../Errors/ValidationError';
import { getPrice, getQuote } from '../../../services/backend';
import { CoinBalances, SwapTransactionProps, Toaster, TokenSummaryInfoMap } from '../../../types';
import { getRequiredApprovals, isApproved } from '../../../utils';
import {
	decimalsOf,
	forceDecimalString,
	getBalanceOfSymbol,
	safeFixed,
	safeFloat,
	unitsForSymbol,
	waitForBalancesAfterTrade,
} from '../../../utils/contracts';
import {
	showErrorToast,
	showTransactionSendingToast,
	showTransactionSentToast,
	showTransactionSettlingToast,
	showTransactionSuccessToast,
} from '../../../utils/toasts';

const APPROVAL_MESSAGES = {
	waiting:
		'Waiting for approval transaction to be confirmed on-chain before sending the trade to execution.',
	rejected:
		'We cannot execute the trade without this contract permission. Please Re-Submit for Approval.',
	success:
		'Approval confirmed on-chain, now initiating the trade. Please confirm the transaction in your wallet.',
};

const BIG_ZERO = BigNumber.from(0);

export async function doTrade(
	chainId: string,
	params: SwapTransactionProps,
	wallet: WalletContextType,
	allowedTokens: TokenSummaryInfoMap,
	toast: Toaster,
): Promise<boolean> {
	const { sellToken, sellAddr, buyToken, buyAddr, sellUnits } = params;
	const toastKey = `trade_${sellToken}_${buyToken}`;
	const { address, provider } = wallet;

	if (!address || !provider) {
		return false;
	}

	if (sellUnits.lt(1)) {
		toast.closeAll();
		showErrorToast(
			'smalltrade',
			{
				description: `Trade too small, minimum is 1 Wei.`,
			},
			{},
			toast,
		);
		return false;
	}

	const quote = await getQuote(chainId, buyAddr, sellAddr, sellUnits, address);
	if (quote.code && quote.reason) {
		toast.closeAll();
		showErrorToast(
			toastKey,
			{
				description: quote.reason,
			},
			{},
			toast,
		);
		return false;
	}

	toast.closeAll();
	showTransactionSendingToast(toastKey, toast);

	let quoteTx: TransactionReceipt | null = null;
	let buyBalance = BIG_ZERO;
	let sellBalance = BIG_ZERO;
	try {
		buyBalance = await getBalanceOfSymbol(buyToken, address, allowedTokens, provider);
		sellBalance = await getBalanceOfSymbol(sellToken, address, allowedTokens, provider);
		quoteTx = await sendQuote(quote, wallet, toast);
	} catch (err) {
		console.error({ msg: 'Send Trade Error', quoteTx, buyBalance, sellBalance }, err);
		const code = getErrorCode(err);
		if (code === 4001) {
			showErrorToast(toastKey, { title: 'Cancelled', description: 'User Cancelled' }, err, toast);
		} else {
			showErrorToast(toastKey, {}, err, toast);
		}
	}
	if (!quoteTx || quoteTx.status === 0) {
		return false;
	}
	const cId = wallet.chainId || DEFAULT_CHAIN_ID;
	showTransactionSettlingToast(`${toastKey}_settle`, quoteTx.transactionHash, cId, toast);

	const [buyDelta, sellDelta] = await waitForBalancesAfterTrade(
		address,
		allowedTokens,
		buyToken,
		buyBalance,
		sellToken,
		sellBalance,
		quoteTx,
		provider,
	);
	showTransactionSuccessToast(
		toastKey,
		quoteTx.confirmations,
		quoteTx.transactionHash,
		sellToken,
		sellDelta,
		buyToken,
		buyDelta,
		cId,
		toast,
	);
	return true;
}

type ParametersProps = {
	symbol: string;
	token: string;
	allowedTokens: TokenSummaryInfoMap;
};

export function getTransactionParameters(
	amounts: [string, string],
	{ symbol, token, allowedTokens }: ParametersProps,
): SwapTransactionProps {
	const buy = safeFloat(amounts[0]);
	const sell = safeFloat(amounts[1]);
	let swapped = false;
	let valid = false;
	if (isNaN(buy) || isNaN(sell)) {
		throw new ValidationError(`isNAN ${JSON.stringify(amounts)}`);
	}

	let buyToken = symbol;
	let sellToken = token;
	let sellAmount = sell;
	let buyAmount = buy;
	let sellUnits = BIG_ZERO;
	let buyUnits = BIG_ZERO;

	if (sell === 0) {
		buyToken = token;
		sellToken = symbol;
		buyAmount = sell;
		sellAmount = buy;
		swapped = true;
	}

	const buyAddr = allowedTokens[buyToken]?.address || '';
	const sellAddr = allowedTokens[sellToken]?.address || '';
	valid = !!buyAddr && !!sellAddr && sellAmount > 0;
	if (valid) {
		buyUnits = unitsForSymbol(buyAmount, buyToken);
		sellUnits = unitsForSymbol(sellAmount, sellToken);
	}
	return {
		buyToken,
		buyAddr,
		buyAmount,
		buyUnits,
		sellToken,
		sellAddr,
		sellAmount,
		sellUnits,
		swapped,
		valid,
	};
}

export function readableBalance(
	symbol: string,
	balances: CoinBalances,
	loaded: boolean,
	loading: boolean,
): string {
	if (loading && !loaded) {
		return '(retreiving)';
	}
	if (!loaded) {
		return '--.----';
	}
	const val = balances[symbol];
	if (!val) {
		if (loading) {
			return '(retrieving)';
		}
		return '0.0000';
	}
	const formatted = formatUnits(val, decimalsOf(symbol));
	return safeFixed(formatted, 4);
}

const quoteErrorHandler = (toastKey: string, context: string, err: Error, toast: Toaster): null => {
	const code = getErrorCode(err);
	if (code === 4001) {
		showErrorToast(toastKey, { title: 'Cancelled', description: 'Cancelled' }, err, toast);
	} else {
		console.error(context, err);
		showErrorToast(toastKey, {}, err, toast);
	}
	return null;
};

export const sendQuote = async (
	quote: Record<string, any>,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<TransactionReceipt | null> => {
	const { address, provider } = wallet;
	const { toHex } = web3.utils;
	if (address && provider) {
		const signer = await provider.getSigner(0);

		const txCount = await provider.getTransactionCount(address);
		const tx: Record<string, any> = {
			nonce: toHex(txCount),
			from: address,
			value: toHex(quote.value),
			gasPrice: toHex(quote.gasPrice),
			to: quote.to,
			gasLimit: toHex(quote.gasLimit),
			data: quote.data,
			chainId: quote.chainId,
			type: quote.type,
			accessList: quote.accessList,
			maxPriorityFeePerGas: quote.maxPriorityFeePerGas,
			maxFeePerGas: quote.maxFeePerGas,
			customData: quote.customData,
		};
		// clean undefined
		Object.keys(tx).forEach((key) => {
			if (tx[key] === undefined) {
				delete tx[key];
			}
		});
		try {
			const sendTx = await signer.sendTransaction(tx);
			if (sendTx === null) {
				return null;
			}
			showTransactionSentToast(`sent_${txCount}`, sendTx.hash, wallet.chainId, toast);
			await provider.waitForTransaction(sendTx.hash);
			return provider.getTransactionReceipt(sendTx.hash);
		} catch (err) {
			return quoteErrorHandler(`send_${txCount}`, 'sendQuote', err as Error, toast);
		}
	}
	return null;
	/* showErrorToast('send_tx', { title: 'Error', description: 'Not connected' }, null, toast);
		return null;
	} */
};

async function checkApproval(
	params: SwapTransactionProps,
	allowanceTarget: string,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	if (!allowanceTarget || !wallet.isConnected) {
		return false;
	}

	const { sellToken, buyToken } = params;
	const toastKey = `approval_${sellToken}_${buyToken}`;
	try {
		return await isApproved(params, allowanceTarget, wallet);
	} catch (err) {
		console.error('getApprovals', err);
		showErrorToast(toastKey, {}, err, toast);
	}
	return false;
}

export async function getApproval(
	params: SwapTransactionProps,
	allowanceTarget: string,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	if (!allowanceTarget) {
		return false;
	}

	const { sellToken, buyToken } = params;
	const toastKey = `approval_${sellToken}_${buyToken}`;
	try {
		return await getRequiredApprovals(params, allowanceTarget, wallet, toast, APPROVAL_MESSAGES);
	} catch (err) {
		console.error('getApprovals Error', err);
		showErrorToast(toastKey, {}, err, toast);
	}
	return false;
}

type AmountCallback = (amounts: [string, string]) => void;
type ApprovedCallback = Dispatch<SetStateAction<boolean>>;
type AllowanceCallback = Dispatch<SetStateAction<string>>;

export async function updatePrices(
	chainId: string,
	params: SwapTransactionProps,
	setAmounts: AmountCallback,
	setApproved: ApprovedCallback,
	setAllowanceTarget: AllowanceCallback,
	toast: Toaster,
	wallet: WalletContextType,
): Promise<boolean> {
	const { address } = wallet;
	const { buyAddr, sellAddr, sellAmount, sellUnits, sellToken, buyToken } = params;
	const toastKey = `getprice_err_${params.buyToken}_${params.sellToken}`;
	try {
		const val = await getPrice(chainId, buyAddr, sellAddr, sellUnits, address || '');
		let errorDescription;
		if (val.validationErrors) {
			errorDescription = val.validationErrors[0]
				? val.validationErrors[0].reason
				: JSON.stringify(val.validationErrors);
		} else if (val.data && val.data.errors) {
			errorDescription = val.data.errors[0].msg;
		}
		if (errorDescription) {
			if (errorDescription === 'INSUFFICIENT_ASSET_LIQUIDITY') {
				errorDescription = isYieldFund(sellToken)
					? 'SW Yield Funds are only available to sell during the final 3 days of every calendar quarter.'
					: 'Insufficient liquidity at the moment. Please try again later.';
			}
			showErrorToast(
				toastKey,
				{ title: 'Error getting prices', description: errorDescription },
				{},
				toast,
			);
		} else if (!isNaN(val.price) && !isNaN(sellAmount)) {
			const buy = forceDecimalString(val.price * sellAmount, buyToken);
			const sell = forceDecimalString(sellAmount, sellToken);
			const updated: [string, string] = params.swapped ? [sell, buy] : [buy, sell];
			setAmounts(updated);
			console.log('getPrices', JSON.stringify(val));
			setAllowanceTarget(val.allowanceTarget);

			const approved = await checkApproval(params, val.allowanceTarget, wallet, toast);
			setApproved(approved);
			return true;
		}
	} catch (err) {
		console.error('general error updating prices', err);
		showErrorToast(toastKey, { title: 'Error getting prices' }, err, toast);
	}
	return false;
}
