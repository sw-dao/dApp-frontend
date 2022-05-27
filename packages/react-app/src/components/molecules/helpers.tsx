import { UseToastOptions } from '@chakra-ui/react';
import { formatUnits } from 'ethers/lib/utils';

import { CoinBalances, Toaster } from '../../types';
import { decimalsOf, isNative } from '../../utils/contracts';
import { multiplyBignumberByFloat } from '../../utils/numbers';
import { showToast } from '../../utils/toasts';

export function handleMaxAndNotify(
	symbol: string,
	balances: CoinBalances,
	onAmountChange: (value: string) => void,
	toast: Toaster,
): boolean {
	let val = balances[symbol];
	if (!val || val.eq(0)) {
		return false;
	}
	const toastParams: UseToastOptions = {
		title: `Getting quote for maximum ${symbol}`,
		variant: 'subtle',
	};

	if (isNative(symbol)) {
		val = multiplyBignumberByFloat(val, 0.9999);
		toastParams.description = 'Using slightly less than maximum, to save enough for gas fees.';
	}
	showToast('select-max', toastParams, toast);
	onAmountChange(formatUnits(val, decimalsOf(symbol)));
	return true;
}
