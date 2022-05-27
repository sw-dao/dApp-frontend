import { Button, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { TIME_PERIODS } from '../../../config';

export interface TimeButtonProps {
	period: '1D' | '1W' | '1M' | '1Y';
	onClick: (period: string) => void;
	active: boolean;
	disabled: boolean;
	label?: string;
}

export function TimeButton({
	period,
	onClick,
	active,
	disabled,
	label,
}: TimeButtonProps): JSX.Element {
	const { icon } = TIME_PERIODS[period];
	let color = 'purple';
	if (!active) {
		color = disabled ? '#ccc' : 'purple';
	}

	const handleClick = useMemo(
		() => () => {
			if (!disabled) {
				onClick(period);
			}
		},
		[disabled, onClick, period],
	);

	return (
		<Button
			height="2rem"
			maxWidth="10rem"
			fontWeight="500"
			fontSize="20px"
			background={active ? 'bodytext' : 'transparent'}
			bgColor="transparent"
			bgGradient="none"
			color={active ? 'blue5' : color}
			onClick={handleClick}
			disabled={disabled && !active}
			variant="none"
			_hover={{
				background: 'bodytext',
				color: disabled ? '#ccc' : 'blue5',
			}}
		>
			{icon}
			<Text ml="0.1rem" d="inline-block">
				{label}
			</Text>
		</Button>
	);
}
