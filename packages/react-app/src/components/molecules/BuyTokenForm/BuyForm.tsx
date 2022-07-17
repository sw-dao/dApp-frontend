import { Box, Button, Flex, Spacer, Text, Tooltip, VStack, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { Toaster } from '../../../types';
import { debugPrintCoinBalances, decimalsOf, safeFixed } from '../../../utils/contracts';
import { toPrecision } from '../../../utils/numbers';
import BigNumberInput from '../../atoms/BigNumberInput';
import DisplayNumber from '../../atoms/DisplayNumber';
import { TooltipWrapper } from '../../atoms/TooltipWrapper';
import { YesNoIcon } from '../../atoms/YesNoIcon';
import CoinSelectorWithBalance from '../CoinSelectorWithBalance';
import { handleMaxAndNotify } from '../helpers';
import WalletButton from '../WalletButton';
import { readableBalance } from './buy';
import { styles } from './styles';
import { FormProps } from './types';

const WIDTHS: Record<string, string> = {
	sm: '20rem',
	md: '20rem',
	lg: '90%',
	xl: '90%',
};

export default function BuyForm(props: FormProps): JSX.Element {
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

	const [buyBalance, buyFullBalance] = useMemo(() => {
		const rv = [
			readableBalance(buySymbol, balances, loaded, loading),
			balances[buySymbol] ? formatUnits(balances[buySymbol], decimalsOf(buySymbol)) : '',
		];
		console.log(`Got buyBalance ${rv}`);
		return rv;
	}, [balances, buySymbol, loaded, loading]);

	const toast: Toaster = useToast();

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
			handleMaxAndNotify(sellSymbol, balances, onSellAmountChange, toast);
		}
	}, [disabled, sellSymbol, balances, onSellAmountChange, toast]);

	const { buyLabel, buyEnabled, buyTooltip } = useMemo(() => {
		if (!loaded || buyVal === 0.0) {
			return {
				buyLabel: 'Buy',
				buyEnabled: false,
			};
		}
		let buyLabel = 'Buy';
		let buyTooltip = 'Purchase tokens';
		if (!approved) {
			buyLabel = `Approve & Buy`;
			buyTooltip = 'Approve and purchase tokens';
		}
		return {
			buyLabel,
			buyEnabled: !disabled && buttonEnabled,
			buyTooltip,
		};
	}, [loaded, buyVal, approved, disabled, buttonEnabled]);

	const sellAmountLabel = useMemo(() => {
		const bal = balances[sellSymbol];
		let color = 'gray';
		if (bal && sellVal > 0 && bal.gt(0)) {
			let sellAmount = ethers.BigNumber.from('0');
			try {
				sellAmount = parseUnits(sellVal.toString(), decimalsOf(sellSymbol));
				color = bal.gt(sellAmount) ? 'green' : 'red';
			} catch (e) {
				console.error(e);
			}
		}

		const textProps = {
			color,
			fontSize: 'sm',
		};

		if (bal) {
			const display = formatUnits(bal, decimalsOf(sellSymbol));
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
	}, [balances, sellSymbol, sellVal]);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Buy {buySymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount you want to buy or sell in the form below, and wait a moment to get
				a quote.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold">
				<Text as="span">
					Balance: <DisplayNumber value={buyBalance} symbol={buySymbol} as="span" />
				</Text>
			</Text>
			<Flex
				id="buy-form"
				flexFlow="row nowrap"
				bgColor="blue5"
				borderRadius="lg"
				height="2.5rem"
				justify="space-between"
				padding="0"
				width={WIDTHS[breakpoint]}
				lineHeight="2.5rem"
			>
				<TooltipWrapper show={disabled} label={disabledLabel}>
					<Box padding="0 0 0 1rem">
						<BigNumberInput
							padding="0"
							disabled={disabled}
							name="buyAmount"
							placeholder="0"
							type="number"
							value={toPrecision(amounts[1], 6)}
							color="white"
							bgColor="blue5"
							variant="unstyled"
							fontSize="md"
							onValueChange={onSellAmountChange}
						/>
					</Box>
				</TooltipWrapper>
				<Spacer />
				<Tooltip label={approved ? "You've already approved this token." : 'Approve this token.'}>
					<Box margin="0.7rem 0 0 0">
						<YesNoIcon status={approved} color="purple" />
					</Box>
				</Tooltip>
				<CoinSelectorWithBalance
					allowedTokens={allowedTokens}
					balances={balances}
					disabled={disabled}
					except={[buySymbol]}
					amount={sellAmountLabel}
					onChange={onSymbolChange}
					onAmountChange={onSellAmountChange}
					selected={sellSymbol}
					optionStyle={styles.option}
				/>
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
				width={WIDTHS[breakpoint]}
				borderRadius="lg"
				bgColor="blue5"
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
							value={toPrecision(amounts[0], 6)}
							color="white"
							bgColor="blue5"
							variant="unstyled"
							fontSize="md"
							onValueChange={onBuyAmountChange}
						/>
					</Box>
				</TooltipWrapper>
				<Spacer />
				<Text color="white" fontSize="sm" margin="0 0.5rem 0 0">
					{buySymbol}
				</Text>
			</Flex>
			{!disabled || isBusy ? (
				<Tooltip label={buyTooltip}>
					<Button disabled={disabled || !buyEnabled} onClick={onSubmit} isLoading={isBusy}>
						{buyLabel}
					</Button>
				</Tooltip>
			) : (
				<WalletButton width="7rem" connectLabel="Connect Wallet" />
			)}
		</VStack>
	);
}
