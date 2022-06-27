import { Box, Center, Heading, List, ListItem, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function SwxToken({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>SW Index</Heading>
				<Text>
					SW Index is a tokenized index built on the Balancer protocol that holds SWD, USDC, Quantum
					Momentum Ethereum, and SW Yield Fund. The SWX token is the core asset used for liquidity
					provisions of the SWD token and is the asset used in bond sales. This token provides the
					best products that SW DAO has to offer all wrapped up into a single product.
				</Text>
				<List>
					<Heading>Curent Constituents</Heading>
					<ListItem>50% SWD Token</ListItem>
					<ListItem>20% USDC</ListItem>
					<ListItem>15% Quantum Momentum Ethereum</ListItem>
					<ListItem>15% SW Yield Fund</ListItem>
				</List>
			</Box>,
			<Box>
				<Center>
					<div>
						<Heading>Dividends & Voting</Heading>
						<Text>
							As a holder of the SW Index, you are eligible to receive a portion of the monthly
							dividend, as well as governance power at a 50% rate. This is because 50% of the SW
							Index is made up of SWD tokens, which entitles holders to 0.5x the standard dividend
							rate and 0.5x the standard governance power.
						</Text>
						<Text>
							Thus, by holding the SW Index, you can gain access to both financial returns and
							governance rights that are exclusive to SWD token holders. This makes the SW Index an
							attractive investment for those looking to participate in the growth of the SW DAO
							ecosystem and leverage our products.
						</Text>
					</div>
					{/* <YoutubeEmbed embedId="1hD85iKYNhM" title="Buy The Dip | SW DAO" /> */}
				</Center>
			</Box>,
			<Box>
				<Heading>Asset Inclusion</Heading>
				<Text>
					The SW index is currently composed of 50% SWD tokens, 30% SW DAO products, and 20%
					currency. This index composition is not expected to change any time soon. However, the
					founding team may make changes to the index composition in the future within the preset
					allocations established in SWIP-07.
				</Text>
				<Text>
					If such changes are made, ample notice will be provided to the community. Additionally,
					the percentage of currency in the index may decrease over time as liquidity is deepened.
					Such an increase in liquidity would mean that the currency pairs would no longer need to
					be included in the balancer pool at their current allocation percentage.
				</Text>
			</Box>,
			<Box></Box>,
			<Box>
				{/* <Center> */}
				{/* {' '}
					<FeeBox symbol={details?.symbol ?? '---'} details={details} data={data} /> */}
				<Heading>Fees</Heading>
				<Text>
					SW charges a fee of 2.50% per transaction to keep the index automatically rebalanced. This
					applies only when a transaction throws the Index balance off by {'>'} 2%.
				</Text>
				<Text>
					We also charge a spread fee of 1.00% for buying or selling our products. This fee is kept
					within the pool to deepen liquidity.{' '}
				</Text>
				<Text>The spread fee is waived for those who have {'>'} 500 SWD in their wallets.</Text>
				{/* </Center> */}
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
