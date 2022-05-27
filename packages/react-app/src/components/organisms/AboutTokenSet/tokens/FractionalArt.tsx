import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function FractionalArt({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>Welcome to SW DAO's Fractionalized Art!</Text>
				<Text>
					We are excited to offer investors access to some of the leading NFTs in the space with no
					minimum investment requirement. Whether you're an experienced collector or just getting
					started, there's something for everyone at SW DAO.
				</Text>
				<Text>
					Our fractionalized art products provide investors with a convenient and affordable way to
					get involved in the expanding world of NFTs. With a wide variety of digital art available,
					we are sure that you will find the perfect fit for your collection.
				</Text>
				<Text>
					So what are you waiting for? Discover the world of Fractionalized Art today with SW DAO!
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed
						embedId="ZiOYWjhTesE"
						title="Fractionalized Art - Get Involved in the Expanding World of NFTs | SW DAO"
					/>
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>An affordable way to get into the art market.</ListItem>
					<ListItem>Be a part of the new digital art movement.</ListItem>
					<ListItem>Build your perfect collection with ease.</ListItem>
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
