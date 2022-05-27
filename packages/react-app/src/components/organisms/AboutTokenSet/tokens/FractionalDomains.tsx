import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function FractionalDomains({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Text>
					Are you interested in getting involved with Ethereum Name Services (ENS)? Then you need to
					check out SW DAO's Fractionalized Domains! With this unique service, you can share
					ownership of a domain name with other investors.
				</Text>
				<Text>
					This is a great way to get financial exposure to the world of Ethereum domain names
					without having to invest a lot of money.
				</Text>
				<Text>
					Fractionalized Domains is a new and exciting way to invest in the potential of ENS. By
					buying a piece of a domain name, you're investing in the future of this important
					technology. So don't miss out on this opportunity! Invest now in Fractionalized Domains
					from SW DAO.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="x_aHvbynb94" title="Fractionalized Domains | SW DAO" />
				</Center>
			</Box>,
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Be one of the first investors in this new and innovative technology.</ListItem>
					<ListItem>Get financial exposure to the world of Ethereum domain names.</ListItem>
					<ListItem>Investing is easy and affordable.</ListItem>
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
