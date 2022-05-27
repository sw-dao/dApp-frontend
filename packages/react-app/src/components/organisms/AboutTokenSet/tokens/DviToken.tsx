import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function DviToken({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>What is the SW DAO DeFi Value Index?</Heading>
				<Text>
					Looking for the best investment opportunities in the ever-growing world of DeFi? Look no
					further than the SW DAO DeFi Value Index. Our team of experts uses a variety of
					fundamental criteria to determine which crypto projects are undervalued, so you can be
					sure you're getting in on the ground floor of some major potential winners. We use a
					mixture of ratios and metrics like the price to earnings to determine which tokens are
					fundamentally undervalued by the public markets.
				</Text>
				<Text>
					By purchasing the DVI token you get one-click access to a diversified basket of assets
					with no hassle. Allowing you to enjoy the DeFi market's potential without having to worry
					about picking the right projects. Don't miss out on your chance to get ahead of the curve
					- check out our DeFi Value Index today!
				</Text>
				<Text></Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed
						embedId="vesaB-fnkSE"
						title="DeFi Value Index - Get in on the ground floor of some major potential winners!"
					/>
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Build an investment portfolio that will grow with the market.</ListItem>
					<ListItem>Invest in the most undervalued DeFi projects.</ListItem>
					<ListItem>Get access to a diversified portfolio of crypto assets.</ListItem>
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
