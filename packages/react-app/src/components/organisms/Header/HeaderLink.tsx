import { Text } from '@chakra-ui/react';
import { A } from 'hookrouter';
import React from 'react';

interface HeaderLinkProps {
	page: string;
	isActive: boolean;
	url?: string;
	variant?: 'nav' | 'list';
}

export function HeaderLink({ page, url, isActive, variant = 'nav' }: HeaderLinkProps): JSX.Element {
	const key = page.toLowerCase();
	const safeUrl = url || `/${key}`;
	const textProps: any =
		variant === 'list'
			? {
					textColor: isActive ? 'white' : 'bodytext',
					fontSize: 'xl',
					_hover: { color: 'white', textDecoration: 'underline' },
					mb: '16px',
			  }
			: {};

	return (
		<A key={key} href={safeUrl}>
			<Text
				d="inline-block"
				className={isActive ? 'activelink' : 'link'}
				{...textProps}
				pt="0.35rem"
			>
				{page.toUpperCase()}
			</Text>
		</A>
	);
}
