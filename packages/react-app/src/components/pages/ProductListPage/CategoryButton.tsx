import { Box, Image } from '@chakra-ui/react';
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

export default function CategoryButton({
	name,
	onClick,
	active,
	widths,
}: CategoryButtonProps): JSX.Element {
	const state: 'active' | 'inactive' = active ? 'active' : 'inactive';
	const breakpoint = useRecoilValue(breakpointState);
	const mr = useMemo(() => MARGINS[breakpoint] || '2.5rem', [breakpoint]);
	const { label, image, imageHeight = '3rem', imageTop = '-0.4rem' } = BUTTON_STYLES[name];
	const hover = { color: '#120046', bgColor: BUTTON_STYLES[name][state].color };
	return (
		<Box
			_hover={hover}
			borderRadius="2em"
			borderWidth="1px"
			cursor="pointer"
			fontSize="0.9rem"
			height="2rem"
			lineHeight="1rem"
			mr={mr}
			onClick={() => onClick(name)}
			padding="0.4rem 0.6rem 0.4rem 2.2rem"
			position="relative"
			width={widths[breakpoint] || 'auto'}
			{...BUTTON_STYLES[name][state]}
		>
			{image && (
				<Image src={image} h={imageHeight} position="absolute" top={imageTop} left="-0.8rem" />
			)}
			{label}
		</Box>
	);
}
