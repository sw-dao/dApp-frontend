import { Box } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/react';
import { A, navigate } from 'hookrouter';
import React from 'react';

const hover = {
	bgGradient: 'linear(to-b,#a9dcfe,#3e86fd)',
	borderColor: 'accent',
};

type VariantPropSet = {
	[key: string]: any;
};

type VariantProps = {
	outline: VariantPropSet;
	primary: VariantPropSet;
};

const variants: VariantProps = {
	outline: {
		color: 'bodytext',
		bgColor: 'transparent',
		borderColor: 'bodytext',
		borderWidth: '2px',
		borderRadius: '2rem',
	},
	primary: {
		color: 'white',
		bgGradient: 'linear(to-b,#1f8cfd,#7200e6)',
		_hover: hover,
		borderRadius: '2rem',
	},
};

export type ButtonLinkProps = BoxProps & {
	href: string;
	children?: React.ReactNode;
	variant?: 'outline' | 'primary';
	external?: boolean;
	align?: 'left' | 'center' | 'right';
};

export function ButtonLink({
	href,
	children,
	variant = 'outline',
	external = false,
	...rest
}: ButtonLinkProps): JSX.Element {
	const props: VariantPropSet = {
		...variants[variant],
		...rest,
	};

	if (external) {
		return (
			<a href={href} target="_blank" rel="noreferrer">
				<Box {...props}>{children}</Box>
			</a>
		);
	}

	if (href.startsWith('/')) {
		const parts = href.split('?');
		const [url, query] = parts;
		const urlParams = new URLSearchParams(query);
		const params = Object.fromEntries(urlParams);
		props.onClick = (e: any) => {
			e.preventDefault();
			navigate(url, false, params);
		};
		props.cursor = 'pointer';
		delete props.href;
		return <Box {...props}>{children}</Box>;
	}

	return (
		<A href={href}>
			<Box {...props}>{children}</Box>
		</A>
	);
}
