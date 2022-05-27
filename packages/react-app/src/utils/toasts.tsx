import { Box, Text, UseToastOptions } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo, useState } from 'react';

import { TransactionDescription } from '../components/atoms/TransactionDescription';
import {
	DEFAULT_CHAIN_ID,
	TOAST_TIMEOUT_ALERT,
	TOAST_TIMEOUT_INFO,
	TOAST_TIMEOUT_STICKY,
} from '../config';
import { getErrorMessage } from '../Errors';
import { decimalsOf, safeFixed } from './contracts';

type Toaster = any;

export function showErrorToast(
	toastKey: string,
	params: UseToastOptions,
	error: unknown,
	toast: Toaster,
): Toaster | null {
	const { title = 'Error' } = params;

	let description = params.description;
	if (!description) {
		description = getErrorMessage(error);
		if (`${description}`.length > 100) {
			console.warn('Error message is too long', description);
			description = 'General error';
		}
	}
	if (!description) {
		description = 'General error';
	}

	toast.closeAll();
	return showToast(
		toastKey,
		{
			status: 'error',
			duration: TOAST_TIMEOUT_ALERT,
			description,
			...params,
			title,
		},
		toast,
	);
}

export function showSuccessToast(
	toastKey: string,
	params: UseToastOptions,
	toast: Toaster,
): Toaster | null {
	const { title = 'Success', description = 'Success' } = params;
	return showToast(
		toastKey,
		{
			status: 'success',
			duration: TOAST_TIMEOUT_INFO,
			...params,
			title,
			description,
		},
		toast,
	);
}

export function showToast(
	toastKey: string,
	params: UseToastOptions,
	toast: Toaster,
): Toaster | null {
	const {
		title,
		description,
		status = 'info',
		position = 'top',
		isClosable = true,
		duration = status === 'info' ? TOAST_TIMEOUT_INFO : TOAST_TIMEOUT_ALERT,
		...rest
	} = params;
	if (!toast.isActive(toastKey)) {
		return toast({
			id: toastKey,
			title,
			description,
			position,
			status,
			isClosable,
			duration,
			...rest,
		});
	}
	return null;
}

const BIG_ZERO = BigNumber.from('0');

interface LabelledAmountProps {
	symbol: string;
	amount: BigNumber;
}

function LabelledAmount({ symbol, amount }: LabelledAmountProps): JSX.Element {
	const [full, setFull] = useState(false);
	const handleToggle = useCallback(() => {
		setFull(!full);
	}, [full]);

	const val = useMemo(() => {
		const v = formatUnits(amount, decimalsOf(symbol));
		if (!full) {
			return safeFixed(v, 4);
		}
		return v;
	}, [amount, full, symbol]);

	if (amount.eq(BIG_ZERO)) {
		return <Text as="span">{symbol}</Text>;
	}

	return (
		<Text as="span" cursor="zoom-in" onClick={handleToggle}>
			{val} {symbol}
		</Text>
	);
}

export function showTransactionApprovalToast(needed: number, toast: Toaster): Toaster | null {
	const toastLabel = needed === 1 ? 'Approve token' : `Approve ${needed} tokens`;
	toast.closeAll();
	return showToast(
		'approve-tokens',
		{
			title: 'Step 1 of 2',
			description: `${toastLabel} in your wallet.`,
			duration: TOAST_TIMEOUT_STICKY,
		},
		toast,
	);
}

export function showTransactionSendingToast(toastKey: string, toast: Toaster): Toaster | null {
	return showToast(
		toastKey,
		{
			title: 'Sending Trade',
			description: 'Please confirm in your wallet.',
			duration: TOAST_TIMEOUT_STICKY,
		},
		toast,
	);
}

export function showTransactionSentToast(
	toastKey: string,
	txHash: string,
	chainId: string | undefined | null,
	toast: Toaster,
): Toaster | null {
	const description = (
		<TransactionDescription
			message="Trade sent to be executed."
			tx={txHash}
			chainId={chainId || DEFAULT_CHAIN_ID}
		/>
	);
	toast.closeAll();
	return showToast(
		toastKey,
		{
			title: 'Sent Transaction',
			description,
			duration: TOAST_TIMEOUT_STICKY,
		},
		toast,
	);
}

export function showTransactionSuccessToast(
	toastKey: string,
	confirmations: number,
	txHash: string,
	buyToken: string,
	buyDelta: BigNumber,
	sellToken: string,
	sellDelta: BigNumber,
	chainId: string,
	toast: Toaster,
	sellIsToken = true,
): Toaster | null {
	toast.closeAll();

	const buySymbol = buyToken.toUpperCase();
	const sellSymbol = sellIsToken ? sellToken.toUpperCase() : sellToken;
	const plural = confirmations !== 1 ? 's' : '';
	const message = (
		<Box>
			Traded&nbsp;
			<LabelledAmount symbol={buySymbol} amount={buyDelta} />
			{sellIsToken && <span>&nbsp;for</span>}
			&nbsp;
			<LabelledAmount symbol={sellSymbol} amount={sellDelta} />
			&nbsp;with {confirmations} confirmation{plural}.
		</Box>
	);

	const description = <TransactionDescription message={message} tx={txHash} chainId={chainId} />;
	return showToast(
		toastKey,
		{
			status: 'success',
			title: 'Trade Success',
			description,
			duration: TOAST_TIMEOUT_STICKY,
		},
		toast,
	);
}

export function showTransactionSettlingToast(
	toastKey: string,
	quoteTx: string,
	chainId: string,
	toast: Toaster,
): Toaster | null {
	toast.closeAll();
	const description = (
		<TransactionDescription
			message="Waiting for confirmation that trade has settled."
			tx={quoteTx}
			chainId={chainId}
		/>
	);
	return showToast(
		toastKey,
		{
			status: 'info',
			title: 'Confirming Trade',
			description,
			duration: TOAST_TIMEOUT_STICKY,
		},
		toast,
	);
}
