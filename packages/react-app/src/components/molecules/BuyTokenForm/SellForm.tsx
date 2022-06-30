import { Box, Button, Flex, Spacer, Text, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { Toaster } from '../../../types';
import { decimalsOf, safeFixed } from '../../../utils/contracts';
import BigNumberInput from '../../atoms/BigNumberInput';
import DisplayNumber from '../../atoms/DisplayNumber';
import { TooltipWrapper } from '../../atoms/TooltipWrapper';
import { YesNoIcon } from '../../atoms/YesNoIcon';
import CoinSelectorWithBalance from '../CoinSelectorWithBalance';
import { handleMaxAndNotify } from '../helpers';
import { readableBalance } from './buy';
import { styles } from './styles';
import { FormProps } from './types';

const WIDTHS: Record<string, string> = {
	sm: '20rem',
	md: '20rem',
	lg: '90%',
	xl: '90%',
};

export default function SellForm(props: FormProps): JSX.Element {
	const {
		allowedTokens,
		amounts,
		approved,
		balances,
		breakpoint,
		buttonEnabled = true,
		buySymbol,
		disabled = false,
		disabledLabel = '',
		isBusy = false,
		sellSymbol,
		loaded,
		loading,
		onSubmit,
		onBuyAmountChange,
		onSellAmountChange,
		onSymbolChange,
	} = props;

	const toast: Toaster = useToast();

	const buyBalance = useMemo(
		() => readableBalance(buySymbol, balances, loaded, loading),
		[balances, buySymbol, loaded, loading],
	);

	const [buyVal, sellVal] = useMemo(() => {
		let bv = 0;
		try {
			bv = parseFloat(amounts[0]);
		} catch (e) {
			// pass
		}
		let sv = 0;
		try {
			sv = parseFloat(amounts[1]);
		} catch (e) {
			// pass
		}
		return [bv, sv];
	}, [amounts]);

	const handleMax = useCallback(() => {
		if (!disabled) {
			handleMaxAndNotify(buySymbol, balances, onBuyAmountChange, toast);
		}
	}, [balances, buySymbol, disabled, onBuyAmountChange, toast]);

	const { sellLabel, sellEnabled, sellTooltip } = useMemo(() => {
		if (!loaded || sellVal === 0.0) {
			return {
				sellLabel: 'Sell',
				sellEnabled: false,
			};
		}
		let sellLabel = 'Sell';
		let sellTooltip = 'Sell tokens';
		if (!approved) {
			sellLabel = `Approve & Sell`;
			sellTooltip = 'Approve and sell tokens';
		}
		return {
			sellLabel,
			sellEnabled: !disabled && buttonEnabled,
			sellTooltip,
		};
	}, [loaded, sellVal, approved, disabled, buttonEnabled]);

	const buyAmountLabel = useMemo(() => {
		const bal = balances[buySymbol];
		let color = 'gray';
		if (bal && buyVal > 0 && bal.gt(0)) {
			let buyAmount = ethers.BigNumber.from('0');
			try {
				buyAmount = parseUnits(buyVal.toString(), decimalsOf(buySymbol));
				color = bal.gt(buyAmount) ? 'green' : 'red';
			} catch (e) {
				console.error(e);
			}
		}

		const textProps = {
			color,
			fontSize: 'sm',
		};

		if (bal) {
			const display = formatUnits(bal, decimalsOf(buySymbol));
			return (
				<Box {...textProps} textAlign="left">
					{safeFixed(display, 3)}
				</Box>
			);
		}
		return (
			<Text {...textProps} textAlign="left">
				0.000
			</Text>
		);
	}, [balances, buySymbol, buyVal]);

	const buyAmountTooltip = useMemo(() => {
		const bal = balances[buySymbol];
		if (bal && bal.gt(0)) {
			return formatUnits(bal, decimalsOf(buySymbol));
		}
		return '0.00';
	}, [balances, buySymbol]);

	const sellAmountLabel = useMemo(() => {
		const bal = balances[sellSymbol];
		const textProps = {
			color: 'gray',
			fontSize: 'sm',
		};
		if (bal && bal.gt(0)) {
			const fullAmount = formatUnits(bal, decimalsOf(sellSymbol));
			return (
				<Box {...textProps} textAlign="left">
					{safeFixed(fullAmount, 3)}
				</Box>
			);
		}
		return (
			<Text {...textProps} textAlign="left">
				0.000
			</Text>
		);
	}, [balances, sellSymbol]);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Sell {buySymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount you want to buy or sell in the form below, and wait a moment to get
				a quote.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold" onClick={handleMax} cursor="pointer">
				Balance: <DisplayNumber value={buyBalance} symbol={buySymbol} as="span" />
			</Text>
			<Flex
				bgColor="blue5"
				borderRadius="lg"
				height="2.5rem"
				lineHeight="2.5rem"
				justify="space-between"
				padding="0"
				width={WIDTHS[breakpoint]}
			>
				<TooltipWrapper show={disabled} label={disabledLabel}>
					<Box padding="0 1rem">
						<BigNumberInput
							padding="0"
							disabled={disabled}
							name="buyAmount"
							placeholder="0"
							type="number"
							value={amounts[0]}
							color="white"
							bgColor="blue5"
							variant="unstyled"
							fontSize="md"
							onValueChange={onBuyAmountChange}
						/>
					</Box>
				</TooltipWrapper>
				<Spacer />
				<Tooltip label={approved ? "You've already approved this token." : 'Approve this token.'}>
					<Box margin="0.7rem 0.75rem 0 0">
						<YesNoIcon status={approved} color="purple" />
					</Box>
				</Tooltip>
				<Flex flexDirection="column" lineHeight="1.1rem" flexBasis="flex-start" paddingTop="0.1rem">
					<Box onClick={handleMax} cursor="pointer">
						<Tooltip label={`${buyAmountTooltip} ${buySymbol}`}>{buyAmountLabel}</Tooltip>
					</Box>
					<Text color="white" fontSize="sm" marginRight="1rem">
						{buySymbol}
					</Text>
				</Flex>
				<Button
					variant="secondary"
					color={styles.inactive.color}
					onClick={handleMax}
					width="10%"
					borderLeftRadius="0"
					borderRightRadius="lg"
					isLoading={isBusy}
				>
					Max
				</Button>
			</Flex>
			<Flex
				borderRadius="lg"
				bgColor="blue5"
				width={WIDTHS[breakpoint]}
				justify="space-between"
				padding="0"
				height="2.5rem"
				lineHeight="2.5rem"
			>
				<TooltipWrapper show={disabled} label={disabledLabel}>
					<Box padding="0 1rem">
						<BigNumberInput
							padding="0"
							disabled={disabled}
							name="buyAmount"
							placeholder="0"
							type="number"
							value={amounts[1]}
							color="white"
							bgColor="blue5"
							variant="unstyled"
							fontSize="md"
							onValueChange={onSellAmountChange}
						/>
					</Box>
				</TooltipWrapper>
				<Spacer />
				<CoinSelectorWithBalance
					allowedTokens={allowedTokens}
					balances={balances}
					except={[buySymbol]}
					amount={sellAmountLabel}
					onChange={onSymbolChange}
					selected={sellSymbol}
					optionStyle={styles.option}
					disabled={disabled}
					margin="0 0.5rem"
				/>
			</Flex>
			<Tooltip label={sellTooltip}>
				<Button disabled={!sellEnabled} onClick={onSubmit} isLoading={isBusy}>
					{sellLabel}
				</Button>
			</Tooltip>
		</VStack>
	);
}
