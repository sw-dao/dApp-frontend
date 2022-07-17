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

import { CoinBalances, TokenSummaryInfoMap } from '../../../types';
import { getTokenUrl } from '../../../utils';
import { decimalsOf } from '../../../utils/contracts';
import { toPrecision } from '../../../utils/numbers';
import BigNumberInput from '../../atoms/BigNumberInput';
import { CoinIcon } from '../../atoms/CoinIcon';
import DisplayNumber from '../../atoms/DisplayNumber';
import { YesNoIcon } from '../../atoms/YesNoIcon';
import { styles } from '../BuyTokenForm/styles';
import WalletButton from '../WalletButton';
import { checkApproval, getApprovalsNeeded } from './issuance';

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
	components: TokenSummaryInfoMap;
	loaded: boolean;
	buyAmount: string;
	buySymbol: string;
	onBuy: (amount: string) => void;
	onBuyAmountChange: (amount: string) => void;
	positions: Record<string, BigNumber>;
	disabled?: boolean;
	isBusy?: boolean;
}

export function IssueForm(props: FormPanelProps): JSX.Element {
	const {
		approvals,
		balances,
		breakpoint,
		disabled = false,
		loaded,
		buyAmount,
		buySymbol,
		isBusy = false,
		positions,
		components,
		onBuyAmountChange,
		onBuy,
	} = props;

	const buyVal = useMemo(() => {
		let val = 0;
		try {
			val = parseFloat(buyAmount);
		} catch (e) {
			// pass
		}
		return val;
	}, [buyAmount]);

	const handleBuyMax = useMemo(
		() => () => {
			if (loaded) {
				// using the positions, determine the max amount we can buy
				const possibles = Object.keys(positions).map((symbol) => {
					const position = positions[symbol];
					const balance = balances[symbol];
					if (!balance || !position) {
						console.log('no balance or position', symbol);
						return 0.0;
					}
					const balNum = parseFloat(formatUnits(balance, decimalsOf(symbol)));
					const posNum = parseFloat(formatUnits(position, decimalsOf(symbol)));
					return balNum / posNum;
				});
				possibles.sort();
				const max = possibles[0] || 0.0;
				console.log(
					`Max: ${max.toString()} of list ${possibles.map((p) => p.toString()).join(', ')}`,
				);
				onBuyAmountChange(max.toFixed(8));
			}
		},
		[loaded, positions, onBuyAmountChange, balances],
	);

	const tableRows = useMemo(() => {
		// console.log(`making table rows for ${buySymbol}\n${JSON.stringify(positions, null, 2)}`);
		// console.log('balances', balances);
		const buyNum = buyVal === 0.0 ? 1 : buyVal;
		const keys = Object.keys(positions);
		keys.sort();
		return keys.map((s) => {
			const symbol = s.toUpperCase();
			const position = positions[symbol];
			let amount = '0.0';
			if (position) {
				amount = formatUnits(position, decimalsOf(symbol));
			}
			const amountNum = parseFloat(amount) * buyNum;
			amount = amountNum.toFixed(8);

			const balance = balances[symbol] ? formatUnits(balances[symbol], decimalsOf(symbol)) : '0.00';
			// const valid = buyVal === 0.0 || parseFloat(balance) > parseFloat(amount);
			const approved = checkApproval(symbol, amountNum, approvals);
			const approvalLabel = approved ? 'Approved' : 'Requires approval at the next step';
			const src = getTokenUrl(symbol)[0];
			return (
				<Tr key={symbol} color="purple">
					<Td padding="0 0 0 0.5em" className="nobreak coin">
						<CoinIcon symbol={symbol} src={src} />
						<Text fontSize="0.7rem" d="inline-block" className="symbol">
							{symbol}
						</Text>
					</Td>
					<Td textAlign="right" fontSize="0.8rem" padding="0 0.25em">
						<DisplayNumber value={amount} symbol={symbol} hideSymbol />
					</Td>
					<Td textAlign="right" fontSize="0.8rem" padding="0 0.25em">
						<DisplayNumber value={balance} symbol={symbol} />
					</Td>
					<Td textAlign="right" align="right" padding="0 .5em 0 0">
						<Tooltip label={approvalLabel}>
							<Box paddingLeft="2rem">
								<YesNoIcon status={approved} size="1.5rem" color="purple" />
							</Box>
						</Tooltip>
					</Td>
				</Tr>
			);
		});
	}, [approvals, balances, buyVal, positions]);

	const tokenCountNeedingApproval = useMemo(() => {
		if (!loaded || buyVal === 0.0) {
			return 0;
		}
		const approved = getApprovalsNeeded(buyAmount, components, approvals, positions);
		const count = Object.keys(approved).length;
		console.log(`tokensToApprove: ${count}`);
		return count;
	}, [loaded, buyVal, buyAmount, components, approvals, positions]);

	const { buyLabel, buyEnabled, buyTooltip } = useMemo(() => {
		const buyEnabled = !disabled && loaded && buyVal > 0.000001;
		let buyLabel = 'Buy';
		let buyTooltip = 'Purchase tokens';
		if (tokenCountNeedingApproval > 1) {
			buyLabel = `Approve & Buy`;
			buyTooltip = 'Approve and purchase tokens';
		} else if (tokenCountNeedingApproval === 1) {
			buyLabel = 'Approve & Buy';
			buyTooltip = 'Approve and purchase tokens';
		}
		if (buyVal <= 0.000001) {
			buyTooltip = 'Amount must be greater than 0.000001';
		}
		return {
			buyLabel,
			buyEnabled,
			buyTooltip,
		};
	}, [tokenCountNeedingApproval, buyVal, disabled, loaded]);

	const handleBuy = useCallback(() => {
		if (!buyEnabled) {
			return;
		}
		onBuy(buyAmount);
	}, [buyAmount, buyEnabled, onBuy]);

	const buyBalance = useMemo(() => {
		if (!loaded) {
			return '0.00';
		}
		const balance = balances[buySymbol];
		if (!balance) {
			return '0.00';
		}
		return formatUnits(balance, decimalsOf(buySymbol));
	}, [loaded, buySymbol, balances]);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Buy {buySymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount of {buySymbol} to buy, or click "max" to buy all available with your
				your balances.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold">
				<DisplayNumber value={buyBalance} symbol={buySymbol} as="span" />
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
					name="buyAmount"
					placeholder="0"
					type="number"
					value={toPrecision(buyAmount, 6)}
					color="white"
					bgColor="blue5"
					variant="unstyled"
					width="80%"
					fontSize="md"
					onValueChange={onBuyAmountChange}
				/>
				<Button
					variant="secondary"
					color={styles.inactive.color}
					onClick={handleBuyMax}
					width="10%"
					borderLeftRadius="0"
					borderRightRadius="lg"
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
							Amount required
						</Th>
						<Th fontSize="0.6rem" textAlign="right" padding="0.5rem 0.25rem 0 0.25rem">
							Your Balance
						</Th>
						<Th fontSize="0.6rem" textAlign="right" padding="0.5rem 0.5em 0 0">
							&nbsp;
						</Th>
					</Tr>
				</Thead>
				<Tbody>{tableRows}</Tbody>
			</Table>
			{!disabled || isBusy ? (
				<Tooltip label={buyTooltip} shouldWrapChildren>
					<Button disabled={!buyEnabled} onClick={handleBuy} isLoading={isBusy}>
						{buyLabel}
					</Button>
				</Tooltip>
			) : (
				<WalletButton width="7rem" connectLabel="Connect Wallet" />
			)}
		</VStack>
	);
}
