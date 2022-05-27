import { Text, TextProps, Tooltip } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { safeFixed } from '../../utils/contracts';

type DNProps = Omit<TextProps, 'children'> & {
	value: string;
	hideSymbol?: boolean;
	symbol: string;
	precision?: number;
};

export default function DisplayNumber(props: DNProps): JSX.Element {
	const { value, hideSymbol, symbol, precision = 3, ...rest } = props;
	const formatted = useMemo(() => {
		const p = parseFloat(value);
		const fmt = isNaN(p) ? '0.000' : safeFixed(p, precision);
		return hideSymbol ? fmt : `${fmt} ${symbol}`;
	}, [value, hideSymbol, symbol, precision]);

	return (
		<Tooltip label={`${value} ${symbol}`}>
			<Text {...rest}>{formatted}</Text>
		</Tooltip>
	);
}
