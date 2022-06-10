import { Heading, VStack } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { PRODUCTS_BY_SYMBOL, isTokenset } from '../../../config/products';
import { breakpointState } from '../../../state';
import { AllocationTable } from '../../molecules/AllocationTable';
import UnknownToken from './tokens/UnknownToken';
import { AboutTokenSetProps } from './types';

/* --- For ratings section ---
import { ArrowLink } from '../../atoms/ArrowLink';
import { RatingsDiagram } from '../../atoms/RatingsDiagram';
import { TOKENSETS_RATINGS } from '../../../config';
 */

export const WIDTHS: Record<string, string> = {
	sm: '100%',
	md: '45%',
	lg: '45%',
	xl: '30%',
};
export const MARGINS: Record<string, string> = {
	sm: '1rem 0',
	md: '1rem',
	lg: '1rem',
	xl: '1rem',
};

export function AboutTokenSet(props: AboutTokenSetProps): JSX.Element {
	const { symbol, tokenData, tokenDetails, textAlign = 'left', ...rest } = props;
	const breakpoint = useRecoilValue(breakpointState);

	const [width, setWidth] = useState(WIDTHS.lg);
	const [margin, setMargin] = useState(MARGINS.lg);

	useEffect(() => {
		if (breakpoint && WIDTHS[breakpoint]) {
			const w = WIDTHS[breakpoint];
			const m = MARGINS[breakpoint];
			if (w !== width) {
				setWidth(w);
			}
			if (m !== margin) {
				setMargin(m);
			}
		}
	}, [breakpoint, margin, width]);

	/* --- calculate ratings ---
	const { buy = 0, sell = 0, hold = 0 } = TOKENSETS_RATINGS[symbol];
	const total = buy + sell + hold;
	const buyPercent = (buy / total) * 100;
	const sellPercent = (sell / total) * 100;
	const holdPercent = (hold / total) * 100;

	const allocTable = tokenData?.tokensetData?.length ? (
			<React.Fragment>
					<Heading mb="1rem" fontSize="1.6rem">
							Allocations
					</Heading>
					<AllocationTable allocations={tokenData.tokensetData} />
			</React.Fragment>
	) : null;
*/
	const TokenPane = useMemo(() => {
		const product = PRODUCTS_BY_SYMBOL[symbol];
		return product?.detail_pane || UnknownToken;
	}, [symbol]);

	const allocations = useMemo(
		() => (isTokenset(symbol) ? <AllocationTable symbol={symbol} /> : <> </>),
		[symbol],
	);

	/* --- Ratings section ---
					<Box>
							<HStack spacing="1rem">
									<VStack maxWidth="30%" textAlign="left" align="left">
											<Heading fontSize="1.6rem" mb="1rem" color="#fff">
													Ratings
											</Heading>
											<Text textAlign="justify" color="highlight">
													Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
													incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
													Risus commodo viverra maecenas accumsan lacus vel facilisis.
											</Text>
											<ArrowLink
													bgColor="highlight"
													color="black"
													label="&nbsp;Read more"
													href="/#"
													borderWidth="0"
													padding="0.2em 0.2em 0.2em 0.4em"
											/>
									</VStack>
									<RatingsDiagram
											width={300}
											height={300}
											buy={buyPercent}
											hold={holdPercent}
											sell={sellPercent}
											count={total}
									/>
							</HStack>
					</Box>
	*/
	return (
		<VStack
			className="about-token"
			spacing="2rem"
			align="left"
			textAlign={textAlign as any}
			{...rest}
			color="bodytext"
		>
			<Heading fontSize="1.5rem" textAlign="center">
				About {symbol}
			</Heading>
			{allocations}
			<TokenPane
				data={tokenData}
				details={tokenDetails}
				width={width}
				margin={margin}
				symbol={symbol}
			/>
		</VStack>
	);

	/*
	<HStack>
			<ProductDetailButton symbol={symbol} label="" />
			<Spacer />
	</HStack>
	*/
}
