import { Box, Flex, Image } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { getTokenUrl } from '../../utils';

interface ProductDetailHeaderProps {
	icon: string;
	symbol: string;
	name: string;
	h?: string;
}

export function ProductDetailHeader({
	icon,
	symbol,
	name,
	h = '2.5rem',
}: ProductDetailHeaderProps): JSX.Element {
	const src = useMemo(() => icon ?? getTokenUrl(symbol)[0], [icon, symbol]);

	return (
		<Flex
			margin="0"
			width="100%"
			textAlign="left"
			spacing="1rem"
			fontSize="2rem"
			verticalAlign="middle"
			flexWrap="nowrap"
			lineHeight={h}
		>
			<Image d="inline-block" src={src} alt={`${symbol} Icon`} h={h} ml="-0.8rem" />
			<Flex flexWrap="wrap">
				<Box pr="1rem" color="#fff" fontWeight={500}>
					{name}
				</Box>
				<Box fontWeight={500} color="#43A7FD">
					{symbol}
				</Box>
			</Flex>
		</Flex>
	);
}
