import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function NftCollections({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Looking to invest in the latest and greatest art trends? Look no further than SW DAO's
					Collection Indices. Our basket of NFTs from a single artist's collection allows investors
					to profit from the overall success of an artist's unique works.
				</Text>
				<Text>
					Whether you're looking for a quick and easy way to get into the art market or want to ride
					the wave of an upcoming artist, our indices are perfect for you.
				</Text>
				<Text>
					Holding a Collection Index token will give you fractionalized ownership of several pieces
					of digital artwork - all while receiving stability and liquidity through our built-in
					exchange.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="ZiOYWjhTesE" title="Fractionalized NFTs | SW DAO" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Ride the wave of an upcoming artist.</ListItem>
					<ListItem>Get access to high-quality artwork at an affordable price.</ListItem>
					<ListItem>Be a part of something new and exciting.</ListItem>
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
