import { Box, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { A } from 'hookrouter';
import { useRecoilValue } from 'recoil';
import { PRODUCTS } from '../../config/products';
import { breakpointState } from '../../state';

import { PortfolioTokenDetails } from '../../types';
import { getTokenUrl } from '../../utils';
import { ButtonLink } from '../atoms/ButtonLink';
import { CoinLabelCell } from '../atoms/CoinLabelCell';
import { DEFAULT_COL_STYLES } from './HoldingsTable/types';
import { formatNumber } from './TransactionsTable';
import WalletButton from './WalletButton';

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
				<Td paddingInlineEnd="0px">
					<CoinLabelCell
						icon={icon}
						symbol={row.symbol}
						name={name}
						url={productUrl}
						{...DEFAULT_COL_STYLES[breakpoint].name}
						width="100%"
						height="4rem"
						hideSymbol
						linkCell
					/>
				</Td>
				{/* <Td paddingInlineStart="0px" paddingInlineEnd="0px">
					<A href={productUrl}>
						<Text as="span">{name}</Text>
					</A>
				</Td> */}
				<Td textAlign="center" paddingInlineStart="0px" {...DEFAULT_COL_STYLES[breakpoint].ticker}>
					{row.symbol.toUpperCase()}
				</Td>
				<Td textAlign="center" paddingInlineStart="0px" {...DEFAULT_COL_STYLES[breakpoint].price}>
					{formatNumber(row.amount)}
				</Td>
				<Td textAlign="center" paddingInlineStart="0px" {...DEFAULT_COL_STYLES[breakpoint].price}>
					{parseFloat(row.price).toLocaleString(undefined, {
						currency: 'USD',
						style: 'currency',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Td>
				<Td textAlign="center" paddingInlineStart="0px" {...DEFAULT_COL_STYLES[breakpoint].price}>
					{row.total.toLocaleString(undefined, {
						currency: 'USD',
						style: 'currency',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Td>
				{breakpoint !== 'sm' && (
					<Td
						textAlign="center"
						paddingInlineStart="0px"
						// {...DEFAULT_COL_STYLES[breakpoint].action}
					>
						<ButtonLink
							variant="primary"
							href={productUrl}
							align="center"
							padding="0.2rem"
							fontSize="0.8rem"
							maxWidth="5rem"
							margin="auto"
						>
							Buy/Sell
						</ButtonLink>
					</Td>
				)}
			</Tr>
		);
	}
	return (
		<Tr {...props}>
			<Th>
				<Text fontWeight="normal" bgColor="lightline" textAlign="center">
					Symbol
				</Text>
				<A href={productUrl}>
					<Text fontWeight="bold" className="symbol" textAlign="center">
						{row.symbol.toUpperCase()}
					</Text>
				</A>
				<Text fontWeight="normal" bgColor="lightline" textAlign="center">
					Price
				</Text>
				<Text fontWeight="bold" textAlign="center">
					{parseFloat(row.price).toLocaleString(undefined, {
						currency: 'USD',
						style: 'currency',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Text>
			</Th>
			<Th>
				<Text fontWeight="normal" bgColor="lightline" textAlign="center">
					Amount
				</Text>
				<Text fontWeight="bold" textAlign="center">
					{formatNumber(row.amount)}
				</Text>
				<Text fontWeight="normal" bgColor="lightline" textAlign="center">
					Total
				</Text>
				<Text fontWeight="bold" textAlign="center">
					{row.total.toLocaleString(undefined, {
						currency: 'USD',
						style: 'currency',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Text>
			</Th>
		</Tr>
	);
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
				{/* <Th bgColor="lightline"></Th> */}
				<Th bgColor="lightline" paddingInlineStart="0px" paddingInlineEnd="0px" textAlign="center">
					Name
				</Th>
				<Th bgColor="lightline" paddingInlineStart="0px" textAlign="center">
					Ticker
				</Th>
				<Th bgColor="lightline" paddingInlineStart="0px" textAlign="center">
					Amount
				</Th>
				<Th bgColor="lightline" paddingInlineStart="0px" textAlign="center">
					Price
				</Th>
				<Th bgColor="lightline" paddingInlineStart="0px" textAlign="center">
					Total
				</Th>
				{breakpoint !== 'sm' && (
					<Th bgColor="lightline" paddingInlineStart="0px" textAlign="center">
						Trade
					</Th>
				)}
			</Tr>
		);
	}
	return <Tr></Tr>;
}

interface HoldingsTableProps {
	isConnected: boolean;
	holdings: PortfolioTokenDetails[] | undefined;
	first?: boolean;
}

export function HoldingsTable(props: HoldingsTableProps): JSX.Element {
	const { isConnected, holdings, first = true } = props;
	let rows;

	if (!isConnected) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text paddingBottom="1rem">Please connect your wallet</Text>
					<WalletButton width="5rem" />
				</Td>
			</Tr>
		);
	} else if (!holdings) {
		rows = (
			<Tr>
				<Td colSpan={6} textAlign="center" color="bodytext">
					<Text fontStyle="italic" p="2rem 2rem 0 2rem">
						Loading your wallet ...
					</Text>
					<Spinner size="lg" margin="2rem auto" />
				</Td>
			</Tr>
		);
	} else if (holdings.length === 0) {
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
