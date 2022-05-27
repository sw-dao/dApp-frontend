import { Box, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { breakpointState } from '../../state';

interface StyledGridProps {
	cells: JSX.Element[];
	className?: string;
	display?: string;
	height?: string;
	rowSpacing?: string;
	spacerWidth?: string;
	width?: string;
}

const CELLS_PER_ROW: Record<string, number> = {
	sm: 1,
	md: 2,
	lg: 3,
	xl: 3,
};

export function StyledGrid({
	cells,
	rowSpacing = '1rem',
	spacerWidth = '2%',
	...rest
}: StyledGridProps): JSX.Element {
	const breakpoint = useRecoilValue(breakpointState);

	const rows = useMemo(() => {
		const cellsPerRow = CELLS_PER_ROW[breakpoint];
		const rows: JSX.Element[][] = [];
		cells.forEach((cell, ix) => {
			const row = Math.floor(ix / cellsPerRow);
			if (!rows[row]) {
				rows[row] = [];
			}
			rows[row].push(cell);
			if (cellsPerRow > 1 && rows[row].length < cellsPerRow + 1 && ix !== cells.length - 1) {
				rows[row].push(
					<Box key={`row${row}${rows[row].length}`} width={spacerWidth} d="table-cell" />,
				);
			}
		});
		return rows;
	}, [breakpoint, cells, spacerWidth]);

	return (
		<VStack spacing={rowSpacing} {...rest}>
			{rows.map((row, ix) => (
				<Box d="table" key={`row${ix}`} className="gridrow">
					{row}
				</Box>
			))}
		</VStack>
	);
}
