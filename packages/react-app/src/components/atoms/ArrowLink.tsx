import React from 'react';

import { ButtonLink } from './ButtonLink';
import { ArrowRightIcon } from './ClientIcons';

interface HoverProps {
	[key: string]: string;
}

interface ArrowLinkProps {
	href: string;
	label: string;
	height?: string;
	padding?: string;
	color?: string;
	borderColor?: string;
	_hover?: HoverProps;
}

export function ArrowLink({ href, label, ...rest }: ArrowLinkProps): JSX.Element {
	return (
		<ButtonLink
			className="arrowlink"
			float="right"
			mt="1em"
			width="8rem"
			variant="outline"
			href={href}
			{...rest}
		>
			{label} <ArrowRightIcon />
		</ButtonLink>
	);
}
