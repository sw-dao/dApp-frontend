import { Box } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { isLargeBreakpoint } from '../../../state';
import { ExtendedTokenDetailsMap, TokenDetails } from '../../../types';
import { getOverriddenDetails } from '../../../utils';
import PriceTableRow from './PriceTableRow';
import { TokenHeader } from './TokenHeader';
import { DEFAULT_COL_STYLES, SizedColumnStyles } from './types';

interface TokenPriceTableProps {
	children?: JSX.Element;
	loading: boolean;
	onSort: (sort: string) => void;
	period: string;
	priceDetails: Array<TokenDetails>;
	sort: string;
	colStyles?: SizedColumnStyles;
	tokenDetails: ExtendedTokenDetailsMap;
	width?: string;
}

function getChange(d: TokenDetails, tokenDetails: ExtendedTokenDetailsMap): number {
	// const details = tokenDetails[d.symbol]
	if (tokenDetails[d.symbol] && d.prices.length > 0) {
		const curp = getPrice(d, tokenDetails);
		const cP = curp;
		const p = parseFloat(d.prices[0][1]);
		return ((cP - p) / p) * 100 || 0;
	}
	return 0;

	// return tokenDetails[d.symbol]?.changePercent1Day || 0;
}

function getPrice(d: TokenDetails, tokenDetails: ExtendedTokenDetailsMap): number {
	return tokenDetails[d.symbol]?.currentPrice || 0;
}

export function TokenPriceTable(props: TokenPriceTableProps): JSX.Element {
	const {
		children,
		onSort,
		period,
		priceDetails,
		sort,
		tokenDetails,
		colStyles = { ...DEFAULT_COL_STYLES },
	} = props;

	const isLarge = useRecoilValue(isLargeBreakpoint);

	const sortFn = useCallback(
		(a: TokenDetails, b: TokenDetails): number => {
			const reverse = sort.startsWith('-');
			const sortKey = reverse ? sort.slice(1) : sort;
			let result = 0;
			switch (sortKey) {
				case 'name':
					const aOverrides = getOverriddenDetails(a.symbol);
					const bOverrides = getOverriddenDetails(b.symbol);
					const aName = aOverrides.name || a.symbol;
					const bName = bOverrides.name || b.symbol;
					result = aName.localeCompare(bName);
					break;
				case 'ticker':
					result = a.symbol.localeCompare(b.symbol);
					break;
				case 'price':
					result = getPrice(a, tokenDetails) - getPrice(b, tokenDetails);
					break;
				case 'change':
					result = getChange(a, tokenDetails) - getChange(b, tokenDetails);
					break;
			}
			if (reverse) {
				result = -result;
			}
			return result;
		},
		[sort, tokenDetails],
	);

	const rows: JSX.Element | JSX.Element[] = useMemo(() => {
		if (priceDetails && priceDetails.length === 0) {
			return (
				<Box textAlign="center" color="bodytext">
					No data available
				</Box>
			);
		} else {
			const lastIx = priceDetails.length - 1;
			if (sort) {
				priceDetails.sort(sortFn);
			}
			// console.log('getting rows - styles', JSON.stringify(colStyles.lg, null, 2));
			return priceDetails.map((row, ix) => (
				<PriceTableRow
					key={ix}
					row={row}
					period={period}
					prices={row.prices}
					last={ix === lastIx}
					colStyles={colStyles}
					tokenDetails={tokenDetails}
				/>
			));
		}
	}, [priceDetails, sort, sortFn, period, colStyles, tokenDetails]);

	const handleSort = useCallback(
		(s: string) => {
			if (sort === s) {
				onSort(`-${s}`);
			} else {
				onSort(s);
			}
		},
		[onSort, sort],
	);

	const borderRadius = useMemo(() => (isLarge ? '2em 2em 0 0' : '2em'), [isLarge]);

	return (
		<Box width="100%">
			{children && (
				<Box bgColor="bodydark" borderRadius={borderRadius}>
					{children}
				</Box>
			)}
			{isLarge && (
				<TokenHeader colStyles={colStyles} first={!children} onSort={handleSort} sort={sort} />
			)}
			<Box
				bgColor="transparent"
				border="2px solid #120046"
				borderRadius="0 0 2em 2em"
				borderTop="0"
			>
				{rows}
			</Box>
		</Box>
	);
}
