import { Box, Heading, Tooltip, Image, Text, Spinner } from '@chakra-ui/react';
import Slider from 'react-slick';
import { useRecoilValue } from 'recoil';
import { PRODUCTS_BY_SYMBOL } from '../../../config/products';
import { breakpointState, tokenDetailsFor1Y } from '../../../state';
import { ExtendedTokenDetailsMap, TokenDetails } from '../../../types';
import { ChangeDisplay } from '../../atoms/ChangeDisplay';
import { CoinLabelCell } from '../../atoms/CoinLabelCell';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { string } from 'prop-types';
interface SuggestedProps {
	tokenDetails: ExtendedTokenDetailsMap;
}

export default function Suggested(props: SuggestedProps): JSX.Element {
	const { tokenDetails } = props;
	const tokensYear = useRecoilValue(tokenDetailsFor1Y);
	const breakpoint = useRecoilValue(breakpointState);
	const noData = <Tooltip label="Loading...">---</Tooltip>;
	let change = 0;
	let bgmChange = 0;
	let bgm = '';
	let newChange = 0;
	if (tokenDetails && tokenDetails.SWD) {
		newChange = tokenDetails.QMM.changePercent1Day;
		for (const symbol in tokenDetails) {
			const c = tokenDetails[symbol].changePercent1Day;
			if (bgmChange) {
				if (bgmChange < c) {
					bgm = symbol;
					bgmChange = c;
				}
			} else {
				bgm = symbol;
				bgmChange = c;
			}
		}
		if (tokensYear.SWYF) {
			const sym = tokensYear.SWYF;
			const cP = tokenDetails.SWYF.currentPrice;
			const p = parseFloat(sym.prices[0][1]);
			change = ((cP - p) / p) * 100;
		}
	}
	const isZero = (input: string | number) => {
		if (input == 0 || input == '0.0') {
			return true;
		}
		return false;
	};
	const titleFont: Record<string, string> = {
		sm: '5vw',
		md: '1.5vw',
		lg: '1.5vw',
		xl: '1.5vw',
	};
	const clcHeight: Record<string, string> = {
		sm: '4rem',
		md: '2rem',
		lg: '3rem',
		xl: '3rem',
	};
	const boxHeight: Record<string, string> = {
		sm: '7em',
		md: '11em',
		lg: '10em',
		xl: '7em',
	};
	const titleFontSize: Record<string, string> = {
		sm: '2rem',
		md: '1.5rem',
		lg: '2rem',
		xl: '2rem',
	};
	const clc = {
		height: clcHeight[breakpoint],
		fontSize: titleFont[breakpoint],
		color: 'white',
		linkCell: true,
		hideSymbol: true,
	};
	const img = {
		d: 'inline-block',
		height: '1.5rem',
		width: '1.5rem',
		fontSize: '0.3rem',
		// align: 'right',
	};

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 850,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: false,
				},
			},
		],
	};

	return (
		<Box>
			<Slider {...settings}>
				{/* Best Performer */}
				{!tokenDetails.SWD ? (
					<Box className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Best Performer <Image {...img} src="/images/biggest-mover.png" alt={`bgm icon`} />
						</Text>
						<Spinner size="xl" margin="4rem auto" color="#2089fd" />
					</Box>
				) : (
					<a href={`/product/${bgm}`} className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Best Performer <Image {...img} src="/images/biggest-mover.png" alt={`bgm icon`} />
						</Text>

						<Box className="suggested-clc suggested-flex">
							<CoinLabelCell
								icon={`/images/token-${bgm.toLowerCase()}.png`}
								symbol={bgm}
								name={PRODUCTS_BY_SYMBOL[bgm].name}
								url={`/product/${bgm}`}
								{...clc}
							/>
						</Box>
						<Text className="suggested-description" height={boxHeight[breakpoint]}>
							{PRODUCTS_BY_SYMBOL[bgm].description}
						</Text>
						<Box className="suggested-change suggested-flex">
							<Text paddingRight=".5rem">24h Change </Text>
							{isZero(bgmChange) ? noData : <ChangeDisplay change={bgmChange} />}
						</Box>
					</a>
				)}
				{/* Largest TVL */}
				{!tokenDetails.SWD ? (
					<Box className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Largest TVL <Image {...img} src="/images/largest-tvl.png" alt={`tvl icon`} />
						</Text>
						<Spinner size="xl" margin="4rem auto" color="#2089fd" />
					</Box>
				) : (
					<a href="/product/SWYF" className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Largest TVL <Image {...img} src="/images/largest-tvl.png" alt={`tvl icon`} />
						</Text>
						<Box className="suggested-clc suggested-flex">
							<CoinLabelCell
								icon={'/images/token-swyf.png'}
								symbol={'SWYF'}
								name={'USDC Yield Fund'}
								url={'/product/SWYF'}
								{...clc}
							/>
						</Box>
						<Text className="suggested-description" height={boxHeight[breakpoint]}>
							{PRODUCTS_BY_SYMBOL.SWYF.description}
						</Text>
						<Box className="suggested-change suggested-flex">
							<Text paddingRight=".5rem">1 Year Change: </Text>
							{isZero(change) ? noData : <ChangeDisplay change={change} />}
						</Box>
					</a>
				)}
				{/* NEW */}
				{!tokenDetails.SWD ? (
					<Box className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Newest <Image {...img} src="/images/new.png" alt={`new icon`} />
						</Text>
						<Spinner size="xl" margin="4rem auto" color="#2089fd" />
					</Box>
				) : (
					<a href="/product/QMM" className="suggested-box">
						<Text className="suggested-title suggested-flex" fontSize={titleFontSize[breakpoint]}>
							Newest <Image {...img} src="/images/new.png" alt={`new icon`} />
						</Text>
						<Box className="suggested-clc suggested-flex">
							<CoinLabelCell
								icon={'/images/token-qmm.png'}
								symbol={'QMM'}
								name={'Quantum Momentum MATIC'}
								url={'/product/QMM'}
								{...clc}
							/>
						</Box>
						<Text className="suggested-description" height={boxHeight[breakpoint]}>
							{PRODUCTS_BY_SYMBOL.QMM.description}
						</Text>
						<Box className="suggested-change suggested-flex">
							<Text paddingRight=".5rem">24h Change: </Text>
							{isZero(newChange) ? noData : <ChangeDisplay change={newChange} />}
						</Box>
					</a>
				)}
			</Slider>
		</Box>
	);
}
