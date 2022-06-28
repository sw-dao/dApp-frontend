import { Box, Center, Heading, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { YoutubeEmbed } from '../../../atoms/YoutubeEmbed';
import { DynamicGrid } from '../../../molecules/DynamicGrid';
import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export function SwapToken({ details, data }: TokenDetailPane): JSX.Element {
	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>What is the SW Alpha Portfolio (SWAP)?</Heading>
				<Text>
					The SW Alpha Portfolio (SWAP) is our flagship strategy, leveraging both human intuition
					and machine-learning. Our automated systems are monitoring and evaluating movement in the
					crypto markets 24/7 and generate signals for our traders to act on.
				</Text>
				<Text>
					Capable of profiting in both Bull and Bear environments, this portfolio has historically
					outperformed ETH by a factor of ~1.4x.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed embedId="Vv-SO2VeMpk" title="SWAP Token" />
				</Center>
			</Box>,
			<Box>
				<Heading>What Exposure Will SWAP Have?</Heading>
				<Text>
					SWAP has the ability to allocate capital to any asset available on leading DEXs. This wide
					range of assets allows SWAP to invest early on in hot thematic trends via assets that have
					yet to be listed on CEXs, or in projects that are still up-and-coming. SWAP will
					additionally be able to fine-tune market exposure through the use of options, or leveraged
					positions, including shorts.
				</Text>
			</Box>,
			<Box>
				<Heading>Our Investment Process</Heading>
				<Text>
					Analysis of various crypto datasets, ranging from market, blockchain, and sentiment to
					fundamental data Development of a diverse set of short and long-term, alpha-generating
					strategies backed by machine learning as well as proprietary quantitative models Live test
					of strategies and selection of best performers through proven risk metrics Synthesis of
					strategies to a balanced portfolio with an additional AI-based portfolio and risk
					management layer
				</Text>
			</Box>,
			<Box>
				<Heading>How Is SWAP Price Calculated?</Heading>
				<Text>
					SWAP is a token that represents the performance of this managed portfolio. As SWAP
					represents a basket of underlying spot-held assets, the token price will be affected by
					movements in the underlying assets. However, since our strategies may include options or
					leveraged positions for hedging against downside or shorting the market, SWAP will also
					move independently of and historically outperforms a benchmark asset like ETH or BTC.
				</Text>
			</Box>,
			<Box>
				<Heading>Self Custody</Heading>
				<Text>
					Since all assets are held in self-custody by the user, there is no potential for SW DAO to
					‘rug pull’ the collateral that you have allocated into the SWAP asset pool.
				</Text>
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
