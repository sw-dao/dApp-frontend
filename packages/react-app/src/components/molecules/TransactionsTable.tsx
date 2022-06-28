import {
	Box,
	Button,
	Image,
	Spinner,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { A } from 'hookrouter';
import { isString } from 'lodash';
import { type } from 'os';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { breakpointState } from '../../state';

import { getTokenUrl, timestampSorter } from '../../utils';
import { safeFixed } from '../../utils/contracts';
import { ButtonLink } from '../atoms/ButtonLink';
import { EtherscanLink } from '../atoms/EtherscanLink';
import { usePagination } from './Pagination/usePagination';

const formatDate = (timestamp: string): string => {
	const ts = parseInt(timestamp, 10) * 1000;
	const date = new Date(ts);
	return date.toLocaleDateString();
};

const formatNumber = (n: number | string): string => {
	if (isString(n)) {
		return parseFloat(n).toLocaleString(undefined, {
			minimumSignificantDigits: 2,
			maximumSignificantDigits: 6,
		});
	} else {
		return n.toLocaleString(undefined, {
			minimumSignificantDigits: 2,
			maximumSignificantDigits: 6,
		});
	}
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
		action = `${formatNumber(row.fromAmount)} ${row.fromSymbol} for ${formatNumber(row.toAmount)} ${
			row.toSymbol
		} `;
	}
	if (row.fromSymbol === 'SWX') {
		t = 'Bond Issuance';
		tIcon = '/images/portfolio/plus-circle.png';
		action = `Deposited ${formatNumber(row.fromAmount)} ${row.fromSymbol}`;
	}
	if (t === '' && row.fromAmount > 0 && row.toAmount <= 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/send.png';
		action = `Sent ${formatNumber(row.fromAmount)} ${row.fromSymbol}`;
	}
	if (t === '' && row.fromAmount <= 0 && row.toAmount > 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/recieve.png';
		action = `Recieved ${formatNumber(row.toAmount)} ${row.toSymbol}`;
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
	transactions: RowProps[] | undefined;
	loading: boolean;
	first?: boolean;
}

export function TransactionsTable(props: TransactionsTableProps): JSX.Element {
	const { transactions, loading, first = true } = props;
	let rows;
	const {
		currentPage,
		totalPages,
		setNextPage,
		setPreviousPage,
		nextEnabled,
		previousEnabled,
		startIndex,
		endIndex,
	} = usePagination({
		totalItems: transactions?.length,
		initialPageSize: 10,
	});

	if (loading) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					Please connect your wallet
				</Td>
			</Tr>
		);
	} else if (!transactions) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text fontStyle="italic" p="2rem 2rem 0 2rem">
						Loading your wallet history ...
					</Text>
					<Spinner size="lg" margin="2rem auto" />
				</Td>
			</Tr>
		);
	} else if (transactions.length === 0) {
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
		// rows = transactions.map((row, ix) => <TableRow key={ix} row={row} last={ix === lastIx} />);

		rows = transactions
			.slice(startIndex, endIndex + 1)
			.map((row, ix) => <TableRow key={ix} row={row} last={ix === lastIx} />);
	}

	return (
		<Box border="2px solid #120046" borderRadius="0 0 2rem 2rem" width="100%" mt="-1px">
			<Table variant="unstyled" bgColor="transparent" className="token">
				<Thead color="tableheader">
					<TokenHeader first={first} />
				</Thead>
				<Tbody bgColor="transparent">{rows}</Tbody>
			</Table>
			{!transactions || transactions.length === 0 ? (
				''
			) : (
				<Box
					display="inline-grid"
					alignItems="center"
					justifyContent="center"
					gridTemplateRows="auto"
					gridTemplateColumns="1fr 2fr 1fr 2fr 1fr"
					gridAutoFlow="column"
					width="100%"
				>
					<Button
						onClick={setPreviousPage}
						disabled={!previousEnabled}
						padding="0.75rem"
						fontSize="0.8rem"
						height="0.85rem"
						gridColumn="2"
						minWidth=""
						maxWidth="6rem"
						width="100%"
						justifySelf="right"
					>
						← Previous
					</Button>
					<Text
						padding=".5rem"
						textColor="white"
						gridColumn="3"
						minWidth=""
						maxWidth="7.5rem"
						justifySelf="center"
					>
						Page {currentPage + 1}&nbsp;of&nbsp;{totalPages}
					</Text>
					<Button
						onClick={setNextPage}
						disabled={!nextEnabled}
						padding="0.75rem"
						fontSize="0.8rem"
						height="0.85rem"
						gridColumn="4"
						minWidth=""
						maxWidth="6rem"
						width="100%"
						justifySelf="left"
					>
						Next →
					</Button>
				</Box>
			)}
		</Box>
	);
}
