import { Box, Image, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

import { getTokenUrl, timestampSorter } from '../../utils';
import { safeFixed } from '../../utils/contracts';
import { EtherscanLink } from '../atoms/EtherscanLink';

const formatDate = (timestamp: string): string => {
	const ts = parseInt(timestamp, 10) * 1000;
	const date = new Date(ts);
	return date.toLocaleDateString();
};

interface RowProps {
	symbol: string;
	txId: string;
	to: string;
	from: string;
	timestamp: string;
	amount: number;
	icon: string;
}

interface TableRowProps {
	row: RowProps;
	last: boolean;
}

interface TrProps {
	color: string;
	borderBottom?: string;
}

function TableRow({ row, last }: TableRowProps): JSX.Element {
	const props: TrProps = {
		color: '#fff',
	};
	if (!last) {
		props.borderBottom = '2px solid #120046';
	}
	const icon = row.icon || getTokenUrl(row.symbol)[0];
	return (
		<Tr {...props}>
			<Td>{formatDate(row.timestamp)}</Td>
			<Td>
				<EtherscanLink tx={row.txId} />
			</Td>
			<Td>
				<EtherscanLink address={row.to} />
			</Td>
			<Td>
				<EtherscanLink address={row.from} />
			</Td>
			<Td>
				<Image
					d="inline-block"
					h="1.8rem"
					pr=".5rem"
					fontSize="0.9rem"
					align="left center"
					src={icon}
					alt={`${row.symbol} logo`}
				/>
				{safeFixed(row.amount, 8)} {row.symbol}
			</Td>
		</Tr>
	);
}

interface ThProps {
	borderRadius?: string;
	border?: string;
}

function TokenHeader({ first = true }): JSX.Element {
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
				Date
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				Transaction
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				To
			</Th>
			<Th bgColor="lightline" {...middleProps}>
				From
			</Th>
			<Th bgColor="lightline" {...lastProps}>
				Value
			</Th>
		</Tr>
	);
}

interface TransactionsTableProps {
	transactions: RowProps[];
	loading: boolean;
	first?: boolean;
}

export function TransactionsTable(props: TransactionsTableProps): JSX.Element {
	const { transactions, loading, first = true } = props;
	let rows;

	if (loading) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Spinner size="lg" margin="2rem auto" />
				</Td>
			</Tr>
		);
	} else if (!transactions || transactions.length === 0) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text fontStyle="italic" p="2rem">
						No transactions found
					</Text>
				</Td>
			</Tr>
		);
	} else {
		const lastIx = transactions.length - 1;
		transactions.sort((a, b) => timestampSorter(b.timestamp, a.timestamp));
		rows = transactions.map((row, ix) => <TableRow key={ix} row={row} last={ix === lastIx} />);
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
