import { Box, HStack } from '@chakra-ui/react';
import React from 'react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

type ChangeDisplayProps = {
	change: number | null | undefined;
	m?: string;
};

export function ChangeDisplay({ change, m }: ChangeDisplayProps): JSX.Element {
	if (change === null || change === undefined) {
		return <></>;
	}

	const Icon = change > 0 ? AiFillCaretUp : AiFillCaretDown;
	let color = 'gray.500';
	if (change > 0) {
		color = '#05ee58';
	} else if (change < 0) {
		color = 'red.500';
	}

	const formattedChange = change < 0 ? `- ${Math.abs(change).toFixed(2)}` : change.toFixed(2);

	return (
		<HStack color={color} spacing="0.5rem" m={m}>
			<Box className="nobreak">{formattedChange}%</Box>
			{change !== 0 && <Box as={Icon} />}
		</HStack>
	);
}
