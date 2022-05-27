import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function BtdTokens({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Buy The Dip tokens are the perfect tool for long-term investors who want to capitalize on
					price dips in the volatile crypto market.
				</Text>
				<Text>
					With Buy The Dip tokens, our smart contracts will automatically convert the aggregated
					pool of stablecoins into your favorite volatile crypto token when the price has dipped
					below a pre-defined threshold.
				</Text>
				<Text>
					This allows you to take advantage of lower prices and build your portfolio with ease.
					Never miss out on opportunities to buy your favorite tokens at a discount with Buy The Dip
					strategies!
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="1hD85iKYNhM" title="Buy The Dip | SW DAO" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Never miss out on opportunities to buy crypto at lower prices.</ListItem>
					<ListItem>Build your portfolio with ease.</ListItem>
					<ListItem>
						Don't worry about trying to keep up with price movements throughout the day.
					</ListItem>
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
