import { Stack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { isTokenset } from '../../config/products';
import { allSwappableTokensState, breakpointState } from '../../state';
import { BuyTokenForm } from '../molecules/BuyTokenForm';
import { IssueRedeemForm } from '../molecules/IssueRedeemForm';
import { TokenChart } from '../molecules/TokenChart';

interface ChartAndBuyProps {
	symbol: string;
	handleDateChange: (date: string) => void;
	period: string;
}

const WIDTHS: Record<string, [number, number | string, string, boolean]> = {
	sm: [100, 100, '1rem', false],
	md: [100, 100, '1rem', false],
	lg: [100, '30rem', '0', true],
	xl: [100, '30rem', '0', true],
};

export function ChartAndBuy(props: ChartAndBuyProps): JSX.Element {
	const { symbol, period, handleDateChange } = props;

	const swappable = useRecoilValue(allSwappableTokensState);
	const breakpoint = useRecoilValue(breakpointState);

	const TokenForm = useMemo(() => (isTokenset(symbol) ? IssueRedeemForm : BuyTokenForm), [symbol]);
	const allowedTokens = useMemo(
		() => ({ ...swappable.ERC20, ...swappable.TokenProducts }),
		[swappable],
	);

	const [width, formWidth, formMargin, singleLine] = useMemo(
		() => WIDTHS[breakpoint],
		[breakpoint],
	);

	return (
		<Stack
			direction={singleLine ? 'row' : 'column'}
			width="100%"
			className={singleLine ? 'singleline' : 'multiline'}
			alignItems="flex-start"
			justifyContent="space-between"
			spacing="1rem"
		>
			<TokenChart
				symbol={symbol}
				onDateChange={handleDateChange}
				period={period}
				size={[width, 500]}
			/>
			<TokenForm
				breakpoint={breakpoint}
				width={formWidth}
				id="TokenForm"
				symbol={symbol}
				allowedTokens={allowedTokens}
				marginTop={formMargin}
			/>
		</Stack>
	);
}
