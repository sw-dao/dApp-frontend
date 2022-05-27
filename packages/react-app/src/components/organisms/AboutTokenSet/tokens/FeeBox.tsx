import { Box, Center, HStack, Heading, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { PRODUCTS_BY_SYMBOL } from '../../../../config/products';
import { ExtendedTokenDetails, TokenDetails } from '../../../../types';

type FeeBoxProps = {
	symbol: string;
	details: ExtendedTokenDetails | null | undefined;
	data: TokenDetails | null | undefined;
	[key: string]: any;
};

function addValues(
	label: string,
	value: any,
	formatted: string,
	labels: JSX.Element[],
	values: JSX.Element[],
) {
	const xtra: Record<string, string> = labels.length === 0 ? { mt: '1.5rem' } : {};
	if (value && !isNaN(value) && !value.toString().endsWith('nfinity')) {
		const k = `${value}_${label}`;
		labels.push(
			<Text key={k} className="tight" {...xtra}>
				{label}
			</Text>,
		);
		values.push(
			<Text key={k} className="tight" {...xtra}>
				{formatted}
			</Text>,
		);
	}
}

const commaFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

export default function FeeBox({ data, details, symbol, ...rest }: FeeBoxProps): JSX.Element {
	const prices = useMemo(() => data?.prices || [], [data]);
	const [marketCap, volume1Day, totalSupply] = useMemo(() => {
		if (!details) {
			return [0, 0, 0];
		}
		return [details.marketCap, details.volume1Day, details.totalSupply];
	}, [details]);

	const dollarPrices = prices.map((p) => parseFloat(p[1]));
	const openPrice = dollarPrices.length > 0 ? dollarPrices[0] : 0;
	const low = Math.min(...dollarPrices);
	const high = Math.max(...dollarPrices);

	const rawFee = PRODUCTS_BY_SYMBOL[symbol]?.yearly_fee ?? '';
	const [perf, management] = useMemo(() => {
		if (!rawFee) {
			return ['0', '0'];
		}
		const parts = rawFee.trim().split(' ');
		if (parts[parts.length - 1] === 'performance') {
			return [parts[0], '0'];
		}
		return ['0', parts[0]];
	}, [rawFee]);

	const labels: JSX.Element[] = [];
	const values: JSX.Element[] = [];
	addValues('Market Cap', marketCap, currencyFormatter.format(marketCap || 0), labels, values);
	addValues('Total Supply', totalSupply, commaFormatter.format(totalSupply || 0), labels, values);
	addValues('Low', low, currencyFormatter.format(low || 0), labels, values);
	addValues('High', high, currencyFormatter.format(high || 0), labels, values);
	addValues('Open Price', openPrice, currencyFormatter.format(openPrice || 0), labels, values);
	addValues('Volume', volume1Day, currencyFormatter.format(volume1Day || 0), labels, values);

	return (
		<Box {...rest}>
			<Heading>Fees</Heading>
			<Center>
				<HStack>
					<Box width="8rem" maxWidth="8rem" minWidth="8rem" color="white">
						<Text className="tight">Performance Fee</Text>
						<Text className="tight">Management Fee</Text>
						{labels}
					</Box>
					<Box pl="0.5rem" borderLeft="1px solid #AADCFE" color="#AADCFE">
						<Text className="tight">{perf}%</Text>
						<Text className="tight">{management}%</Text>
						{values}
					</Box>
				</HStack>
			</Center>
		</Box>
	);
}
