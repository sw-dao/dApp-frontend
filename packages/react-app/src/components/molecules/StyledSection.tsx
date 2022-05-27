import { Box } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { SIDE_PADDING, WIDTHS } from '../../config';
import { breakpointState } from '../../state';

const styles = {
	clear: {
		paddingTop: '0',
	},
	first: {
		backgroundImage: 'url(/images/swd-section-1.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'top left',
		paddingBottom: '10px',
	},
	home: {
		paddingTop: '0',
	},
	second: {
		backgroundImage: 'url(/images/swd-section-2.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'top left',
		backgroundColor: '#070019',
		paddingTop: '100px',
	},
	body: {
		bgGradient: 'linear(to-b,page.bg,#060119)',
		paddingTop: '0.5rem',
	},
	purple: {
		backgroundImage: 'url(/images/swd-purple-section-tall.png)',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'top center',
		backgroundSize: 'cover',
		paddingTop: '120px',
		marginTop: '-100px',
	},
};

interface StyledSectionProps {
	id?: string;
	section: 'clear' | 'first' | 'home' | 'second' | 'body' | 'purple';
	children: React.ReactNode;
	height?: string;
	marginBottom?: string;
	paddingTop?: string;
	paddingRight?: string;
	paddingLeft?: string;
	width?: string | string[];
	display?: string;
}

export function StyledSection({ section, children, ...rest }: StyledSectionProps): JSX.Element {
	const style = styles[section] || {};
	const breakpoint = useRecoilValue(breakpointState);

	const boxProps = {
		width: WIDTHS[breakpoint],
		backgroundColor: 'transparent',
		paddingTop: '120px',
		paddingLeft: SIDE_PADDING[breakpoint],
		paddingRight: SIDE_PADDING[breakpoint],
		...style,
		...rest,
	};
	return <Box {...boxProps}>{children}</Box>;
}
