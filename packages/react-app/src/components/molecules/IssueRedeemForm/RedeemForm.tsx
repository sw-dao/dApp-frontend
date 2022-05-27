import {
	Box,
	Button,
	Flex,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { CoinBalances } from '../../../types';
import { getTokenUrl } from '../../../utils';
import { decimalsOf } from '../../../utils/contracts';
import { toPrecision } from '../../../utils/numbers';
import BigNumberInput from '../../atoms/BigNumberInput';
import { CoinIcon } from '../../atoms/CoinIcon';
import DisplayNumber from '../../atoms/DisplayNumber';
import { YesNoIcon } from '../../atoms/YesNoIcon';
import { styles } from '../BuyTokenForm/styles';

function checkApproval(symbol: string, amount: number, approvals: CoinBalances) {
	if (!approvals[symbol]) {
		console.log(`${symbol} not approved - no approvals`);
		return false;
	}
	const approval = formatUnits(approvals[symbol], decimalsOf(symbol));
	const approvalAmount = parseFloat(approval);
	const approved = approvalAmount >= amount;
	if (approvalAmount > 0.0 && !approved) {
		console.log(`${symbol} not approved for enough. ${approval} < ${amount}`);
	}
	return approved;
}

const WIDTHS: Record<string, string> = {
	sm: '16rem',
	md: '16rem',
	lg: '90%',
	xl: '90%',
};

interface FormPanelProps {
	approvals: CoinBalances;
	balances: CoinBalances;
	breakpoint: string;
	loaded: boolean;
	sellAmount: string;
	sellSymbol: string;
	onSell: (amount: string) => void;
	onSellAmountChange: (amount: string) => void;
	positions: Record<string, BigNumber>;
	disabled?: boolean;
	isBusy?: boolean;
}

export function RedeemForm(props: FormPanelProps): JSX.Element {
	const {
		approvals,
		balances,
		breakpoint,
		disabled = false,
		isBusy = false,
		loaded,
		sellAmount,
		sellSymbol,
		positions,
		onSellAmountChange,
		onSell,
	} = props;

	const sellVal = useMemo(() => {
		let val = 0;
		try {
			val = parseFloat(sellAmount);
		} catch (e) {
			// pass
		}
		return val;
	}, [sellAmount]);

	const handleSellMax = useMemo(
		() => () => {
			if (loaded) {
				const amount = balances[sellSymbol];
				const formatted = amount ? formatUnits(amount, decimalsOf(sellSymbol)) : '0';
				onSellAmountChange(formatted);
			}
		},
		[loaded, balances, sellSymbol, onSellAmountChange],
	);

	const tableRows = useMemo(() => {
		// console.log(`making table rows for ${sellSymbol}\n${JSON.stringify(positions, null, 2)}`);
		// console.log('balances', balances);
		const sellNum = sellVal === 0.0 ? 1 : sellVal;
		const keys = Object.keys(positions);
		keys.sort();
		return keys.map((s) => {
			const symbol = s.toUpperCase();
			const position = positions[symbol];
			let amount = formatUnits(position, decimalsOf(symbol));
			const amountNum = parseFloat(amount) * sellNum;
			amount = amountNum.toFixed(8);
			const balance = balances[symbol] ? formatUnits(balances[symbol], decimalsOf(symbol)) : '0.00';
			return (
				<Tr key={symbol} color="purple">
					<Td padding="0 0 0 0.5em" className="nobreak coin">
						<CoinIcon symbol={symbol} src={getTokenUrl(symbol)[0]} />
						<Text fontSize="0.7rem" d="inline-block" className="symbol">
							{symbol}
						</Text>
					</Td>
					<Td textAlign="right" fontSize="0.8rem" padding="0 0.25em">
						<DisplayNumber value={amount} symbol={symbol} hideSymbol />
					</Td>
					<Td textAlign="right" fontSize="0.8rem" padding="0 0.25em">
						<DisplayNumber value={balance} symbol={symbol} hideSymbol />
					</Td>
				</Tr>
			);
		});
	}, [balances, sellVal, positions]);

	const sellTokenApproved = useMemo(() => {
		if (!loaded) {
			return false;
		}
		const approved = checkApproval(sellSymbol, sellVal, approvals);
		console.log(`sellTokenApproved: ${approved}`);
		return approved;
	}, [loaded, sellVal, sellSymbol, approvals]);

	const { sellLabel, sellEnabled, sellTooltip } = useMemo(() => {
		let sellEnabled = !disabled && sellVal > 0.000001;
		const balance = balances[sellSymbol] || '0';
		const formatted = balance ? formatUnits(balance, decimalsOf(sellSymbol)) : '0';
		const balanceNum = parseFloat(formatted);
		const valid = balanceNum >= sellVal;
		sellEnabled = sellEnabled && valid;
		let sellTooltip = '';

		if (!valid) {
			sellTooltip = `You don't have enough ${sellSymbol} to sell.`;
		} else if (sellVal <= 0.000001) {
			sellTooltip = 'Amount must be greater than 0.000001';
		}

		return {
			sellLabel: sellTokenApproved ? 'Sell' : 'Approve & Sell',
			sellEnabled,
			sellTooltip,
		};
	}, [sellVal, balances, sellSymbol, sellTokenApproved, disabled]);

	const handleSell = useCallback(() => {
		if (!sellEnabled) {
			return;
		}
		onSell(sellAmount);
	}, [sellAmount, sellEnabled, onSell]);

	const sellBalance = useMemo(() => {
		if (!loaded) {
			return '0.00';
		}
		const balance = balances[sellSymbol];
		if (!balance) {
			return '0.00';
		}
		return formatUnits(balance, decimalsOf(sellSymbol));
	}, [loaded, sellSymbol, balances]);

	const approvalLabel = useMemo(
		() => (sellTokenApproved ? 'Approved' : 'Requires approval at the next step'),
		[sellTokenApproved],
	);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Sell {sellSymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount to sell, or click "max" to sell all available for their underlying
				tokens.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold">
				Balance: <DisplayNumber value={sellBalance} symbol={sellSymbol} as="span" />
			</Text>
			<Flex
				borderRadius="lg"
				bgColor="blue5"
				width={WIDTHS[breakpoint]}
				justify="space-between"
				padding="0 0 0 1rem"
			>
				<BigNumberInput
					d="inline-block"
					name="sellAmount"
					value={toPrecision(sellAmount, 6)}
					color="white"
					bgColor="blue5"
					variant="unstyled"
					width="70%"
					fontSize="md"
					onValueChange={onSellAmountChange}
				/>
				<Tooltip label={approvalLabel}>
					<Box paddingTop="0.6rem" paddingRight="0.5rem">
						<YesNoIcon status={sellTokenApproved} />
					</Box>
				</Tooltip>
				<Button
					variant="secondary"
					color={styles.inactive.color}
					onClick={handleSellMax}
					width="10%"
					borderLeftRadius="0"
					borderRightRadius="lg"
					isLoading={isBusy}
				>
					Max
				</Button>
			</Flex>
			<Table
				variant="unstyled"
				borderTop="1px solid"
				borderColor="blue5"
				width="95%"
				paddingTop="1rem"
			>
				<Thead color="purple">
					<Tr paddingBottom="0.25rem">
						<Th fontSize="0.6rem" padding="0.5rem 0 0 0">
							Token
						</Th>
						<Th fontSize="0.6rem" textAlign="right" padding="0.5rem 0.25rem 0 0.25rem">
							Amount to Receive
						</Th>
						<Th fontSize="0.6rem" textAlign="right" padding="0.5rem 0.25rem 0 0.25rem">
							Your Balance
						</Th>
					</Tr>
				</Thead>
				<Tbody>{tableRows}</Tbody>
			</Table>
			<Tooltip label={sellTooltip} shouldWrapChildren>
				<Button disabled={!sellEnabled} onClick={handleSell}>
					{sellLabel}
				</Button>
			</Tooltip>
		</VStack>
	);
}
