import { Box, Center, Flex, Tooltip } from '@chakra-ui/react';
import { navigate } from 'hookrouter';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { breakpointState, isLargeBreakpoint } from '../../../state';
import { ChartData, ExtendedTokenDetailsMap, TokenDetails } from '../../../types';
import { getTokenName, getTokenUrl } from '../../../utils';
import { ButtonLink } from '../../atoms/ButtonLink';
import { ChangeDisplay } from '../../atoms/ChangeDisplay';
import { CoinLabelCell } from '../../atoms/CoinLabelCell';
import { TokenSparkline } from '../../atoms/TokenSparkline';
import { SizedColumnStyles } from './types';

interface TableRowProps {
	row: TokenDetails;
	last: boolean;
	prices: ChartData;
	colStyles: SizedColumnStyles;
	period: string;
	tokenDetails: ExtendedTokenDetailsMap;
}

type RowProps = Record<string, string>;

export default function PriceTableRow({
	tokenDetails,
	row,
	last,
	prices,
	period,
	colStyles,
}: TableRowProps): JSX.Element {
	const symbol = useMemo(() => row?.symbol?.toUpperCase() || '???', [row]);
	const isLarge = useRecoilValue(isLargeBreakpoint);
	const breakpoint = useRecoilValue(breakpointState);

	const styles = useMemo(() => ({ ...colStyles[breakpoint] }), [colStyles, breakpoint]);

	const boxProps: RowProps = useMemo(() => {
		const p: RowProps = {
			color: '#fff',
		};
		if (!last) {
			p.borderBottom = '2px solid #120046';
		}
		if (!isLarge) {
			p.bgColor = 'blue5';
			p.borderRadius = '2em';
			p.padding = '1rem';
			p.marginBottom = '1rem';
		}
		return p;
	}, [isLarge, last]);

	const details = useMemo(() => tokenDetails[symbol], [tokenDetails, symbol]);
	const currentPrice: string = useMemo(() => {
		let price = tokenDetails[symbol]?.currentPrice;
		if (!price && row.prices.length > 0) {
			price = parseFloat(row.prices[row.prices.length - 1][1]);
		}
		return price ? price.toFixed(2) : '0.0';
	}, [row.prices, symbol, tokenDetails]);

	const { name, icon, productUrl } = useMemo(() => {
		const rv = {
			name: getTokenName(symbol),
			icon: getTokenUrl(symbol)[0],
			productUrl: symbol === 'SWD' ? '/token' : `/product/${symbol}`,
		};
		return rv;
	}, [symbol]);

	const change = useMemo(() => {
		if (prices.length > 0) {
			const cP = parseInt(currentPrice);
			const p = parseInt(prices[0][1]);
			return ((cP - p) / p) * 100;
		}
		return row?.changePercent1Day || details?.changePercent1Day || 0;
	}, [details, row]);

	const wrap = useMemo(() => (isLarge ? 'nowrap' : 'wrap'), [isLarge]);

	// correct the box 'width' prop to use 'px' - not needed for SVG.
	const chartStyles = useMemo(() => {
		const s = { ...styles.chart };
		if (s.width && !s.width.endsWith('px') && !s.width.endsWith('%')) {
			s.width = `${s.width}px`;
		}
		return s;
	}, [styles.chart]);

	const ChangeWrapper = useMemo(() => (isLarge ? Center : Box), [isLarge]);

	const noData = useMemo(
		() =>
			breakpoint === 'sm' || breakpoint === 'md' ? <></> : <Tooltip label="no data">---</Tooltip>,
		[breakpoint],
	);

	return (
		<Flex
			flexDirection="row"
			flexWrap={wrap}
			{...boxProps}
			cursor="pointer"
			onClick={() => navigate(productUrl)}
		>
			<CoinLabelCell
				icon={icon}
				symbol={row.symbol}
				name={name || row.symbol || ''}
				url={productUrl}
				{...styles.name}
				linkCell
				hideSymbol
			/>
			<Box textAlign="center" color="#2089fd" {...styles.ticker}>
				{row.symbol}
			</Box>
			<Box textAlign="center" {...styles.price}>
				{row.isFake ? noData : `$${currentPrice}`}
			</Box>
			<Box {...styles.change}>
				<ChangeWrapper>{row.isFake ? noData : <ChangeDisplay change={change} />}</ChangeWrapper>
			</Box>
			<Box p="0" {...chartStyles}>
				{prices ? (
					<TokenSparkline
						period={period}
						prices={prices}
						width="100%"
						height={50}
						symbol={row.symbol || ''}
					/>
				) : null}
			</Box>
			{!styles.action.disabled && (
				<Box {...styles.action} verticalAlign="middle">
					<ButtonLink
						variant="primary"
						href={productUrl}
						align="center"
						padding="0.2rem"
						fontSize="0.8rem"
					>
						Buy
					</ButtonLink>
				</Box>
			)}
		</Flex>
	);
}
