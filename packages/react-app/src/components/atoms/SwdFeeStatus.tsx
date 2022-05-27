import { Box, Tooltip } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';

import { swdBalanceState } from '../../state';

export function SwdFeeStatus(): JSX.Element {
	const swdBalance = useRecoilValue(swdBalanceState);
	const { isConnected } = useWallet();

	let message, label;
	if (isConnected) {
		if (swdBalance.gt(500)) {
			message = 'This trade is fee free.';
			label =
				"We pay your trade fees since you have at least 500 SWD in your wallet. Note: you'll still have to pay gas fees.";
		} else {
			message = (
				<>
					See how this trade
					<br />
					could be fee free.
				</>
			);
			label =
				"We pay for trading fees if you have 500 SWD in your wallet. Note: you'll still have to pay gas fees.";
		}
	} else {
		message = (
			<>
				Connect your wallet to check
				<br />
				that your trade is fee free
			</>
		);
		label =
			"We pay for trading fees if you have 500 SWD in your wallet. Note: you'll still have to pay gas fees.";
	}

	return (
		<Box color="bodytext" fontSize="0.8rem" width="80%" position="relative">
			{message}
			<Box d="inline-block" ml="0.4rem">
				<Tooltip label={label}>
					<span>
						<AiOutlineQuestionCircle />
					</span>
				</Tooltip>
			</Box>
		</Box>
	);
}
