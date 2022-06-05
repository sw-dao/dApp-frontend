import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { useQueryParams } from 'hookrouter';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useWindowSize } from '../../hooks/useWindowSize';
import { extendedTokenDetailsState, periodState, tokenDetailsForCurrentPeriod } from '../../state';
import { TokenDetails } from '../../types';
import { getOverriddenDetails } from '../../utils';
import { HoveringArrowLink } from '../molecules/HoveringArrowLink';
import { PriceAndDateHeader } from '../molecules/PriceAndDateHeader';
import { ProductDetailHeader } from '../molecules/ProductDetailHeader';
import { TokenDetailBox } from '../molecules/TokenDetailBox';
import { StyledGrid } from '../molecules/StyledGrid';
import { StyledSection } from '../molecules/StyledSection';
import { AboutTokenSet } from '../organisms/AboutTokenSet';
import { ChartAndBuy } from '../organisms/ChartAndBuy';
import { FullHeightPage } from '../templates/FullHeightPage';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

export function ProductDetailsPage({ symbol }: { symbol: string }): JSX.Element {
	const [query, setQuery] = useQueryParams();
	const { period = '1Y' } = query;
	const [periodVal, setPeriodState] = useRecoilState(periodState);
	const windowSize = useWindowSize();

	const tokenPrices = useRecoilValue(tokenDetailsForCurrentPeriod);
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const detailMap = useRecoilValue(extendedTokenDetailsState);

	const [product, setProduct] = useState<TokenDetails | null>(null);

	useEffect(() => {
		if (tokenPrices) {
			const sym = symbol.toUpperCase();
			const token = tokenPrices[sym];
			if (token) {
				setProduct(token);
			}
		}
	}, [tokenPrices, symbol, periodVal, tokenDetails]);

	useEffect(() => {
		if (periodVal !== period) {
			setPeriodState(period);
		}
	}, [periodVal, period, setPeriodState]);

	const setPeriod = (p: string) => {
		setQuery({ ...query, period: p });
		setPeriodState(p);
	};

	const { image: icon, name } = getOverriddenDetails(symbol);

	const { currentPrice, marketCap, priceChange, volume, totalSupply } = useMemo(() => {
		if (!detailMap[symbol]) {
			return {
				currentPrice: 0,
				marketCap: 0,
				priceChange: 0,
				volume: 0,
				totalSupply: 0,
			};
		}
		const product = detailMap[symbol];

		return {
			currentPrice: product.currentPrice,
			marketCap: currencyFormatter.format(product.marketCap),
			priceChange: product.changePercent1Day,
			volume: currencyFormatter.format(product.volume1Day),
			totalSupply: new Intl.NumberFormat('en-US').format(product.totalSupply),
		};
	}, [detailMap, symbol]);

	const extendedTokenDetails = useMemo(() => detailMap[symbol] || {}, [detailMap, symbol]);

	const ifWidth = useMemo(
		() =>
			(targetWidth: number, toReturn: any, otherwise: any = {}) => {
				const isWide = (windowSize?.width || 0) > targetWidth;
				return isWide ? toReturn : otherwise;
			},
		[windowSize],
	);

	const change = useMemo(() => product?.changePercent1Day || 0, [product]);

	const swdDetailCells = [
		<TokenDetailBox
			height="7rem"
			key="MCAP"
			keyName="mcap"
			title="Market Cap"
			value={marketCap.toString()}
		/>,
		<TokenDetailBox
			height="7rem"
			key="VOL"
			keyName="volume"
			title="24Hr Volume"
			value={volume.toString()}
		/>,
		<TokenDetailBox
			height="7rem"
			key="MAX_SUPPLY"
			keyName="supply"
			title="Max Supply"
			value={totalSupply.toString()}
		/>,
	];

	return (
		<FullHeightPage pageKey="details">
			<Center>
				<StyledSection id="ProductDetails" section="body" marginBottom="3rem">
					<Box className="bodycontent">
						<VStack spacing="1rem" textAlign="left" align="left" margin="0 0 2rem 0.5rem">
							<ProductDetailHeader symbol={symbol} icon={icon || ''} name={name || ''} h="5rem" />
							<PriceAndDateHeader
								symbol={symbol}
								address={product?.address}
								change={change}
								price={currentPrice}
								date={Date.now()}
								showZero={true}
							/>
						</VStack>
						<VStack spacing="2rem" margin="0 auto">
							<ChartAndBuy symbol={symbol} handleDateChange={setPeriod} period={periodVal} />
							<StyledGrid
								cells={swdDetailCells}
								display="table"
								width="100%"
								className="swdabout"
							/>
							<AboutTokenSet
								align="left"
								mt="3rem"
								symbol={symbol}
								textAlign="left"
								tokenData={product}
								tokenDetails={extendedTokenDetails}
								width="100%"
							/>
						</VStack>
					</Box>
				</StyledSection>
			</Center>
		</FullHeightPage>
	);
}
