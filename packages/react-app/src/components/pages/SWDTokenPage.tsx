import { Box, Center, Heading, Link, Text, VStack } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import { useQueryParams } from 'hookrouter';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
	breakpointState,
	extendedTokenDetailsState,
	periodState,
	tokenDetailsForCurrentPeriod,
} from '../../state';
import { ChartData, TokenDetails } from '../../types';
import AddToWalletButton from '../atoms/AddToWalletButton';
import { EtherscanLink } from '../atoms/EtherscanLink';
import RiskModal from '../atoms/RiskModal';
import { YoutubeEmbed } from '../atoms/YoutubeEmbed';
import { DynamicGrid } from '../molecules/DynamicGrid';
import { PriceAndDateHeader } from '../molecules/PriceAndDateHeader';
import { ProductDetailHeader } from '../molecules/ProductDetailHeader';
import { StyledGrid } from '../molecules/StyledGrid';
import { StyledSection } from '../molecules/StyledSection';
import { TokenDetailBox } from '../molecules/TokenDetailBox';
import FeeBox from '../organisms/AboutTokenSet/tokens/FeeBox';
import { ChartAndBuy } from '../organisms/ChartAndBuy';
import { FullHeightPage } from '../templates/FullHeightPage';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

const symbol = 'SWD';

export function SWDTokenPage(): JSX.Element {
	const [query, setQuery] = useQueryParams();
	const { period = '1Y' } = query;
	const [periodVal, setPeriodState] = useRecoilState(periodState);
	const detailMap = useRecoilValue(extendedTokenDetailsState);
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const tokenPrices = useRecoilValue(tokenDetailsForCurrentPeriod);
	const { chainId } = useWallet();
	const [prices, setPrices] = useState<ChartData>([]); // SWD prices
	const [product, setProduct] = useState<TokenDetails | null>(null);
	const breakpoint = useRecoilValue(breakpointState);

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
		if (tokenDetails) {
			const product = tokenDetails[symbol];
			if (product) {
				setPrices(product.prices);
			}
		}
	}, [period, prices, symbol, tokenDetails]);
	useEffect(() => {
		if (periodVal !== period) {
			setPeriodState(period);
		}
	}, [periodVal, period, setPeriodState]);

	const setPeriod = (p: string) => {
		setQuery({ ...query, period: p });
		setPeriodState(p);
	};

	const { currentPrice, marketCap, priceChange, volume, totalSupply } = useMemo(() => {
		if (!detailMap.SWD) {
			return {
				currentPrice: 0,
				marketCap: 0,
				priceChange: 0,
				volume: 0,
				totalSupply: 0,
			};
		}
		const product = detailMap.SWD;

		return {
			currentPrice: product.currentPrice,
			marketCap: currencyFormatter.format(product.marketCap),
			priceChange: product.changePercent1Day,
			volume: currencyFormatter.format(product.volume1Day),
			totalSupply: new Intl.NumberFormat('en-US').format(product.totalSupply),
		};
	}, [detailMap]);

	const change = useMemo(() => {
		if (prices.length > 0) {
			const cP = currentPrice;
			const p = parseFloat(prices[0][1]);
			console.log(symbol, cP, p);
			return ((cP - p) / p) * 100;
		}
		return priceChange || product?.changePercent1Day || 0;
	}, [product, currentPrice, prices]);

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

	const displayTokenAddress = useMemo(
		() =>
			chainId === '0x01'
				? '0x1fd154b4d0e3753b714b511a53fe1fb72dc7ae1c'
				: '0xaee24d5296444c007a532696aada9de5ce6cafd0',
		[chainId],
	);

	const panels: JSX.Element[] = useMemo(
		() => [
			<Box>
				<Heading>What Is The SWD Token?</Heading>
				<Text>
					SWD is the SW DAO's native ERC-20 token that aligns the DAO with its holders, enabling
					community-led ownership and governance. SWD is also a productive asset in that holders
					will be airdropped a portion of the revenue generated by the SW DAO product line.
				</Text>
				<Text>
					As of December 1st there are 341,041 tokens in circulation. There is a maximum supply of
					1M tokens with monthly buy and burns that decrease the supply regularly.
				</Text>
			</Box>,
			<Box>
				<Center>
					<YoutubeEmbed
						embedId="LT2Ka3wUyVg"
						title="the Benefits of SW DAO: Why You Need SWD Tokens in your Portfolio"
					/>
				</Center>
			</Box>,
			<Box>
				<Heading>Passive Income</Heading>
				<Text>
					Holding SWD entitles the bearer to a share of SW DAO's profits &mdash; airdropped straight
					to their wallets in USDC.
				</Text>
				<Text>
					Holding SWD for extended periods will increase your share of the monthly dividend pool.
					For every month after the first holding month, a multiplier of 0.1x is added to your share
					of the pool, capped at 2.0x.
				</Text>
			</Box>,
			<Box>
				<Heading>Governance</Heading>
				<Text>
					Have you ever wanted to be a board member of a fast-growing multi-million dollar
					organization? By owning SWD tokens you have the chance to become an active stakeholder in
					such a business. Through your ownership of SWD tokens, you are granted access to
					determining the expenditure of the SW DAO, determining what new products get built out,
					and so much more. Your time for helping build a business that both present and future
					generations can admire starts now!
				</Text>
			</Box>,
			<FeeBox symbol="SWD" data={tokenDetails.SWD} details={detailMap.SWD} />,
			<Box>
				<Heading>Get Involved</Heading>
				<Text className="short">
					Learn more about SW DAO and get involved here:&nbsp;
					<Link href="https://sw-dao.gitbook.io/sw-dao/">Gitbook</Link>&nbsp;???&nbsp;
					<Link href="http://dsc.gg/swdao">Discord</Link>&nbsp;???&nbsp;
					<Link href="https://twitter.com/SW__DAO">Twitter</Link>
				</Text>
				<Text className="short" textAlign="left">
					Track the latest on-chain activity:{' '}
					<EtherscanLink token={displayTokenAddress} maxLength={20} />
				</Text>
			</Box>,
		],
		[displayTokenAddress, detailMap, tokenDetails],
	);
	function AddToMetamaskButton() {
		return <AddToWalletButton address="0xaee24d5296444c007a532696aada9de5ce6cafd0" symbol="SWD" />;
	}
	return (
		<FullHeightPage pageKey="token">
			<Center>
				<StyledSection id="ProductDetails" section="body" marginBottom="3rem">
					<Box className="bodycontent">
						<VStack spacing="1rem" textAlign="left" align="left" margin="0 0 2rem 0.5rem">
							<Box display="flex" alignItems="center">
								<ProductDetailHeader
									icon="/images/token-swd.png"
									symbol="SWD"
									name="SW DAO Token"
									h="5rem"
								/>
								{breakpoint !== 'sm' && <AddToMetamaskButton />}
							</Box>
							<Box>
								<PriceAndDateHeader
									symbol={symbol}
									address={displayTokenAddress}
									price={currentPrice}
									change={change}
									date={Date.now()}
								/>
							</Box>
						</VStack>
						<VStack spacing="2rem" margin="0 auto">
							<ChartAndBuy symbol={symbol} handleDateChange={setPeriod} period={periodVal} />
							<StyledGrid
								cells={swdDetailCells}
								display="table"
								width="100%"
								className="swdabout"
							/>
							<Box color="bodytext">
								<DynamicGrid cells={panels} width="100%" />
							</Box>
						</VStack>
					</Box>
				</StyledSection>
			</Center>
			<title>SW DAO - SWD</title>
			<meta name="description" content="Buy SWD" />

			<meta property="og:url" content="https://app.swdao.org/" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content="SW DAO - SWD" />
			<meta property="og:description" content="Buy SWD" />
			<meta property="og:image" content="/images/meta/meta_SWD.png" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta property="twitter:domain" content="app.swdao.org" />
			<meta property="twitter:url" content="https://app.swdao.org/" />
			<meta name="twitter:title" content="SW DAO - SWD" />
			<meta name="twitter:description" content="Buy SWD" />
			<meta name="twitter:image" content="/images/meta/meta_SWD.png" />
		</FullHeightPage>
	);
}
