import { Box, Heading } from '@chakra-ui/react';
import { navigate } from 'hookrouter';
import React from 'react';

interface StyleColor {
	box: { backgroundImage: string };
	container: { backgroundColor: string };
}

interface StyleColors {
	purple: StyleColor;
	green: StyleColor;
	blue: StyleColor;
}

const styles: StyleColors = {
	purple: {
		box: {
			backgroundImage: 'url(/images/purple-gem.png)',
		},
		container: {
			backgroundColor: 'bodydark',
		},
	},
	green: {
		box: {
			backgroundImage: 'url(/images/green-gem.png)',
		},
		container: {
			backgroundColor: '#110E1A',
		},
	},
	blue: {
		box: {
			backgroundImage: 'url(/images/blue-gem.png)',
		},
		container: {
			backgroundColor: '#262585',
		},
	},
};

interface StyledIconContainerProps {
	colorScheme: 'purple' | 'green' | 'blue';
	children: React.ReactNode;
	title: string;
	productKey: string;
}

export function StyledIconContainer({
	colorScheme,
	children,
	title,
	productKey,
}: StyledIconContainerProps): JSX.Element {
	const style = styles[colorScheme];
	const containerProps = {
		borderRadius: '2rem .2rem 2rem .2rem',
		padding: '1rem',
		className: 'styled-container',
		height: '100%',
		...style.container,
		// ...rest,
	};
	const boxProps = {
		className: 'styled-content',
		backgroundPosition: 'top center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '5rem',
		fontSize: '0.8rem',
		...style.box,
	};

	const handleClick = () => {
		navigate('/', false, { filter: productKey });
	};

	return (
		<Box {...containerProps}>
			<Box {...boxProps}>
				<Heading
					fontSize="1.5rem"
					mb=".5rem"
					mt="-3.4rem"
					pt="6rem"
					cursor="pointer"
					onClick={handleClick}
				>
					{title}
				</Heading>
				{children}
			</Box>
		</Box>
	);
}
