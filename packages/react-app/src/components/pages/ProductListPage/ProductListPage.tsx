import { Box, Center } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import { useQueryParams } from 'hookrouter';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { DEFAULT_CHAIN_ID } from '../../../config';
import { PRODUCTS, PRODUCTS_BY_CATEGORY } from '../../../config/products';
import {
	extendedTokenDetailsState,
	periodState,
	tokenDetailsForCurrentPeriod,
} from '../../../state';
import { ProductSetupDescription, TokenDetails } from '../../../types';
import { HoveringArrowLink } from '../../molecules/HoveringArrowLink';
import { StyledSection } from '../../molecules/StyledSection';
import { TokenPriceTable } from '../../molecules/TokenPriceTable/TokenPriceTable';
import { FullHeightPage } from '../../templates/FullHeightPage';
import ProductListHeader from './ProductListHeader';

function fakeTokenDetails(product: ProductSetupDescription, chainId: string): TokenDetails {
	return {
		symbol: product.symbol,
		address: product.addresses[chainId],
		marketCap: 0,
		volume1Day: 0,
		totalSupply: 0,
		currentPrice: 0,
		changePercent1Day: 0,
		prices: [],
		isFake: false,
	};
}

export function ProductListPage(): JSX.Element {
	const [query, setQuery] = useQueryParams();
	const { filter = '', period = '1Y', sort = 'name' } = query;
	const tokenPriceDetail = useRecoilValue(tokenDetailsForCurrentPeriod);
	const detailMap = useRecoilValue(extendedTokenDetailsState);
	const { chainId } = useWallet();

	const [periodVal, setPeriodState] = useRecoilState(periodState);

	const loading = useMemo(
		() => !tokenPriceDetail || Object.values(tokenPriceDetail).length === 0,
		[tokenPriceDetail],
	);

	const setFilter = useCallback(
		(filter: string) => {
			setQuery({ ...query, filter });
		},
		[query, setQuery],
	);

	const setPeriod = useCallback(
		(p: string) => {
			setQuery({ ...query, period: p });
			setPeriodState(p);
		},
		[query, setQuery, setPeriodState],
	);

	const setSort = useCallback(
		(s: string) => {
			setQuery({ ...query, sort: s });
		},
		[setQuery, query],
	);

	useEffect(() => {
		if (periodVal !== period) {
			setPeriodState(period);
		}
	}, [periodVal, period, setPeriodState]);

	const filteredTokens = useMemo(() => {
		const cId = chainId || DEFAULT_CHAIN_ID;
		const allProducts =
			!filter || filter === 'ALL'
				? PRODUCTS_BY_CATEGORY['STRATEGIES']
				: PRODUCTS_BY_CATEGORY[filter];
		const rv = allProducts.map(
			(product) => tokenPriceDetail[product.symbol] ?? fakeTokenDetails(product, cId),
		);
		console.log(`filteredTokens: ${rv.length}`, rv);
		return rv;
	}, [chainId, filter, tokenPriceDetail]);

	return (
		<FullHeightPage pageKey="products">
			<Center id="productlist">
				<StyledSection section="body">
					<Box className="bodycontent">
						<Box margin="0 auto">
							<TokenPriceTable
								priceDetails={filteredTokens}
								loading={loading}
								period={period}
								tokenDetails={detailMap}
								sort={sort}
								onSort={setSort}
							>
								<ProductListHeader
									filter={filter}
									onFilterChange={setFilter}
									period={period}
									onPeriodChange={setPeriod}
								/>
							</TokenPriceTable>
						</Box>
					</Box>
				</StyledSection>
			</Center>
		</FullHeightPage>
	);
}
