import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import NetworkIcon from './NetworkIcon';

interface NetworkProps {
	chainId: string;
	color: string;
	name: string;
	icon?: JSX.Element;
	hover?: any;
}

export default function Network(props: NetworkProps): JSX.Element {
	const { chainId, color, hover, name, icon } = props;
	const cleanName = name.split(' ')[0];

	return (
		<HStack spacing={0.25} cursor="pointer" color="whitish" fontWeight={300} _hover={hover}>
			<NetworkIcon network={chainId} color={color} width={18} height={18} />
			<Text>{cleanName}</Text>
			{icon && <Box pl="0.3rem">{icon}</Box>}
		</HStack>
	);
}
