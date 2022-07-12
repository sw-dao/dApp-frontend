import { Box, Heading, Tooltip, Image, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { PRODUCTS_BY_SYMBOL } from '../../../config/products';
import { tokenDetailsFor1Y } from '../../../state';
import { ExtendedTokenDetailsMap, TokenDetails } from '../../../types';
import { ChangeDisplay } from '../../atoms/ChangeDisplay';
import { CoinLabelCell } from '../../atoms/CoinLabelCell';

interface SuggestedProps {
	tokenDetails: ExtendedTokenDetailsMap;
}

export function Suggested(props: SuggestedProps): JSX.Element {
	const { tokenDetails } = props;
	const tokensYear = useRecoilValue(tokenDetailsFor1Y);
	const noData = <Tooltip label="Loading...">---</Tooltip>;
	let change = 0;
	let bgmChange = 0;
	let bgm = 'SWD';
	let newChange = 0;
	if (tokenDetails.SWD) {
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
	const clc = {
		height: '4rem',
		fontSize: '1.4rem',
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
	return (
		<Box display="flex" justifyContent="space-evenly" margin={'0 0 5rem 0'}>
			{/* Biggest Mover */}
			<a href="/product/SWMYF" className="suggested-box">
				<Text className="suggested-title">
					Biggest Mover <Image {...img} src="/images/biggest-mover.png" alt={`bgm icon`} />
				</Text>
				<Box className="suggested-clc">
					<CoinLabelCell
						icon={`/images/token-${bgm}.png`}
						symbol={bgm}
						name={PRODUCTS_BY_SYMBOL[bgm].name}
						url={`/product/${bgm}`}
						{...clc}
					/>
				</Box>
				<Text className="suggested-description">{PRODUCTS_BY_SYMBOL[bgm].description}</Text>
				<Box className="suggested-change">
					<Text paddingRight=".5rem">24h Change </Text>
					{isZero(bgmChange) ? noData : <ChangeDisplay change={bgmChange} />}
				</Box>
			</a>
			{/* Largest TVL */}
			<a href="/product/SWYF" className="suggested-box">
				<Text className="suggested-title">
					Largest TVL <Image {...img} src="/images/largest-tvl.png" alt={`tvl icon`} />
				</Text>
				<Box className="suggested-clc">
					<CoinLabelCell
						icon={'/images/token-SWYF.png'}
						symbol={'SWYF'}
						name={'USDC Yield Fund'}
						url={'/product/SWYF'}
						{...clc}
					/>
				</Box>
				<Text className="suggested-description">{PRODUCTS_BY_SYMBOL.SWYF.description}</Text>
				<Box className="suggested-change">
					<Text paddingRight=".5rem">1 Year Change: </Text>
					{isZero(change) ? noData : <ChangeDisplay change={change} />}
				</Box>
			</a>
			{/* NEW */}
			<a href="/product/QMM" className="suggested-box">
				<Text className="suggested-title">
					New <Image {...img} src="/images/new.png" alt={`new icon`} />
				</Text>
				<Box className="suggested-clc">
					<CoinLabelCell
						icon={'/images/token-QMM.png'}
						symbol={'QMM'}
						name={'Quantum Momentum MATIC'}
						url={'/product/QMM'}
						{...clc}
					/>
				</Box>
				<Text className="suggested-description">{PRODUCTS_BY_SYMBOL.QMM.description}</Text>
				<Box className="suggested-change">
					<Text paddingRight=".5rem">24h Change: </Text>
					{isZero(newChange) ? noData : <ChangeDisplay change={newChange} />}
				</Box>
			</a>
		</Box>
	);
}
