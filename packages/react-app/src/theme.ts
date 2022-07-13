import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { browserName } from 'react-device-detect';

import { UI_BREAKPOINTS } from './config';

const config = {
	breakpoints: createBreakpoints({
		sm: `${UI_BREAKPOINTS.sm}px`,
		md: `${UI_BREAKPOINTS.md}px`,
		lg: `${UI_BREAKPOINTS.lg}px`,
		xl: `${UI_BREAKPOINTS.xl}px`,
	}),
	colors: {
		primary: {
			50: '#ece9ff',
			100: '#c6bef5',
			200: '#a394eb',
			300: '#836ae2',
			400: '#653fd8',
			500: '#5027bf',
			600: '#421d95',
			700: '#29156c',
			800: '#140c42',
			900: '#06021b',
		},
		accent: '#bde5fe',
		bodytext: '#AADCFE',
		tableheader: '#7077fe',
		alttext: '#5E69FF',
		highlight: '#c34aff',
		bodydark: '#0d0029',
		shadowsOutline: '', // more removing that blue outline
		lightline: '#120046',
		ethcolor: '#66A236',
		ethblue: '#00A2FF',
		btcorange: '#F7931A',
		swdblue: '#43a7fd',
		purple: '#857AFD',
		blue5: '#1D1055',
		blue7: '#150637',
		sunsetblue: '#3861F7',
		whitish: '#FCFCFC',
		page: {
			button: '#DE2DFF',
			bg: '#070019',
		},
	},
	components: {
		Button: {
			baseStyle: {
				fontWeight: 'bold',
				borderRadius: '2em',
				backgroundColor: 'blue',
				borderWidth: '0',
			},
			sizes: {
				sm: {
					fontSize: 'sm',
					px: 3,
					py: 2,
				},
				md: {
					fontSize: 'md',
					px: 5,
					py: 3,
				},
			},
			variants: {
				primary: {
					color: 'white',
					border: '2px solid #755df2',
					bgGradient: 'linear(to-b,#1f8cfd,#7200e6)',
					_hover: {
						bgGradient: 'linear(to-b,#a9dcfe,#3e86fd)',
						borderColor: 'accent',
					},
				},
				connected: {
					color: 'white',
					border: '2px solid #6333b1',
					bgGradient: 'linear(to-b,#3d009f,#8307ee)',
				},
				secondary: {
					color: '#96BFE5',
					backgroundColor: 'lightline',
				},
			},
			defaultProps: {
				size: 'md',
				variant: 'primary',
			},
			Text: {
				variants: {
					body: {
						color: 'bodytext',
					},
				},
			},
		},
		Input: {
			parts: ['field'],
			baseStyle: {
				field: {
					color: 'blue.400',
				},
			},
			defaultProps: {
				variant: 'unstyled',
			},
		},
	},
	fonts: {
		heading: 'Kumbh Sans',
		body: 'Jost',
	},
	initialColorMode: 'dark',
	useSystemColorMode: false,
	styles: {
		global: () => ({
			html: {
				backgroundColor: '#070019',
				overflowX: 'hidden',
			},
			body: {
				backgroundColor: '#070019',
				backgroundPosition: 'top left',
				backgroundRepeat: 'repeat-x',
				marginRight: '0 !important',
				overflowX: 'hidden',
				position: 'relative',
				width: '100vw',
			},
			'.sm, .md': {
				'.border-thicken': {
					borderWidth: '1px',
				},
				'.dynamic-grid h2, h2, .swdabout p': {
					textAlign: 'center',
				},
				'.pagecontent': {
					marginTop: '-2rem',
				},
			},
			'.lg, .xl': {
				'.border-thicken': {
					borderWidth: '2px',
				},
			},
			'.about-token': {
				li: {
					listStyle: 'disc',
					marginLeft: '1em',
				},
				ul: {
					marginBottom: '1em',
				},
			},
			'.bodycontent': {
				maxWidth: '1440px',
				margin: '0 auto',
			},
			'.chakra-text a': {
				color: '#fff',
				textDecoration: 'underline',
			},
			'.contentwrapper': {
				width: '100%',
				height: '100%',
				margin: '0 auto',
				padding: '0',
			},
			'.change': {
				fontSize: '1.2rem',
				fontWeight: '300',
				alignSelf: 'flex-end',
				margin: '0 0 0.3rem 0.7rem',
				'&.positive': {
					color: '#05ee58',
				},
				'&.negative': {
					color: 'red',
				},
			},
			'.fullwrapper': {
				width: '100%',
				height: '100%',
				margin: '0 auto',
				padding: '0 1.5rem',
			},
			'.header': {
				maxWidth: '1440px',
				fontWeight: '400',
				a: {
					fontSize: ['xs', 'xs', 'sm', 'md'],
				},
				button: {
					fontSize: ['xs', 'xs', 'sm', 'sm'],
				},
				'.link': {
					color: 'bodytext',
					'.active': {
						color: 'white',
					},
					_hover: {
						color: 'white',
					},
				},
				'.activelink': {
					color: 'white',
					textShadow: '.5px 0 .5px white',
				},
			},
			'.homewrapper': {
				backgroundImage: 'url(/images/swd-page-bg-header.jpg)',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				backgroundPosition: 'top left',
				padding: '0',
				margin: '0 auto',
			},
			'#about': {
				bgColor: '#030303',
				'.content': {
					backgroundImage: 'url(/images/swd-about-nologo-bg-2x.jpg)',
					backgroundSize: browserName === 'Safari' ? 'cover' : 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'top center',
					padding: '0',
					margin: '0 auto',
					'&.wide': {
						backgroundSize: 'cover',
					},
				},
			},
			'.swdGradient': {
				bgGradient: 'linear(to-b,#110835,#27076c,#8903c4)',
				borderRadius: '2em',
				padding: '0',
				margin: '0 auto',
			},
			'.article': {
				bgColor: '#000',
				'.content': {
					bgColor: '#0e0913',
					margin: '0 auto',
				},
				cite: {
					borderLeft: '1px solid #fff',
					paddingLeft: '1rem',
					color: '#fff',
				},
				h1: {
					fontWeight: 'bold',
					fontSize: '2.2rem',
					pt: '2rem',
				},
				h2: {
					fontWeight: 'bold',
					fontSize: '2rem',
					pt: '2rem',
				},
				h3: {
					fontWeight: 'bold',
					fontSize: '1.6rem',
					pt: '1.6rem',
				},
				li: {
					listStyleType: 'disc',
					color: 'bodytext',
					ml: '1rem',
					a: {
						color: '#fff',
						textDecoration: 'underline',
					},
				},
				strong: {
					fontWeight: 'bold',
					color: '#fff',
				},
			},
			'#notfound': {
				backgroundColor: '#061308',
				// '.contentwrapper': {
				// 	backgroundImage: 'url(/images/swd-purple-section.png)',
				// 	backgroundRepeat: 'no-repeat',
				// 	backgroundSize: 'contain',
				// 	backgroundPosition: 'bottom center',
				// },
			},
			'.content': {
				height: '100%',
				margin: '0 auto',
				textAlign: 'center',
				'.search': {
					backgroundColor: '#000',
					borderRadius: '2rem',
					padding: '.5rem .5rem .5rem 3rem',
					backgroundPosition: 'left',
				},
			},
			'.lg .dynamic-grid p, .xl .dynamic-grid p': {
				textAlign: 'left',
			},
			'.dynamic-grid': {
				h2: {
					fontSize: '1.5rem',
					marginBottom: '1rem',
					textAlign: 'left',
				},
				p: {
					marginBottom: '1rem',
					textAlign: 'justify',
					'&.tight': {
						marginBottom: '0',
					},
					'&.short': {
						textAlign: 'left',
					},
				},
			},
			'.farm .farmDetail a': {
				color: 'bodytext',
			},
			'.footer': {
				backgroundImage: 'url(/images/swd-page-footer.png)',
				backgroundRepeat: 'no-repeat',
				color: 'white',
				width: '100%',
				paddingTop: '100px',
			},
			'.nobreak': {
				whiteSpace: 'nowrap',
			},
			'.offscreen': {
				position: 'absolute',
				left: '-9999px',
			},
			'input[placeholder], [placeholder], *[placeholder]': {
				color: 'bodytext',
			},
			'.search': {
				zIndex: '10',
				borderColor: 'lightline',
				borderWidth: '2px',
				fontSize: '0.8rem',
			},
			'.not-absolute': {
				'.searchbox__select': {
					position: 'relative',
					paddingLeft: '4rem',
				},
			},
			'.search, .searchbox': {
				':focus-visible': {
					outline: 'none',
					boxShadow: 'none',
				},
				'.search__input, .searchbox__input': {
					backgroundColor: 'transparent',
					maxHeight: '2.5rem',
				},
				'.searchbox__input, .searchbox__value': {
					padding: '0.25rem',
					marginLeft: '1rem',
					color: '#AADCFE',
					'&::placeholder': {
						color: '#AADCFE',
					},
				},
				'.search__option, .searchbox__option': {
					textAlign: 'left !important',
				},
				'.search__select, .searchbox__select': {
					color: 'bodytext',
					ul: {
						paddingLeft: 0,
						marginLeft: '-2rem',
						listStyleType: 'none',
						textAlign: 'left',
						align: 'left',
						'li:first-of-type': {
							paddingTop: '1rem',
						},
						li: {
							align: 'left',
							borderTop: '1px solid #120046',
							padding: '.4rem 0',
							'&:hover': {
								color: 'whitish',
							},
						},
					},
				},
			},
			'.styled-box, .styled-container': {
				position: 'relative',
				'.styled-content': {
					paddingBottom: '2.5rem',
				},
				'.arrowlink': {
					position: 'absolute',
					bottom: '1rem',
					right: '1rem',
				},
			},
			'table.token': {
				'.symbol': {
					color: '#2089fd',
				},
			},
			'#home': {
				backgroundColor: '#030303',
			},
			'.about': {
				p: {
					color: 'bodytext',
				},
				textAlign: 'left',
				align: 'left',
				h2: { fontSize: '1.5rem' },
				ul: {
					color: 'bodytext',
					listStyleType: 'disc',
					listStylePosition: 'inside',
				},
			},
			'#token .columns': {
				h2: {
					margin: '1rem 0',
				},
				p: {
					textAlign: 'justify',
				},
				'.row': {
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					width: '100%',
				},
				'.column': {
					display: 'flex',
					flexDirection: 'column',
					flexBasis: '100%',
					flex: 1,
				},
			},

			'.gridrow': {
				width: '100%',
			},
			ul: {
				a: {
					color: 'white',
					textDecoration: 'underline',
				},
			},
			'.suggested-box': {
				width: '30%',
				borderRadius: '1.3em',
				bgColor: 'blue7',
				display: 'flex',
				flexDir: 'column',
				alignItems: 'center',
				position: 'relative',
				'&:hover': {
					bgColor: '#2c1e4b',
					'.suggested-title': {
						bgColor: '#332766',
					},
				},
			},

			'.suggested-title': {
				borderRadius: '1.3rem 1.3rem 0 0',
				width: '100%',
				bgColor: 'blue5',
				textColor: '#2089fd',
				fontSize: '2rem',
				textDecoration: 'bold',
				img: {
					marginLeft: '.5rem',
				},
			},
			'.suggested-clc': {
				paddingTop: '1rem',
				div: {
					display: 'flex',
					alignItems: 'center',
				},
			},
			'.suggested-change': {
				color: '#2089fd',

				// position: 'absolute',
				bottom: '.5rem',
			},
			'.suggested-description': {
				color: 'white',
				padding: '1rem 2rem 2rem',
			},
			'.suggested-flex': {
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			},
			'.overwrite-leftAlign': {
				h2: {
					textAlign: 'left',
				},
			},
			'.slick-slide': {
				padding: '1rem',
			},
			// get rid of blue outline for clicked elements
			'.js-focus-visible :focus:not([data-focus-visible-added]), :focus, .focus-visible': {
				outline: 'none !important',
				boxShadow: 'none !important',
			},
		}),
	},
};

export const theme = extendTheme(config);
