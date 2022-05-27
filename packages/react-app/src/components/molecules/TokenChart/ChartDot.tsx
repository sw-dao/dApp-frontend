import React from 'react';
import { DotProps } from 'recharts';

interface ChartDotProps extends DotProps {
	dotColor: string;
}

export default function ChartDot(props: ChartDotProps): JSX.Element {
	const { cx, cy, dotColor } = props;
	return (
		<g>
			<circle cx={cx} cy={cy} r={4} stroke={dotColor} strokeWidth={2} fill="none" />
		</g>
	);
}
