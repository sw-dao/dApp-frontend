import { Box, Text } from '@chakra-ui/react';
import { navigate } from 'hookrouter';
import { A } from 'hookrouter';
import React, { useMemo, useState } from 'react';

import { CoinIcon } from './CoinIcon';

interface CoinLabelCellProps {
	symbol: string;
	icon: string;
	url: string;
	name: string;
	height?: string;
	width?: string;
	linkCell?: boolean;
	hideSymbol?: boolean;
	fontSize?: string;
	color?: string;
}
export function CoinLabelCell({
	symbol,
	icon,
	url,
	name,
	height,
	linkCell,
	width,
	hideSymbol,
	fontSize,
	color = 'bodytext',
}: CoinLabelCellProps): JSX.Element {
	const [hover, setHover] = useState(false);

	const tdProps: Record<string, any> = useMemo(
		() =>
			linkCell
				? {
						onClick: () => navigate(url),
						cursor: 'pointer',
						onMouseOver: () => setHover(true),
						onMouseLeave: () => setHover(false),
				  }
				: {},
		[url, linkCell],
	);

	if (width) tdProps.width = width;

	return (
		<Box className="nobreak coin" {...tdProps} textAlign="left">
			<Box display="inline-block" marginRight="1.5rem">
				<CoinIcon symbol={symbol} src={icon} verticalAlign="middle" height={height || '2.5rem'} />
				<A href={url}>
					<Text as="span" fontSize={fontSize} color={hover ? 'white' : color}>
						{name}
					</Text>
					{!hideSymbol && (
						<Text m="0 1rem" d="inline-block" className="symbol" as="span">
							{symbol.toUpperCase()}
						</Text>
					)}
				</A>
			</Box>
		</Box>
	);
}
