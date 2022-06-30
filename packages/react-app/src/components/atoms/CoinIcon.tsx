import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';

import { getTokenUrl } from '../../utils';

interface CoinIconProps {
	symbol: string;
	height?: string;
	src: string;
	verticalAlign?: string;
}

export function CoinIcon({ symbol, src, height = '1.8rem', ...rest }: CoinIconProps): JSX.Element {
	const props = {
		d: 'inline-block',
		height,
		pr: '.5rem',
		fontSize: '0.9rem',
		align: 'left center',
		verticalAlign: 'middle',
		...rest,
	};

	const found = getTokenUrl(symbol)[1];
	const label = `${symbol.toUpperCase()} logo`;

	if (found) {
		return <Image src={src} alt={label} {...props} />;
	} else {
		return (
			<Image src={src} alt={label} {...props} />
			// <Box {...props}>
			// 	<Box
			// 		backgroundImage={`url(${src})`}
			// 		backgroundRepeat="no-repeat"
			// 		backgroundSize="cover"
			// 		backgroundPosition="center"
			// 		width="4rem"
			// 		height="4rem"
			// 	>
			// 		<Box color="black" padding="0.5rem 0 0 1.25rem" fontSize="1rem" fontWeight={600}>
			// 			<Text transform="rotate(-45deg)">{label.slice(0, 1)}</Text>
			// 		</Box>
			// 	</Box>
			// </Box>
		);
	}
}
