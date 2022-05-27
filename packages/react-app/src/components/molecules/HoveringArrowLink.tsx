import React from 'react';

import { ArrowLink } from '../atoms/ArrowLink';

interface HoveringArrowLinkProps {
	primary?: string;
	secondary?: string;
	href: string;
	label?: string;
	height?: string;
	paddingLeft?: string;
	backgroundColor?: string;
	display?: string;
	marginRight?: string;
	fontSize?: string;
	float?: string;
}

export function HoveringArrowLink({
	primary = 'bodytext',
	secondary = 'page.bg',
	href,
	label = 'Read more',
	...rest
}: HoveringArrowLinkProps): JSX.Element {
	return (
		<ArrowLink
			padding="0.2rem"
			fontSize="0.8rem"
			href={href}
			_hover={{
				color: secondary,
				backgroundColor: primary,
			}}
			color={primary}
			borderColor={primary}
			backgroundColor={secondary}
			label={label}
			{...rest}
		/>
	);
}
