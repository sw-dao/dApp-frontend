import { Box, Button, Flex, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
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
	breakpoint: string;
	buttonEnabled?: boolean;
	loaded: boolean;
	redeemAmount: string;
	redeemSymbol: string;
	outputSymbol: string;
	outputVal: number;
	onRedeem: (amount: string) => void;
	onAmountChange: (amount: string) => void;
	onTokenChange: (symbol: string) => void;
	disabled?: boolean;
	disabledLabel?: string;
	isBusy?: boolean;
}

export function RedeemExactForm(props: FormPanelProps): JSX.Element {
	const {
		approvals,
		allowedTokens,
		balances,
		breakpoint,
		buttonEnabled: defaultButtonEnabled = true,
		disabled = false,
		disabledLabel = '',
		isBusy,
		loaded,
		redeemAmount,
		redeemSymbol,
		outputSymbol,
		outputVal,
		onAmountChange,
		onRedeem,
		onTokenChange,
	} = props;

	const redeemVal = useMemo(() => {
		let val = 0;
		try {
			val = parseFloat(redeemAmount);
		} catch (e) {
			// pass
		}
		return val;
	}, [redeemAmount]);

	const isApproved = useMemo(() => {
		return checkApproval(redeemSymbol, redeemVal || MIN_TRADE, approvals);
	}, [redeemSymbol, redeemVal, approvals]);

	const { buttonLabel, buttonEnabled, buttonTooltip } = useMemo(() => {
		const buttonEnabled = !disabled && defaultButtonEnabled && redeemVal > MIN_TRADE;
		if (!loaded || redeemVal === 0.0) {
			return {
				buttonLabel: 'Sell',
				buttonEnabled: false,
			};
		}
		let buttonLabel = 'Sell';
		let buttonTooltip = 'Purchase tokens';
		if (!isApproved) {
			buttonLabel = `Approve & Sell`;
			buttonTooltip = 'Approve and purchase tokens';
		}
		if (redeemVal <= MIN_TRADE) {
			buttonTooltip = `Amount must be greater than ${MIN_TRADE.toString()}`;
		}
		return {
			buttonLabel,
			buttonEnabled,
			buttonTooltip,
		};
	}, [loaded, redeemVal, isApproved, disabled, defaultButtonEnabled]);

	const handleRedeem = useCallback(() => {
		if (!buttonEnabled) {
			return;
		}
		onRedeem(redeemAmount);
	}, [buttonEnabled, onRedeem, redeemAmount]);

	const handleRedeemMax = useCallback(() => {
		if (loaded) {
			const max = formatUnits(balances[redeemSymbol], decimalsOf(redeemSymbol));
			onAmountChange(max);
		}
	}, [loaded, balances, redeemSymbol, onAmountChange]);

	const balanceColor = useMemo(() => {
		if (redeemVal === 0.0) {
			return 'purple';
		}
		const balance = balances[redeemSymbol] || BigNumber.from('0');
		let balanceVal = 0;
		try {
			balanceVal = parseFloat(formatUnits(balance, decimalsOf(redeemSymbol)));
		} catch (e) {
			console.error(e);
		}
		if (balanceVal < redeemVal) {
			return 'red';
		}
		return 'purple';
	}, [balances, redeemSymbol, redeemVal]);

	const redeemBalance = useMemo(() => {
		if (!loaded) {
			return '0.00';
		}
		const balance = balances[redeemSymbol];
		if (!balance) {
			return '0.00';
		}
		try {
			return formatUnits(balance, decimalsOf(redeemSymbol));
		} catch (e) {
			console.error(e);
			return '0.00';
		}
	}, [loaded, redeemSymbol, balances]);

	const outputAmountLabel = useMemo(() => {
		const bal = balances[outputSymbol];
		if (bal) {
			return (
				<Box fontSize="sm" color="gray" textAlign="left">
					<DisplayNumber
						value={formatUnits(bal, decimalsOf(outputSymbol))}
						symbol={outputSymbol}
						hideSymbol
					/>
				</Box>
			);
		}
		return (
			<Text color="gray" fontSize="sm" textAlign="left">
				0.00
			</Text>
		);
	}, [balances, outputSymbol]);

	const redeemAmountLabel = useMemo(
		() => (
			<Box fontSize="sm" color="gray" textAlign="left">
				<DisplayNumber value={redeemBalance} symbol={redeemSymbol} hideSymbol />
			</Box>
		),
		[redeemBalance, redeemSymbol],
	);

	return (
		<VStack spacing="1rem">
			<Box as="h2" fontSize="2xl" color="bodytext" fontWeight="semibold">
				Sell {redeemSymbol}
			</Box>
			<Text color="bodytext" maxWidth="80%" fontSize="sm">
				Please enter the amount of {redeemSymbol} to sell, or click the balance to sell all
				available.
			</Text>
			<Text color="purple" fontSize="md" fontWeight="semibold" onClick={handleRedeemMax}>
				Balance:
				<DisplayNumber
					value={redeemBalance}
					symbol={redeemSymbol}
					ml="0.5rem"
					as="span"
					color={balanceColor}
				/>
			</Text>
			<Flex
				borderRadius="lg"
				bgColor="blue5"
				width={WIDTHS[breakpoint]}
				justify="space-between"
				padding="0"
				height="2.5rem"
			>
				<TooltipWrapper show={disabled} label={disabledLabel}>
					<Flex
						borderRadius="lg"
						bgColor="blue5"
						width="100%"
						justify="space-between"
						padding="0 0 0 1rem"
					>
						<BigNumberInput
							padding="0.5rem 0 0 0"
							disabled={disabled}
							name="redeemAmount"
							placeholder="0"
							type="number"
							value={toPrecision(redeemAmount, 6)}
							color="white"
							bgColor="blue5"
							variant="unstyled"
							width="80%"
							fontSize="md"
							onValueChange={onAmountChange}
						/>
						<Spacer />
						<Tooltip
							label={
								isApproved ? "You've already approved this token." : 'Approve this token to sell.'
							}
						>
							<Box margin="0.6rem 0.75rem 0 0">
								<YesNoIcon status={isApproved} color="purple" />
							</Box>
						</Tooltip>
						<Flex
							flexDirection="column"
							lineHeight="1.1rem"
							flexBasis="flex-start"
							paddingTop="0.1rem"
						>
							<Box onClick={handleRedeemMax} cursor="pointer">
								{redeemAmountLabel}
							</Box>
							<Text color="white" fontSize="sm" marginRight="2.75rem">
								{redeemSymbol}
							</Text>
						</Flex>
					</Flex>
				</TooltipWrapper>
			</Flex>
			<Flex
				bgColor="transparent"
				width={WIDTHS[breakpoint]}
				height="2.5rem"
				lineHeight="2.5rem"
				justify="space-between"
				padding="0 0 0 1rem"
			>
				<Text fontSize="md" color="bodytext" cursor="pointer">
					{outputVal ? outputVal.toFixed(8) : '--.--'}
				</Text>
				<Spacer />
				<CoinSelectorWithBalance
					allowedTokens={allowedTokens}
					balances={balances}
					except={[redeemSymbol]}
					amount={outputAmountLabel}
					onChange={onTokenChange}
					selected={outputSymbol}
					optionStyle={styles.option}
					disabled={disabled}
				/>
			</Flex>
			<Tooltip label={buttonTooltip} shouldWrapChildren>
				<Button disabled={!buttonEnabled} onClick={handleRedeem} isLoading={isBusy}>
					{buttonLabel}
				</Button>
			</Tooltip>
		</VStack>
	);
}
