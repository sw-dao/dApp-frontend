import { Button } from '@chakra-ui/react';
import React from 'react';

import { TIME_PERIODS } from '../../../config';

export const PERIODS = Object.keys(TIME_PERIODS);

export interface TimeButtonProps {
	period: string;
	onClick: (period: string) => void;
}

export default function TimeButton({ period, onClick }: TimeButtonProps): JSX.Element {
	// get next index, wrapping around
	const key = period.toUpperCase();
	const { icon, label } = TIME_PERIODS[key];
	return (
		<Button
			variant="unstyled"
			onClick={() => onClick(period)}
			bgColor="transparent"
			color="alttext"
			_hover={{ color: '#120046', bgColor: 'alttext' }}
			borderColor="alttext"
			borderWidth="1px"
			padding="0.4rem 0.6rem 0.4rem 1rem"
			fontSize="0.9rem"
			width="7rem"
		>
			{icon}&nbsp;{label}
		</Button>
	);
}
