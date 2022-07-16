import { ButtonStyleProps } from './types';

export const BUTTON_STYLES: ButtonStyleProps = {
	NFTS: {
		label: 'NFT',
		image: '/images/gem-nfts.png',
		imageHeight: '3.2rem',
		imageTop: '-0.5rem',
		active: {
			color: '#8EC7D2',
			bgColor: '#301FA0',
			borderColor: 'transparent',
		},
		inactive: {
			color: 'alttext',
			bgColor: 'transparent',
			borderColor: 'alttext',
		},
	},
	STRATEGIES: {
		label: 'Strategies',
		image: '/images/green-gem.png',
		active: {
			color: '#301FA0',
			bgColor: '#FFCC50',
			borderColor: 'transparent',
		},
		inactive: {
			color: 'alttext',
			bgColor: 'blue7',
			borderColor: 'alttext',
		},
	},
	INDICES: {
		label: 'Indices',
		image: '/images/purple-gem.png',
		active: {
			color: '#E24EFF',
			bgColor: '#301FA0',
			borderColor: 'transparent',
		},
		inactive: {
			color: 'alttext',
			bgColor: 'transparent',
			borderColor: 'alttext',
		},
	},
	YIELD: {
		label: 'Yield',
		image: '/images/token-swyf.png',
		imageHeight: '3.1rem',
		imageTop: '-0.5rem',
		active: {
			color: '#301FA0',
			bgColor: '#43A047',
			borderColor: 'transparent',
		},
		inactive: {
			color: 'alttext',
			bgColor: 'blue7',
			borderColor: 'alttext',
		},
	},
	ALL: {
		label: 'All',
		image: '/images/blue-gem.png',
		active: {
			color: '#301FA0',
			bgColor: '#23CBFF',
			borderColor: 'transparent',
		},
		inactive: {
			color: 'alttext',
			bgColor: 'blue7',
			borderColor: 'alttext',
		},
	},
};
