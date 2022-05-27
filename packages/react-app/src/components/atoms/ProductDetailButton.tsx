import React from 'react';

import { ButtonLink, ButtonLinkProps } from './ButtonLink';
import { DocumentIcon } from './ClientIcons';

interface ProductDetailButtonProps {
	symbol: string;
	label: string;
	height?: string;
}

export function ProductDetailButton({
	symbol,
	label,
	...rest
}: ProductDetailButtonProps): JSX.Element {
	const hover = {
		color: 'page.bg',
		backgroundColor: 'bodytext',
	};

	const href = `https://storage.googleapis.com/sw-dao.appspot.com/fact-sheets/${symbol.toLowerCase()}.pdf`;

	const props: ButtonLinkProps = {
		variant: 'outline',
		color: 'bodytext',
		borderColor: 'bodytext',
		_hover: hover,
		width: 'auto',
		padding: '0.5rem 1rem',
		fontSize: '0.9rem',
		href,
		external: true,
	};

	return (
		<ButtonLink {...props} {...rest}>
			<DocumentIcon fontSize="1.5rem" />
			{label || `${symbol.toUpperCase()} Fact Sheet PDF`}
		</ButtonLink>
	);
}
