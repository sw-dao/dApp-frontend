import { Box, Text } from '@chakra-ui/react';
import { utils } from 'ethers';
import React from 'react';
import { TooltipProps } from 'recharts';

import { safeFixed } from '../../../utils/contracts';
import { MergedPrice, dateFormatter, looksLikeMilliseconds, timeFormatter } from './calculations';

export default function ChartToolTip(props: TooltipProps<any, any>): JSX.Element {
	const { active, payload } = props;
	if (!active || !payload || !payload[0]) {
		return <></>;
	}
	const { timestamp, coin, eth, btc, symbol }: MergedPrice = payload[0].payload;
	const ms = looksLikeMilliseconds(timestamp) ? timestamp : `${timestamp}000`;

	return (
		<Box
			color="#AADCFE"
			textAlign="right"
			marginTop="100px"
			width="180px"
			bgColor="#1D1055"
			border="1px solid #6053E5"
			padding="1rem"
			borderRadius="3px"
		>
			<Box>
				<Text fontSize="md" color="swdblue" d="inline-block" pr="0.5rem">
					{symbol}
				</Text>
				<Text fontSize="lg" color="white" fontWeight="700" d="inline-block">
					${utils.commify(safeFixed(coin, 2))}
				</Text>
			</Box>
			{btc > 0 && (
				<Box>
					<Text fontSize="md" color="btcorange" d="inline-block" pr="0.5rem">
						BTC
					</Text>
					<Text fontSize="lg" color="white" fontWeight="700" d="inline-block">
						${utils.commify(safeFixed(btc, 2))}
					</Text>
				</Box>
			)}
			{eth > 0 && (
				<Box>
					<Text fontSize="md" color="ethcolor" d="inline-block" pr="0.5rem">
						ETH
					</Text>
					<Text fontSize="lg" color="white" fontWeight="700" d="inline-block">
						${utils.commify(safeFixed(eth, 2))}
					</Text>
				</Box>
			)}
			<Text fontSize="sm">{dateFormatter(ms)}</Text>
			<Text fontSize="sm">{timeFormatter(ms)}</Text>
		</Box>
	);
}
