import { Box, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { utils } from 'ethers';
import { A } from 'hookrouter';
import React from 'react';
import { PRODUCTS } from '../../config/products';

import { PortfolioTokenDetails } from '../../types';
import { getTokenUrl } from '../../utils';
import { safeFixed } from '../../utils/contracts';
import { CoinLabelCell } from '../atoms/CoinLabelCell';

interface HoldingsRow {
	row: PortfolioTokenDetails;
	index: number;
	last: boolean;
}

interface TrProps {
	color: string;
	borderBottom?: string;
	borderRadius?: string;
}

function TableRow({ row, last }: HoldingsRow): JSX.Element {
	const productUrl = `/product/${row.symbol}`;
	//console.log(`ROW ${index}: ${JSON.stringify(row)}`);
	const props: TrProps = {
		color: '#fff',
	};
	if (!last) {
		props.borderBottom = '2px solid #120046';
	}
	const icon = row.icon || getTokenUrl(row.symbol)[0];
	let name = '';
	PRODUCTS.forEach((e) => {
		if (e.symbol == row.symbol) name = e.name;
	});
	return (
		<Tr {...props}>
			<CoinLabelCell icon={icon} symbol={row.symbol} name={name} url={productUrl} />
			<Td>
				<A href={productUrl}>
					<Text className="symbol">{row.symbol.toUpperCase()}</Text>
				</A>
			</Td>
			<Td>{utils.commify(safeFixed(row.amount, 4))}</Td>
			<Td>${utils.commify(safeFixed(row.price, 2))}</Td>
			<Td>${utils.commify(safeFixed(row.total, 2))}</Td>
		</Tr>
	);
}

interface ThProps {
	borderRadius?: string;
	border?: string;
}

function TokenHeader({ first = true }) {
	const firstProps: ThProps = {};
	const lastProps: ThProps = {};
	const middleProps: ThProps = {};
	if (first) {
		firstProps.borderRadius = '2em 0 0 0';
		lastProps.borderRadius = '0 2em 0 0';
	} else {
		firstProps.border = '2px solid #120046';
		lastProps.border = '2px solid #120046';
		middleProps.border = '2px solid #120046';
	}
	return (
		<Tr>
			<Th bgColor="lightline" {...firstProps}>
				Name
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				Ticker
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				Amount
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				Price
			</Th>
			<Th bgColor="lightline" {...lastProps}>
				Total
			</Th>
		</Tr>
	);
}

interface HoldingsTableProps {
	holdings: PortfolioTokenDetails[];
	loading: boolean;
	first?: boolean;
}

export function HoldingsTable(props: HoldingsTableProps): JSX.Element {
	const { holdings, loading, first = true } = props;
	let rows;

	if (loading) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Spinner size="lg" margin="2rem auto" />
				</Td>
			</Tr>
		);
	} else if (!holdings || holdings.length === 0) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text fontStyle="italic" p="2rem">
						No holdings
					</Text>
				</Td>
			</Tr>
		);
	} else {
		const lastIx = holdings.length - 1;
		rows = holdings.map((row, ix) => (
			<TableRow key={ix} row={row} index={ix} last={ix === lastIx} />
		));
	}

	return (
		<Box border="2px solid #120046" borderRadius="0 0 2rem 2rem" width="100%" mt="-1px">
			<Table variant="unstyled" bgColor="transparent" className="token">
				<Thead color="tableheader">
					<TokenHeader first={first} />
				</Thead>
				<Tbody bgColor="transparent">{rows}</Tbody>
			</Table>
		</Box>
	);
}
