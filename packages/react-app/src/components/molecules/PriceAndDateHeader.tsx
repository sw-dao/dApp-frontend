import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { DATE_FORMAT, DATE_FORMAT_WITH_TIME } from '../../config';
import { safeFixed } from '../../utils/contracts';
import AddToWalletButton from '../atoms/AddToWalletButton';
import { ChangeDisplay } from '../atoms/ChangeDisplay';

interface PriceAndDateHeaderProps {
	address?: string;
	change: number;
	date: number;
	height?: string;
	padding?: string;
	price: number;
	showTime?: boolean;
	showZero?: boolean;
	symbol: string;
}

export function PriceAndDateHeader(props: PriceAndDateHeaderProps): JSX.Element {
	const {
		address,
		change,
		date,
		price,
		showTime = false,
		showZero = true,
		symbol,
		...rest
	} = props;

	const dateFormat = showTime ? DATE_FORMAT_WITH_TIME : DATE_FORMAT;
	const formattedDate = new Date(date).toLocaleDateString(undefined, dateFormat);

	return (
		<Box textAlign="left" width="100%" className="precise" {...rest}>
			<Text color="#857AFD" fontSize="0.9rem">
				{formattedDate}
			</Text>
			<Flex direction="row" spacing="1rem" width="100%" pos="relative">
				<Text alignSelf="flex-end" color="white" fontSize="2rem">
					${safeFixed(price, 2)}
				</Text>
				{(change > 0 || change < 0 || showZero) && (
					<Box className={change > 0.0 ? 'change positive' : 'change negative'}>
						<ChangeDisplay change={change} />
					</Box>
				)}
				<AddToWalletButton address={address} symbol={symbol} />
			</Flex>
		</Box>
	);
}
