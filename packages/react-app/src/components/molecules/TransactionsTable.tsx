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
import { isString } from 'lodash';
import { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { JsxElement } from 'typescript';
import { breakpointState } from '../../state';

import { getTokenUrl, timestampSorter } from '../../utils';
import { usePagination } from './Pagination/usePagination';
import WalletButton from './WalletButton';

const formatDate = (timestamp: string): string => {
	const ts = parseInt(timestamp, 10) * 1000;
	const date = new Date(ts);
	return date.toLocaleDateString('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const formatNumber = (n: number | string): string => {
	if (isString(n)) {
		const num: string = parseFloat(n).toLocaleString(undefined, {
			minimumSignificantDigits: 2,
			maximumSignificantDigits: 6,
		});
		return num.length > 8 ? parseFloat(n).toExponential(2) : num;
	} else {
		const num: string = n.toLocaleString(undefined, {
			minimumSignificantDigits: 2,
			maximumSignificantDigits: 6,
		});
		return num.length > 8 ? n.toExponential(2) : num;
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
	let action: ReactNode[] = [''];
	let tIcon = '';
	if (row.fromAmount > 0 && row.toAmount > 0) {
		t = 'Exchange';
		tIcon = '/images/portfolio/exchange-circle.png';
		action = [
			`${formatNumber(row.fromAmount)} ${row.fromSymbol} for`,
			<br />,
			`${formatNumber(row.toAmount)} ${row.toSymbol}`,
		];
	}
	if (row.fromSymbol === 'SWX') {
		t = 'Bond Issuance';
		tIcon = '/images/portfolio/plus-circle.png';
		action = [`Deposited ${formatNumber(row.fromAmount)} ${row.fromSymbol}`];
	}
	if (t === '' && row.fromAmount > 0 && row.toAmount <= 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/send.png';
		action = [`Sent ${formatNumber(row.fromAmount)} ${row.fromSymbol}`];
	}
	if (t === '' && row.fromAmount <= 0 && row.toAmount > 0) {
		t = 'Transfer';
		tIcon = '/images/portfolio/recieve.png';
		action = [`Recieved ${formatNumber(row.toAmount)} ${row.toSymbol}`];
	}
	return (
		<Tr {...props}>
			{breakpoint !== 'sm' && (
				<Td width="190px">
					<Text as="span">{formatDate(row.timestamp.toString())}</Text>
				</Td>
			)}

			<Td padding="16px 0 16px 16px">
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

			{breakpoint !== 'sm' && <Td>{t}</Td>}
			{breakpoint !== 'sm' ? (
				<Td>{action}</Td>
			) : (
				<Td>
					<Text bgColor="lightline" fontWeight="bold">
						{formatDate(row.timestamp.toString())}
					</Text>
					<Text>{action}</Text>
				</Td>
			)}

			<Td padding="16px 16px 16px 0">
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
	isConnected: boolean;
	transactions: RowProps[] | undefined;
	first?: boolean;
}

export function TransactionsTable(props: TransactionsTableProps): JSX.Element {
	const { isConnected, transactions, first = true } = props;
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

	if (!isConnected) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text paddingBottom="1rem">Please connect your wallet</Text>
					<WalletButton width="5rem" />
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
			{!transactions || transactions.length === 0 || !isConnected ? (
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
