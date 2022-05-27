import { Box, SimpleGrid, Spinner } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import TokenDetail from './TokenDetail';
import { TokenDescriptionProps } from './types';

export default function TokenDescription({
	data,
	description,
	details,
}: TokenDescriptionProps): JSX.Element {
	const prices = useMemo(() => data?.prices || [], [data]);
	const [marketCap, volume1Day, totalSupply] = useMemo(() => {
		if (!details) {
			return [0, 0, 0];
		}
		return [details.marketCap, details.volume1Day, details.totalSupply];
	}, [details]);

	const dollarPrices = prices.map((p) => parseFloat(p[1]));
	const openPrice = dollarPrices.length > 0 ? dollarPrices[0] : 0;
	const low = Math.min(...dollarPrices);
	const high = Math.max(...dollarPrices);
	if (!data) {
		return <Spinner size="lg" />;
	}

	return (
		<Box color="bodytext">
			<Box textAlign="justify" color="bodytext" width="90%">
				{description}
			</Box>
			<SimpleGrid columns={4} spacingX="2rem" spacingY="2rem" mt="2rem">
				<TokenDetail label="Market Cap" isUSD={true} digits={0} value={marketCap} />
				<TokenDetail label="Total Supply" isUSD={false} digits={0} value={totalSupply} />
				<TokenDetail label="Low Today" isUSD={true} value={low} />
				<TokenDetail label="High Today" isUSD={true} value={high} />
				<TokenDetail label="Open Price" isUSD={true} value={openPrice} />
				<TokenDetail label="Volume" isUSD={true} digits={0} value={volume1Day} />
			</SimpleGrid>
		</Box>
	);
}
