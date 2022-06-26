import { Box, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { utils } from 'ethers';
import { A } from 'hookrouter';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { PRODUCTS } from '../../config/products';
import { breakpointState } from '../../state';

import { PortfolioTokenDetails } from '../../types';
import { getTokenUrl } from '../../utils';
import { commify, safeFixed } from '../../utils/contracts';
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
	const breakpoint = useRecoilValue(breakpointState);
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
	if (breakpoint !== 'sm') {
		return (
			<Tr {...props}>
				<Td>
					<CoinLabelCell icon={icon} symbol={row.symbol} name={name} url={productUrl} />
				</Td>
				<Td>
					<A href={productUrl}>
						<Text className="symbol">{row.symbol.toUpperCase()}</Text>
					</A>
				</Td>
				<Td>{commify(safeFixed(row.amount, 4))}</Td>
				<Td>${commify(safeFixed(row.price, 2))}</Td>
				<Td>${commify(safeFixed(row.total, 2))}</Td>
			</Tr>
		);
	}
	return (
		<Tr {...props}>
			<Th>
				<Text bgColor="lightline" textAlign="center">
					Symbol
				</Text>
				<A href={productUrl}>
					<Text fontWeight="normal" className="symbol" textAlign="center">
						{row.symbol.toUpperCase()}
					</Text>
				</A>
				<Text bgColor="lightline" textAlign="center">
					Price
				</Text>
				<Text fontWeight="normal" textAlign="center">
					${commify(safeFixed(row.price, 2))}
				</Text>
			</Th>
			<Th>
				<Text bgColor="lightline" textAlign="center">
					Amount
				</Text>
				<Text fontWeight="normal" textAlign="center">
					{commify(safeFixed(row.amount, 4))}
				</Text>
				<Text bgColor="lightline" textAlign="center">
					Total
				</Text>
				<Text fontWeight="normal" textAlign="center">
					${commify(safeFixed(row.total, 2))}
				</Text>
			</Th>
		</Tr>
	);
}

{
	/* <Tr {...props}>
			<Th>
				<Text bgColor="lightline" textAlign="left">
					Symbol:
				</Text>
				<Text bgColor="lightline" textAlign="left">
					Amount:
				</Text>
				<Text bgColor="lightline" textAlign="left">
					Price:
				</Text>
				<Text bgColor="lightline" textAlign="left">
					Total:
				</Text>
			</Th>
			<Th>
				<A href={productUrl}>
					<Text className="symbol" textAlign="left">
						{row.symbol.toUpperCase()}
					</Text>
				</A>
				<Text textAlign="left">{commify(safeFixed(row.amount, 4))}</Text>
				<Text textAlign="left">${commify(safeFixed(row.price, 2))}</Text>

				<Text textAlign="left">${commify(safeFixed(row.total, 2))}</Text>
			</Th>
		</Tr> */
}

interface ThProps {
	borderRadius?: string;
	border?: string;
}

function TokenHeader({ first = true }) {
	const breakpoint = useRecoilValue(breakpointState);
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
	if (breakpoint !== 'sm') {
		return (
			<Tr>
				<Th bgColor="lightline">Name</Th>

				<Th bgColor="lightline">Ticker</Th>
				<Th bgColor="lightline">Amount</Th>
				<Th bgColor="lightline">Price</Th>
				<Th bgColor="lightline">Total</Th>
			</Tr>
		);
	}
	return <Tr></Tr>;
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
