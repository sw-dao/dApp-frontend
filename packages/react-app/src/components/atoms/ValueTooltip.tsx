import { Tooltip } from '@chakra-ui/react';
import React from 'react';

interface ValueTooltipProps {
	value: string;
	children: React.ReactNode;
}

export function ValueTooltip({ value, children }: ValueTooltipProps): JSX.Element {
	if (value) {
		return <Tooltip label={value}>{children}</Tooltip>;
	}
	return <>children</>;
}
