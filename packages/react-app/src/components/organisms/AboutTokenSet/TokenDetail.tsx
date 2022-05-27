import { Box, Heading, Text } from '@chakra-ui/react';
import { utils } from 'ethers';
import React from 'react';

import { safeFixed } from '../../../utils/contracts';

interface DetailProps {
	label: string;
	value: number;
	isUSD: boolean;
	digits?: number;
}

export default function Detail({ label, value, isUSD, digits = 2 }: DetailProps): JSX.Element {
	if (!value || isNaN(value)) {
		return <></>;
	}
	let showVal: string;
	if (isUSD) {
		let fixed = safeFixed(value, digits);
		if (digits === 0) {
			fixed = fixed.split('.')[0];
		}
		try {
			showVal = utils.commify(fixed);
		} catch {
			showVal = fixed;
		}
		showVal = `USD $ ${showVal}`;
	} else {
		showVal = safeFixed(value, 8);
	}
	if (showVal.indexOf('Infinity') !== -1) {
		return <></>;
	}
	return (
		<Box>
			<Heading fontSize="1rem" pb="0.2rem">
				{label}
			</Heading>
			<Text>{showVal}</Text>
		</Box>
	);
}
