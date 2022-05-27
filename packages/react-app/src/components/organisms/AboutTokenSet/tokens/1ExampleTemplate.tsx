import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function ExampleToken({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>What is {details?.symbol}?</Heading>
				<Text></Text>
			</Box>,
			<Box>
				<Heading></Heading>
				<Text></Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="" title={`${details?.symbol} Token`} />
				</Center>
			</Box>,
			<Box>
				<Heading>Our Investment Process</Heading>
				<Text></Text>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem></ListItem>
					<ListItem></ListItem>
					<ListItem></ListItem>
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
