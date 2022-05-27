import { Box, BoxProps, Heading } from '@chakra-ui/react';
import React from 'react';

export type StyledBoxProps = {
	children: React.ReactNode;
	title: string;
} & BoxProps;

export function StyledBox({ children, title, ...rest }: StyledBoxProps): JSX.Element {
	const containerProps = {
		bgGradient: 'linear-gradient(rgba(0,0,0,0.527),rgba(0,0,0,0.5))',
		borderRadius: '2rem .2rem 2rem .2rem',
		padding: '1rem',
		className: 'styled-box',
		height: '100%',
		...rest,
	};
	const boxProps = {
		className: 'styled-content',
		fontSize: '0.8rem',
	};
	return (
		<Box {...containerProps}>
			<Box {...boxProps}>
				<Heading fontSize="1.5rem" mb=".5rem" mt="-3.4rem" pt="4rem">
					{title}
				</Heading>
				{children}
			</Box>
		</Box>
	);
}
