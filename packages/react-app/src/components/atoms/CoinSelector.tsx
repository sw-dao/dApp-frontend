import { Select } from '@chakra-ui/react';
import React, { ChangeEventHandler, useMemo } from 'react';

import { TRADING_TOKENS } from '../../config';
import { TokenSummaryInfoMap } from '../../types';

interface CoinSelectorProps {
	selected: string;
	onChange: ChangeEventHandler<HTMLSelectElement>;
	except: string[];
	allowedTokens: TokenSummaryInfoMap;
	optionStyle: any;
}

export function CoinSelector(props: CoinSelectorProps): JSX.Element {
	const { selected, onChange, except, allowedTokens, optionStyle } = props;

	const coinOptions = useMemo(() => {
		if (!allowedTokens) {
			return [];
		}
		const keys = Object.keys(allowedTokens);
		keys.sort();
		return keys
			.filter((symbol) => TRADING_TOKENS.includes(symbol) && !except.includes(symbol))
			.map((symbol) => (
				<option style={optionStyle} key={symbol} value={symbol}>
					{symbol}
				</option>
			));
	}, [allowedTokens, except, optionStyle]);

	return (
		<Select
			id="coin-selector"
			color="white"
			bgColor="transparent"
			_hover={{ bgColor: 'transparent' }}
			variant="filled"
			width="auto"
			border="0"
			fontSize="0.8rem"
			onChange={onChange}
			value={selected}
			zIndex={1}
		>
			{coinOptions}
		</Select>
	);
}
