import { Tooltip, TooltipProps } from '@chakra-ui/react';
import React from 'react';

interface WrapperProps extends TooltipProps {
	show: boolean;
}

export function TooltipWrapper({ children, show, ...rest }: WrapperProps): JSX.Element {
	if (!show) {
		return <>{children}</>;
	}
	return <Tooltip {...rest}>{children}</Tooltip>;
}
