import { Box, BoxProps, Flex, Tooltip, useToast } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import { formatUnits } from 'ethers/lib/utils';
import React, { useCallback, useMemo } from 'react';

import { CoinBalances, Toaster, TokenSummaryInfoMap } from '../../types';
import { decimalsOf } from '../../utils/contracts';
import { CoinSelector } from '../atoms/CoinSelector';
import { handleMaxAndNotify } from './helpers';

type SelectorProps = Omit<BoxProps, 'onChange'> & {
	allowedTokens: TokenSummaryInfoMap;
	amount: JSX.Element;
	balances: CoinBalances;
	disabled: boolean;
	except: string[];
	onChange: (symbol: string) => void;
	onAmountChange?: (amount: string) => void;
	optionStyle: any;
	selected: string;
};

export default function CoinSelectorWithBalance(props: SelectorProps): JSX.Element {
	const {
		allowedTokens,
		amount,
		balances,
		disabled,
		except,
		onAmountChange,
		onChange,
		optionStyle,
		selected,
		...rest
	} = props;
	const toast: Toaster = useToast();
	const { isConnected } = useWallet();

	const shortAmount = useMemo(() => {
		if (!isConnected) {
			return 'Connect wallet to see balance';
		}

		return balances[selected]
			? `${formatUnits(balances[selected], decimalsOf(selected))} ${selected}`
			: 'retrieving balance...';
	}, [balances, isConnected, selected]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			onChange(e.target.value);
		},
		[onChange],
	);

	const handleMax = useCallback(() => {
		if (onAmountChange && !disabled) {
			handleMaxAndNotify(selected, balances, onAmountChange, toast);
		}
	}, [balances, disabled, onAmountChange, selected, toast]);

	return (
		<Flex
			flexDirection="column"
			lineHeight="1.1rem"
			flexBasis="flex-start"
			paddingTop="0.1rem"
			minWidth="6rem"
			{...rest}
		>
			<Box
				paddingLeft="1rem"
				onClick={handleMax}
				cursor={onAmountChange && !disabled ? 'pointer' : 'auto'}
			>
				<Tooltip label={shortAmount}>{amount}</Tooltip>
			</Box>
			<Box alignItems="left" textAlign="left" marginTop="-0.5rem">
				<CoinSelector
					allowedTokens={allowedTokens}
					except={except}
					onChange={handleChange}
					selected={selected}
					optionStyle={optionStyle}
				/>
			</Box>
		</Flex>
	);
}
