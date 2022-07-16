import { Box, Flex, Icon } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';

import { breakpointState, periodState } from '../../../state';
import { SizedColumnStyles } from './types';

const DEFAULT_SORTS: Record<string, JSX.Element> = {
	name: <></>,
	ticker: <></>,
	price: <></>,
	change: <></>,
};

type TokenHeaderWrapperProps = {
	first?: boolean;
	sort?: string;
	onSort: (sort: string) => void;
	colStyles: SizedColumnStyles;
};

const overrides: Record<string, string> = {
	lineHeight: '1.5rem',
	height: '1.5rem',
};

export function TokenHeader({
	colStyles,
	first,
	sort,
	onSort,
}: TokenHeaderWrapperProps): JSX.Element {
	const [sorts, setSorts] = React.useState(DEFAULT_SORTS);
	const breakpoint = useRecoilValue(breakpointState);
	const styles = useMemo(() => {
		const s = { ...colStyles[breakpoint] };
		return {
			name: { ...s.name, ...overrides },
			ticker: { ...s.ticker, ...overrides },
			price: { ...s.price, ...overrides },
			change: { ...s.change, ...overrides },
			chart: { ...s.chart, ...overrides },
			action: { ...s.action, ...overrides, padding: '0' },
		};
	}, [colStyles, breakpoint]);

	const [props, firstProps, lastProps] = useMemo(() => {
		const p: Record<string, any> = {
			bgColor: 'blue5',
			textAlign: 'center',
		};
		const fP: Record<string, any> = { ...p };
		const lP: Record<string, any> = { ...p };
		if (first) {
			fP.borderRadius = '2em 0 0 0';
			lP.borderRadius = '0 2em 0 0';
		}

		return [p, fP, lP];
	}, [first]);

	useEffect(() => {
		const s: Record<string, JSX.Element> = { ...DEFAULT_SORTS };
		if (sort) {
			const reverse = sort.startsWith('-');
			const sortKey = reverse ? sort.slice(1) : sort;
			s[sortKey] = <Icon as={reverse ? FaSortUp : FaSortDown} ml="0.25rem" />;
		}
		setSorts(s);
	}, [sort]);
	const [periodVal, setPeriodState] = useRecoilState(periodState);

	// note - "nowrap" because this is only shown if the screen is large
	return (
		<Flex
			flexFlow="row nowrap"
			padding="0.5rem 0"
			mb="0.5rem"
			bgColor="blue5"
			color="purple"
			border="2px solid #120046"
			borderRadius="1em 1em 0 0"
		>
			<Box {...firstProps} {...styles.name} cursor="pointer" onClick={() => onSort('name')}>
				Name{sorts.name}
			</Box>
			<Box {...props} {...styles.ticker} cursor="pointer" onClick={() => onSort('ticker')}>
				Ticker{sorts.ticker}
			</Box>
			<Box {...props} {...styles.price} cursor="pointer" onClick={() => onSort('price')}>
				Price{sorts.price}
			</Box>
			<Box {...props} {...styles.change} cursor="pointer" onClick={() => onSort('change')}>
				{periodVal} Change{sorts.change}
			</Box>
			<Box {...props} {...styles.chart}>
				Chart
			</Box>
			<Box {...lastProps} {...styles.action}>
				Trade
			</Box>
		</Flex>
	);
}
