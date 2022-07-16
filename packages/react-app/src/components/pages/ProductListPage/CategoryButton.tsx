import { Box, Image } from '@chakra-ui/react';
import { string } from 'prop-types';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { breakpointState } from '../../../state';
import { BUTTON_STYLES } from './styles';
import { CategoryButtonProps } from './types';

const MARGINS: Record<string, string> = {
	sm: '1rem',
	md: '1rem',
	lg: '1.5rem',
	xl: '2.5rem',
};

const SLOGANS: Record<string, string> = {
	ALL: 'Every product',
	STRATEGIES: 'Outperform spot',
	YIELD: 'Earn interest',
};

export default function CategoryButton({
	name,
	onClick,
	active,
	widths,
	isOpen = false,
}: CategoryButtonProps): JSX.Element {
	const state: 'active' | 'inactive' = active ? 'active' : 'inactive';
	const breakpoint = useRecoilValue(breakpointState);
	const mr = useMemo(() => MARGINS[breakpoint] || '2.5rem', [breakpoint]);
	const { label, image, imageHeight = '3rem', imageTop = '-0.4rem' } = BUTTON_STYLES[name];
	const hover = {
		color: BUTTON_STYLES[name][state].bgColor,
		bgColor: BUTTON_STYLES[name][state].color,
	};
	// if (name === 'YIELD' && state === 'active') {
	// 	hover = {
	// 		color: BUTTON_STYLES[name][state].bgColor,
	// 		bgColor: BUTTON_STYLES[name][state].color,
	// 	};
	// } else {
	// 	hover = {
	// 		color: '#120046',
	// 		bgColor: BUTTON_STYLES[name][state].color,
	// 	};
	// }
	let boxStyle: Record<string, string> = {
		alignItems: 'center',
		fontSize: '1.2rem',
		fontWeight: '500',
		lineHeight: '13px',
		textAlign: 'center',
		width: '24%',
		height: '66px',
		cursor: 'pointer',
		border: '1px solid #D9D7E1',
		borderRadius: '12px',
		padding: '16px',
	};
	let imgStyle: Record<string, string> = {
		top: '7px',
	};
	if (breakpoint === 'sm' || breakpoint === 'md') {
		boxStyle = {
			padding: '0.4rem 0.6rem 0.4rem 2.2rem',
			width: `${widths[breakpoint] || 'auto'}`,
			borderRadius: '12px',
			fontSize: '0.9rem',
			height: '2rem',
			lineHeight: '1rem',
		};
		imgStyle = {
			top: imageTop,
			left: '-0.8rem',
		};
	}
	return (
		<Box
			_hover={hover}
			{...boxStyle}
			mr={mr}
			onClick={() => onClick(name)}
			position="relative"
			{...BUTTON_STYLES[name][state]}
		>
			{image && <Image src={image} h={imageHeight} position="absolute" {...imgStyle} />}
			{breakpoint === 'sm' || breakpoint === 'md' ? (
				label
			) : (
				<Box position="absolute" textAlign="left" paddingLeft="55px" textColor="white">
					<h4>{label}</h4>
					<Box fontSize="14px" paddingTop="3px" textColor="#2089fd">
						{SLOGANS[name]}
					</Box>
				</Box>
			)}
		</Box>
	);
}
