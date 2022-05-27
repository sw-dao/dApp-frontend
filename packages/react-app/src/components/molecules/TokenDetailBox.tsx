import { Text } from '@chakra-ui/react';
import React from 'react';

import { StyledBox, StyledBoxProps } from '../atoms/StyledBox';

type TokenDetailBoxProps = Omit<StyledBoxProps, 'children'> & {
	title: string;
	value: string;
	keyName: string;
};

export function TokenDetailBox({
	title,
	value,
	keyName,
	...rest
}: TokenDetailBoxProps): JSX.Element {
	return (
		<StyledBox
			title={title}
			key={keyName}
			bgColor="blue5"
			bgGradient=""
			textAlign="left"
			p="1rem 2rem 0.5rem"
			{...rest}
		>
			<Text color="highlight" fontSize="xl" fontWeight="bold">
				{value}
			</Text>
		</StyledBox>
	);
}
