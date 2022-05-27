import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function MacroTokens({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					SW DAO's original Macro Trend strategy seeks to deliver significant capital appreciation
					through a long-short portfolio of strategies based on quantitative methods and Artificial
					Intelligence (AI). The strategy has a multi-year live track record of success, and we
					believe it can continue to deliver strong results for our clients.
				</Text>
				<Text>
					The strategy takes advantage of larger market trends by actively trading crypto. This
					allows us to capture profits while minimizing risk. Since the strategy is rooted in AI, it
					is able to adapt and evolve as the market changes.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="gIpx7UbkHoE" title={`${details?.symbol} Token`} />
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
						Development of a diverse set of short and long-term, alpha-generating strategies backed
						by machine learning as well as proprietary quantitative models
					</ListItem>
					<ListItem>
						Live test of strategies and selection of best performers through proven risk metrics
					</ListItem>
					<ListItem>
						Synthesis of strategies to a balanced portfolio with an additional AI-based portfolio
						and risk management layer
					</ListItem>
				</List>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Give your money a chance to grow while you sleep.</ListItem>
					<ListItem>
						Feel confident that you're in safe hands, with a strategy that's been tested and proven.
					</ListItem>
					<ListItem>AI-driven adaptability for changing markets</ListItem>
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
