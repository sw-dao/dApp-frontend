import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function MiTokens({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Looking to invest in the crypto market, but only while it’s hot? Look no further than the
					SW DAO Momentum Indices!
				</Text>
				<Text>
					The Momentum Indices will hold volatile crypto tokens when prices rise and automatically
					convert to stablecoins when prices are falling. This allows you to take advantage of the
					periods of explosive growth that crypto markets experience, and protect your capital when
					market conditions get rough.
				</Text>
				<Text>
					So whether you're looking for long-term growth or a quick return on investment, our
					Momentum Indices are perfect for you!
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="tIMkx6FL2ts" title="Momentum Indices | SW DAO" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Only be invested when prices are on the rise.</ListItem>
					<ListItem>Outperform the market by a wide margin.</ListItem>
					<ListItem>Enjoy the security of stablecoins when prices trend lower.</ListItem>
				</List>
				<FeeBox symbol={details?.symbol ?? '---'} details={details} data={data} />
			</Box>,
		],
		[details, data],
	);

	return (
		<Box width="100%">
			<DynamicGrid cells={panels} width="100%" />
		</Box>
	);
}
