import React from 'react';

export default function SwdGradient({ id }: { id: string }): JSX.Element {
	return (
		<defs>
			<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
				<stop offset="5%" stopColor="#1f8cfd" stopOpacity={1} />
				<stop offset="95%" stopColor="#7200e6" stopOpacity={1} />
			</linearGradient>
		</defs>
	);
}
