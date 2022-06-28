import { BtdTokens } from '../components/organisms/AboutTokenSet/tokens/BtdTokens';
import { DaTokens } from '../components/organisms/AboutTokenSet/tokens/DaTokens';
import { DviToken } from '../components/organisms/AboutTokenSet/tokens/DviToken';
import { FractionalArt } from '../components/organisms/AboutTokenSet/tokens/FractionalArt';
import { FractionalDomains } from '../components/organisms/AboutTokenSet/tokens/FractionalDomains';
import { MacroTokens } from '../components/organisms/AboutTokenSet/tokens/MacroTokens';
import { MiTokens } from '../components/organisms/AboutTokenSet/tokens/MiTokens';
import { NftCollections } from '../components/organisms/AboutTokenSet/tokens/NftCollections';
import { PeiToken } from '../components/organisms/AboutTokenSet/tokens/PeiToken';
import { QmTokens } from '../components/organisms/AboutTokenSet/tokens/QmTokens';
import { SwapToken } from '../components/organisms/AboutTokenSet/tokens/SwapToken';
//import { SwxToken } from '../components/organisms/AboutTokenSet/tokens/SwxToken';
import { SwyfToken } from '../components/organisms/AboutTokenSet/tokens/SwyfToken';
import { ProductSetupDescription } from '../types';

export const PRODUCTS: ProductSetupDescription[] = [
	{
		name: 'SW Governance',
		symbol: 'SWD',
		addresses: { '0x89': '0xaee24d5296444c007a532696aada9de5ce6cafd0' },
		is_tokenset: false,
		category: '',
		yearly_fee: '0',
	},
	{
		name: 'Alpha Portfolio',
		symbol: 'SWAP',
		addresses: { '0x89': '0x25ad32265c9354c29e145c902ae876f6b69806f2' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '2',
		detail_pane: SwapToken,
	},
	{
		name: 'Macro Trend BTC',
		symbol: 'MTBTC',
		addresses: { '0x89': '0x71b41b3b19aac53ca4063aec2d17fc3caeb38026' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '2',
		detail_pane: MacroTokens,
	},
	{
		name: 'Macro Trend ETH',
		symbol: 'MTETH',
		addresses: { '0x89': '0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '2',
		detail_pane: MacroTokens,
	},
	{
		name: 'Quantum Momentum BTC',
		symbol: 'QMB',
		addresses: { '0x89': '0xabcc2102065ba01c6df1a5a5a57158f452403b70' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '2',
		detail_pane: QmTokens,
	},
	{
		name: 'Quantum Momentum ETH',
		symbol: 'QME',
		addresses: { '0x89': '0x9984d846a3dc77aa0488f3758976b149e8475995' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '2',
		detail_pane: QmTokens,
	},
	// {
	// 	name: 'Quantum Momentum MATIC',
	// 	symbol: 'QMM',
	// 	addresses: { '0x89': '0x20ab4cb8f8da39582bc92da954ab1bb128f4e244' },
	// 	is_tokenset: true,
	// 	category: 'STRATEGIES',
	// 	yearly_fee: '2',
	// 	detail_pane: QmTokens,
	// },
	{
		name: 'Buy the Dip BTC',
		symbol: 'BTBTC',
		addresses: { '0x89': '0x58f7C5707Ba8E09B5e61ceBe8821f65434372344' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '1',
		detail_pane: BtdTokens,
	},
	{
		name: 'Buy the Dip ETH',
		symbol: 'BTETH',
		addresses: { '0x89': '0x07A79127182a1c303d11eCDa951310EC1C2E1444' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '1',
		detail_pane: BtdTokens,
	},
	{
		name: 'Buy the Dip MATIC',
		symbol: 'BTMAT',
		addresses: { '0x89': '0xb87352B4C3EB9daEd09cD4996dFf85c122394912' },
		is_tokenset: true,
		category: 'STRATEGIES',
		yearly_fee: '1',
		detail_pane: BtdTokens,
	},
	// {
	// 	name: 'Discretionary BTC',
	// 	symbol: 'DBTC',
	// 	addresses: { '0x89': '0xf2aa5ccea80c246a71e97b418173fcc956408d3f' },
	// 	is_tokenset: true,
	// 	category: 'STRATEGIES',
	// 	yearly_fee: '10',
	// 	detail_pane: DaTokens,
	// },
	// {
	// 	name: 'Discretionary ETH',
	// 	symbol: 'DETH',
	// 	addresses: { '0x89': '0x72b467cacbdbec5918d8eec0371ca33e6xfd42421' },
	// 	is_tokenset: true,
	// 	category: 'STRATEGIES',
	// 	yearly_fee: '10',
	// 	detail_pane: DaTokens,
	// },
	// {
	// 	name: 'Discretionary MATIC',
	// 	symbol: 'DMATI',
	// 	addresses: { '0x89': '0xab80a6e2909c8089ebd84f331c05bbefa3276cd2' },
	// 	is_tokenset: true,
	// 	category: 'STRATEGIES',
	// 	yearly_fee: '10',
	// 	detail_pane: DaTokens,
	// },
	// {
	// 	name: 'DeFi Value Index',
	// 	symbol: 'DVI',
	// 	addresses: { '0x89': '0x62135f85899d97aed95f4405d710208e68b99f39' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: DviToken,
	// },
	// {
	// 	name: 'BTC Momentum Index',
	// 	symbol: 'BMI',
	// 	addresses: { '0x89': '0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: MiTokens,
	// },
	// {
	// 	name: 'ETH Momentum Index',
	// 	symbol: 'EMI',
	// 	addresses: { '0x89': '0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: MiTokens,
	// },
	// {
	// 	name: 'MATIC Momentum Index',
	// 	symbol: 'MMI',
	// 	addresses: { '0x89': '0xDFdDd9811796F72bA32a031724f5B1403CD48B91' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: MiTokens,
	// },
	// {
	// 	name: 'DPI Momentum Index',
	// 	symbol: 'DMI',
	// 	addresses: { '0x89': '0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: MiTokens,
	// },
	// {
	// 	name: 'SWD Momentum Index',
	// 	symbol: 'SMI',
	// 	addresses: { '0x89': '0xad2b726fd2bd3a7f8f4b3929152438eba637ef19' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: MiTokens,
	// },
	/* {
		name: 'SW Index',
		symbol: 'SWX',
		addresses: { '0x89': '0x24ec3c300ff53b96937c39b686844db9e471421e' },
		is_tokenset: false,
		category: 'INDICES',
		yearly_fee: '0',
		detail_pane: SwxToken,
	}, */
	// {
	// 	name: 'Polygon Ecosystem Index',
	// 	symbol: 'PEI',
	// 	addresses: { '0x89': '0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff' },
	// 	is_tokenset: true,
	// 	category: 'INDICES',
	// 	yearly_fee: '3',
	// 	detail_pane: PeiToken,
	// },
	{
		name: 'USDC Yield Fund',
		symbol: 'SWYF',
		addresses: { '0x89': '0xdc8d88d9e57cc7be548f76e5e413c4838f953018' },
		is_tokenset: false,
		category: 'YIELD',
		yearly_fee: '30 performance',
		detail_pane: SwyfToken,
	},
	{
		name: 'BTC Yield Fund',
		symbol: 'SWBYF',
		addresses: { '0x89': '0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc' },
		is_tokenset: false,
		category: 'YIELD',
		yearly_fee: '30 performance',
		detail_pane: SwyfToken,
	},
	{
		name: 'ETH Yield Fund',
		symbol: 'SWEYF',
		addresses: { '0x89': '0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a' },
		is_tokenset: false,
		category: 'YIELD',
		yearly_fee: '30 performance',
		detail_pane: SwyfToken,
	},
	{
		name: 'MATIC Yield Fund',
		symbol: 'SWMYF',
		addresses: { '0x89': '0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6' },
		is_tokenset: false,
		category: 'YIELD',
		yearly_fee: '30 performance',
		detail_pane: SwyfToken,
	},
	// {
	// 	name: 'Pixelmon Kevins Index',
	// 	symbol: 'KEV',
	// 	addresses: { '0x89': '0x4315C720Cad5aa41D7535902b58B015EEA6F97B0' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: NftCollections,
	// },
	// {
	// 	name: 'Surf Dreamz Index',
	// 	symbol: 'SURF',
	// 	addresses: { '0x89': '0xb656D21E3BFa5Aed5405760b891BA539f4CEb976' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: NftCollections,
	// },
	// {
	// 	name: 'fomo.eth Domain',
	// 	symbol: 'FOMO',
	// 	addresses: { '0x89': '0x3c0744E72abb3A312122c2118F01F9EE2EB79d43' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: FractionalDomains,
	// },
	// {
	// 	name: 'A Horse',
	// 	symbol: 'HORSE',
	// 	addresses: { '0x89': '0x330FF0aFE63f42eb478c92dA79B0ce0c69070183' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: FractionalArt,
	// },
	// {
	// 	name: 'Eight of Swords',
	// 	symbol: 'EIGHT',
	// 	addresses: { '0x89': '0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: FractionalArt,
	// },
	// {
	// 	name: 'Chaos Orb Index',
	// 	symbol: 'CHAOS',
	// 	addresses: { '0x89': '0x9022A221F732df39d7Dc1c8556d52eb69303d9a3' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: FractionalArt,
	// },
	// {
	// 	name: 'Surf Spots Index',
	// 	symbol: 'SSPOTS',
	// 	addresses: { '0x89': '0x99Dd5231314005f26ce147E50F9BAC2365217fCe' },
	// 	is_tokenset: false,
	// 	category: 'NFTS',
	// 	yearly_fee: '2',
	// 	detail_pane: NftCollections,
	// },
];

export const PRODUCTS_BY_SYMBOL: Record<string, ProductSetupDescription> = {};
export const PRODUCTS_BY_CATEGORY: Record<string, ProductSetupDescription[]> = {};
export const KNOWN_TOKENS: string[] = [
	'BVI',
	'CVI',
	'DAI',
	'DPI',
	'DTI',
	'DVI',
	'EGI',
	'ETH',
	'MATIC',
	'STI',
	'SWAP',
	'SWD',
	'SWYF',
	'SWYD',
	'USDC',
	'USDT',
	'WBTC',
	'WMATIC',
	'WETH',
	...Object.keys(PRODUCTS_BY_SYMBOL),
];

KNOWN_TOKENS.sort();

PRODUCTS.forEach((p) => {
	if (p.category) {
		if (!PRODUCTS_BY_CATEGORY[p.category]) {
			PRODUCTS_BY_CATEGORY[p.category] = [];
		}
		PRODUCTS_BY_CATEGORY[p.category].push(p);
	}
	PRODUCTS_BY_SYMBOL[p.symbol] = p;
});

export function isTokenset(symbol: string): boolean {
	return PRODUCTS_BY_SYMBOL[symbol].is_tokenset;
}

export function isYieldFund(symbol: string) {
	return PRODUCTS_BY_SYMBOL[symbol].category === 'YIELD';
}
