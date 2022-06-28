import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function QmTokens({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Looking to generate alpha and reduce risk at the same time? Quantum Momentum is your
					solution. This high-frequency momentum-based strategy employs machine learning to seek out
					the strongest risk-adjusted returns. It can be used as a standalone investment or combined
					with our other market-beating strategies for maximum performance. So if you're looking for
					reliable alpha generation and strong risk-adjusted returns, look no further than Quantum
					Momentum.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="df1NM6HfVPI" title="Quantum Momentum Tokens | SW DAO" />
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
				</List>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>
						Sleep better knowing you're making smart investment decisions with a proven track
						record.
					</ListItem>
					<ListItem>
						Get a high level of alpha generation and strong risk-adjusted returns.
					</ListItem>
					<ListItem>Take back control of your money from Wall Street and the big banks.</ListItem>
				</List>
			</Box>,
			<Box>
				<Center>
					{' '}
					<FeeBox symbol={details?.symbol ?? '---'} details={details} data={data} />
				</Center>
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
