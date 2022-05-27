import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function DaTokens({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					When it comes to investments, you can't afford to take any chances. That's why
					Discretionary Alpha strategies are the perfect choice for those looking to beat the
					market. Our unique approach blends human intelligence with cutting-edge machine learning,
					resulting in outstanding returns that outperform the competition. And with our
					state-of-the-art risk management system, you can be sure your investments are safe and
					sound. So if you're looking for a market-beating investment strategy, look no further than
					Discretionary Alpha strategies.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="jM_g3KgkYJg" title="Discretionary Alpha Strategies | SW DAO" />
				</Center>
			</Box>,
			<Box>
				<Heading>Our Investment Process</Heading>
				<List>
					<ListItem>
						Analysis of various datasets, ranging from market, blockchain, and sentiment to
						fundamental data
					</ListItem>
					<ListItem>
						Trading actions made as a discretionary decision based on short and long-term,
						alpha-generating strategies backed by machine learning as well as proprietary
						quantitative models
					</ListItem>
					<ListItem>
						Machine Learning-based meta + risk model overlays decide on trade sizing and risk taken
					</ListItem>
				</List>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Invest in a cutting-edge system that outperforms the competition.</ListItem>
					<ListItem>Feel confident knowing your money is in good hands.</ListItem>
					<ListItem>Reduce risk with machine learning models.</ListItem>
				</List>
				<FeeBox symbol={details?.symbol ?? '---'} details={details} data={data} />,
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
