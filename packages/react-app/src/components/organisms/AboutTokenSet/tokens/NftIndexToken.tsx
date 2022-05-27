import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function NftTokenIndex({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					SW DAO’s NFT Blue Chip Index provides investors with a low-cost, easy way to gain
					fractional exposure to some of the most popular NFT projects on the market. This index
					gives you instant diversification and peace of mind, as it consists of only the highest
					quality projects. With this product, you can confidently invest in the future of the NFT
					industry.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="OQoeZUxk4Do" title="NFT Blue Chip Index" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Get fractional exposure to some of the most popular NFT projects.</ListItem>
					<ListItem>Instant diversification and peace of mind.</ListItem>
					<ListItem>A low-cost way to invest in the NFT industry.</ListItem>
				</List>
			</Box>,
			<FeeBox symbol={details?.symbol ?? '---'} details={details} data={data} />,
		],
		[details, data],
	);

	return (
		<Box width="100%">
			<DynamicGrid cells={panels} width="100%" />
		</Box>
	);
}
