import { Box, Button, Flex, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { MIN_TRADE } from '../../../config';
import { CoinBalances, TokenSummaryInfoMap } from '../../../types';
import { decimalsOf } from '../../../utils/contracts';
import { toPrecision } from '../../../utils/numbers';
import BigNumberInput from '../../atoms/BigNumberInput';
import DisplayNumber from '../../atoms/DisplayNumber';
import { TooltipWrapper } from '../../atoms/TooltipWrapper';
import { YesNoIcon } from '../../atoms/YesNoIcon';
import { styles } from '../BuyTokenForm/styles';
import CoinSelectorWithBalance from '../CoinSelectorWithBalance';
import { checkApproval } from './issuance';

const WIDTHS: Record<string, string> = {
	sm: '18rem',
	md: '18rem',
	lg: '90%',
	xl: '90%',
};

interface FormPanelProps {
	approvals: CoinBalances;
	allowedTokens: TokenSummaryInfoMap;
	balances: CoinBalances;
	loaded: boolean;
	buyAmount: string;
	buySymbol: string;
	sellSymbol: string;
	sellVal: number;
	onBuy: (amount: string) => void;
	onBuyAmountChange: (amount: string) => void;
	onSellTokenChange: (symbol: string) => void;
	breakpoint: string;
	disabled?: boolean;
	disabledLabel?: string;
	buttonEnabled?: boolean;
	isBusy?: boolean;
}

export function IssueExactForm(props: FormPanelProps): JSX.Element {
	const {
		approvals,
		allowedTokens,
		balances,
		breakpoint,
		buttonEnabled = true,
		disabled = false,
		disabledLabel = '',
		isBusy,
		loaded,
		buyAmount,
		buySymbol,
		sellSymbol,
		sellVal,
		onBuyAmountChange,
		onBuy,
		onSellTokenChange,
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

	const isApproved = useMemo(() => {
		return checkApproval(sellSymbol, sellVal || MIN_TRADE, approvals);
	}, [sellSymbol, sellVal, approvals]);

	const { buyLabel, buyEnabled, buyTooltip } = useMemo(() => {
		const buyEnabled = !disabled && buttonEnabled && buyVal > 0.000001;
		let buyLabel = 'Buy';
		let buyTooltip = 'Purchase tokens';
		if (!isApproved) {
			buyLabel = `Approve & Buy`;
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
	}, [buyVal, isApproved, disabled, buttonEnabled]);

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

	const sellAmountLabel = useMemo(() => {
		const bal = balances[sellSymbol];
		const textProps = {
			color: 'gray',
			fontSize: 'sm',
		};
		if (!bal) {
			return (
				<Text {...textProps} textAlign="left">
					0.00
				</Text>
			);
		}
		if (bal && sellVal > 0 && bal.gt(0)) {
			let sellAmount = ethers.BigNumber.from('0');
			try {
				sellAmount = parseUnits(sellVal.toString(), decimalsOf(sellSymbol));
				textProps.color = bal.gt(sellAmount) ? 'green' : 'red';
			} catch (e) {
				console.error(e);
			}
		}
		if (bal) {
			const amountLabel = formatUnits(bal, decimalsOf(sellSymbol));
			return (
				<Box {...textProps} textAlign="left">
					<DisplayNumber value={amountLabel} symbol={sellSymbol} hideSymbol />
				</Box>
			);
		}
		return (
			<Text {...textProps} textAlign="left">
				0.00
			</Text>
		);
	}, [balances, sellSymbol, sellVal]);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Buy {buySymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount of {buySymbol} to buy and wait a moment to get a quote.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold">
				Balance: <DisplayNumber value={buyBalance} symbol={buySymbol} as="span" />
			</Text>
			<Flex
				width={WIDTHS[breakpoint]}
				height="2.5rem"
				lineHeight="2.5rem"
				justify="space-between"
				padding="0 0 0 1rem"
				color="bodytext"
			>
				<Text fontSize="md" color="bodytext">
					{sellVal ? sellVal.toFixed(8) : '--.--'}
				</Text>
				<Spacer />
				<Tooltip label={isApproved ? "You've already approved this token." : 'Approve this token.'}>
					<Box margin="0.6rem 0.75rem 0 0">
						<YesNoIcon status={isApproved} color="purple" />
					</Box>
				</Tooltip>
				<CoinSelectorWithBalance
					allowedTokens={allowedTokens}
					balances={balances}
					except={[buySymbol]}
					amount={sellAmountLabel}
					onChange={onSellTokenChange}
					selected={sellSymbol}
					optionStyle={styles.option}
					disabled={disabled}
				/>
			</Flex>
			<Flex
				borderRadius="lg"
				bgColor="blue5"
				width={WIDTHS[breakpoint]}
				justify="space-between"
				padding="0"
				height="2.5rem"
			>
				<TooltipWrapper show={disabled} label={disabledLabel}>
					<Box>
						<BigNumberInput
							padding="0.5rem 0 0 0"
							disabled={disabled}
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
					</Box>
				</TooltipWrapper>
				<Spacer />
				<Text color="white" fontSize="sm" lineHeight="2.5rem" marginRight="2.75rem">
					{buySymbol}
				</Text>
			</Flex>
			<Tooltip label={buyTooltip} shouldWrapChildren>
				<Button disabled={!buyEnabled} onClick={handleBuy} isLoading={isBusy}>
					{buyLabel}
				</Button>
			</Tooltip>
		</VStack>
	);
}
