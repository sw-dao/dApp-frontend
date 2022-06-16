import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

// < Embed https://www.youtube.com/watch?v=NbCayJdAR_c >
export function SwyfToken({ details, data }: TokenDetailPane): JSX.Element {
	let token = 'BTC';
	let name = 'Bitcoin';
	let usdc = false;
	if (details?.symbol === 'SWYF') {
		token = 'USDC';
		usdc = true;
	}
	if (details?.symbol === 'SWBYF') {
		token = 'BTC';
	}
	if (details?.symbol === 'SWEYF') {
		token = 'ETH';
		name = 'Ethereum';
	}
	if (details?.symbol === 'SWMYF') {
		token = 'MATIC';
		name = 'MATIC';
	}

	function TextByToken() {
		if (!usdc) {
			return (
				<Box>
					<Heading>Price Tied To {name}</Heading>
					<Text>
						The price of {details?.symbol ?? 'SWBYF'} is tied to the price of {name}. This means
						that if the price of {name} doubles, then the {details?.symbol ?? 'SWBYF'} price will
						also double plus the yield it generates.
					</Text>
					<Text>
						The downside is that if the price of {name} goes down, then so does the price of the{' '}
						{details?.symbol ?? 'SWBYF'}, but it will still perform better than spot {name} as it
						generates yield on top.
					</Text>
				</Box>
			);
		}
		return (
			<Box>
				<Heading>Features/Benefits</Heading>
				<List>
					<ListItem>Enjoy the peace of mind that comes with being smart about your money.</ListItem>
					<ListItem>Let us take the guesswork out of finding the best yield farms.</ListItem>
					<ListItem>Sleep easy at night knowing you're intelligently diversified.</ListItem>
				</List>
			</Box>
		);
	}
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>What is the SW Yield Fund?</Heading>
				<Text>
					The {token} Yield Fund intelligently analyzes the plethora of DeFi Yield Farms that exist
					in crypto today and intelligently allocates across them to mitigate risk while taking full
					advantage of the interest payments they generate.
					<b />
					The goal of the {token} Yield Fund is to generate more Bitcoin.
				</Text>
				<Text fontWeight={500}>
					That can be done by going into specific strategies that generate {token}, like staking it
					somewhere, or by putting up {token} as collateral and borrowing another token to do yield
					farming with.
				</Text>
				<Text>
					Then, once we have made profits, roll them back into {token} and repeat the cycle.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="NbCayJdAR_c" title={`${details?.symbol ?? 'SWYF'} token`} />
				</Center>
			</Box>,
			<TextByToken />,
			<Box>
				<Heading>Quarterly Lock-Up</Heading>
				<Text>
					The lock-up period for this fund is quarterly and it allows the managers to invest wisely
					without having too much capital required on an exchange at any given time. Capital can be
					withdrawn by investors on the last 3 days of every calendar quarter.
				</Text>
			</Box>,
			<Box>
				<FeeBox symbol={details?.symbol ?? 'SWYF'} details={details} data={data} />
			</Box>,
			<Box>
				<Heading>Risk Management</Heading>
				<List>
					<ListItem>Maximum of 25% to any single DeFi protocol</ListItem>
					<ListItem>
						Maximum directional market exposure of 25% but targets zero market exposure.
					</ListItem>
					<ListItem>
						All protocols that {details?.symbol ?? 'SWYF'} is providing liquidity for are
						investigated and code-reviewed by a team of DeFi developers and quantitative analysts.
					</ListItem>
					<ListItem>Protocol insurance through Nexus Mutual and InsurAce when available</ListItem>
				</List>
				{/* <Text>
					All protocols that {details?.symbol ?? 'SWYF'} is providing liquidity for are investigated
					and code-reviewed by a team of DeFi developers and quantitative analysts.
				</Text> */}
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
