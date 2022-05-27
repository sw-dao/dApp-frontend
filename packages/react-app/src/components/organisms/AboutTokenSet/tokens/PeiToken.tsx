import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function PeiToken({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Polygon is a cutting-edge ecosystem that's quickly becoming the go-to destination for
					innovative projects. If you're looking to invest in the Polygon network's growth
					potential, SW DAO's Polygon Ecosystem Index is the perfect option. Our index offers
					instant exposure to a basket of assets that represent the best of this innovative
					ecosystem &emdash; so you can reap the rewards as they grow!
				</Text>
				<Text>
					The Polygon Ecosystem Index is a valuable resource for anyone looking to invest in
					blockchain innovation.
				</Text>
				<Text>
					By tracking the price of key projects built on top of the Polygon network, this index
					provides a snapshot of the growth potential available in this exciting ecosystem. So if
					you're looking for an easy way to get exposure to some of the most promising blockchain
					projects around, look no further.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="6dclpf1plLI" title="Polygon Ecosystem Index" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>
						Get exposure to the latest and greatest projects being built on Polygon.
					</ListItem>
					<ListItem>Invest in a diverse portfolio of blockchain projects.</ListItem>
					<ListItem>
						Exposure to innovative projects without having to do all the research yourself.
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
