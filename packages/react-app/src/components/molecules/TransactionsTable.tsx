import { Box, Image, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { A } from 'hookrouter';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { breakpointState } from '../../state';

import { getTokenUrl, timestampSorter } from '../../utils';
import { safeFixed } from '../../utils/contracts';
import { EtherscanLink } from '../atoms/EtherscanLink';

const formatDate = (timestamp: string): string => {
	const ts = parseInt(timestamp, 10) * 1000;
	const date = new Date(ts);
	return date.toLocaleDateString();
};

interface RowProps {
	timestamp: string | number;
	fromSymbol: string;
	fromAmount: number;
	toSymbol: string;
	toAmount: number;
	transactionHash: string;
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
	const breakpoint = useRecoilValue(breakpointState);

	const props: TrProps = {
		color: '#fff',
	};
	if (!last) {
		props.borderBottom = '2px solid #120046';
	}
	const icon = getTokenUrl(row.toSymbol)[0];
	const url = `https://polygonscan.com/tx/` + row.transactionHash;
	let t = '';
	let action = '';
	let tIcon = '';
	if (row.fromAmount > 0 && row.toAmount > 0) {
		t = 'Exchange';
		tIcon = '/images/portfolio/exchange-circle.png';
		action = `${safeFixed(row.fromAmount, 4)} ${row.fromSymbol} for ${safeFixed(row.toAmount, 4)} ${
			row.toSymbol
		} `;
	}
	if (row.fromSymbol === 'SWX') {
		t = 'Bond Issuance';
		tIcon = '/images/portfolio/plus-circle.png';
		action = `Deposited ${safeFixed(row.fromAmount, 4)} ${row.fromSymbol}`;
	}
	if (t === '' && row.fromAmount > 0 && row.toAmount <= 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/send.png';
		action = `Sent ${safeFixed(row.fromAmount, 4)} ${row.fromSymbol}`;
	}
	if (t === '' && row.fromAmount <= 0 && row.toAmount > 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/recieve.png';
		action = `Recieved ${safeFixed(row.toAmount, 4)} ${row.toSymbol}`;
	}
	return (
		<Tr {...props}>
			<Td>
				<Text as="span">{formatDate(row.timestamp.toString())}</Text>
			</Td>

			{breakpoint !== 'sm' && (
				<Td>
					{tIcon != '' ? (
						<Image
							d="inline-block"
							maxh="1.5rem"
							maxW="1.5rem"
							// pr=".5rem"
							fontSize="0.3rem"
							align="left center"
							src={tIcon}
							alt={`${t} Icon`}
						/>
					) : (
						''
					)}
				</Td>
			)}
			{breakpoint !== 'sm' && <Td>{t}</Td>}
			<Td>{action}</Td>

			<Td>
				<a color={'#2089fd'} href={url} target="_blank">
					<Image
						d="inline-block"
						maxh="1.5rem"
						maxW="1.5rem"
						// pr=".5rem"
						fontSize="0.3rem"
						align="left center"
						src="/images/portfolio/link-bold.png"
						alt={`Tx-link Icon`}
					/>
				</a>
			</Td>
		</Tr>
	);
}

interface ThProps {
	borderRadius?: string;
	border?: string;
}

function TokenHeader({ first = true }): JSX.Element {
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
				<Th bgColor="lightline" {...firstProps}>
					Date
				</Th>

				<Th bgColor="lightline" {...middleProps}>
					{' '}
				</Th>

				<Th bgColor="lightline" {...middleProps}>
					Type
				</Th>

				<Th bgColor="lightline" {...middleProps}>
					Action
				</Th>

				<Th bgColor="lightline" {...lastProps}>
					{' '}
				</Th>
			</Tr>
		);
	}
	return <Tr></Tr>;
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
		transactions.sort((a, b) => timestampSorter(b.timestamp.toString(), a.timestamp.toString()));
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
