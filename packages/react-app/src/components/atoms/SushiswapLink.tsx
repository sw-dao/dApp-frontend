import { Box } from '@chakra-ui/react';
import { A } from 'hookrouter';
import React from 'react';
import { BiLinkExternal } from 'react-icons/bi';

interface SushiswapLinkProps {
	addresses: [string, string];
	marginLeft?: string;
	color?: string;
	fontSize?: string;
}

export function SushiswapLink({ addresses, ...rest }: SushiswapLinkProps): JSX.Element {
	const href = !addresses
		? '/#unknown_address'
		: `https://app.sushi.com/add/${addresses[0]}/${addresses[1]}`;

	return (
		<Box as={A} target="_blank" rel="noopener noreferrer" {...rest} href={href}>
			buy <Box as={BiLinkExternal} d="inline-block" verticalAlign="center" fontSize="0.8rem" />
		</Box>
	);
}
