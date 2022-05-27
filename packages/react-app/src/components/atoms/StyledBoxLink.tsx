import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

import { HoveringArrowLink } from '../molecules/HoveringArrowLink';

interface StyledBoxLinkProps {
	title: string;
	href: string;
	color: string;
	height?: string;
}

export function StyledBoxLink({ title, href, color, ...rest }: StyledBoxLinkProps): JSX.Element {
	const headerProps = {
		bgColor: color,
		borderRadius: '2rem .2rem 2rem .2rem',
		padding: '1rem',
		className: 'styled-box',
		height: '8rem',
		width: '100%',
		...rest,
	};
	return (
		<Box className="styled-box-link" d="table-cell" w="30%">
			<Box {...headerProps}>&nbsp;</Box>
			<Heading as="h3" mt="1rem" size="md" textAlign="center" color="white">
				{title}
			</Heading>
			<HoveringArrowLink
				primary="bodytext"
				secondary="page.bg"
				backgroundColor="transparent"
				href={href}
				float="none"
			/>
		</Box>
	);
}

/**
function StyledBox({ color, title, link }) {
	return (
		<Box d="inline-table" w="30%">
			<Box width="100%" pl="1rem">
				<Box
					borderTopStartRadius="2em"
					borderBottomEndRadius="2em"
					bg={color}
					height="7rem"
					w="100%"
					mb="1rem"
					d="table"
				/>
				<Heading fontSize="1.4rem" textAlign="left">
					{title}
				</Heading>
				<ArrowLink
					href={link}
					label="Read More"
					float="left"
					fontSize="0.7rem"
					p="0.2rem 0"
					width="6rem"
				/>
			</Box>
		</Box>
	);
}
*/
