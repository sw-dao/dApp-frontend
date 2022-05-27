import { Box, Center } from '@chakra-ui/react';
import React from 'react';

import { RatingsDiagram } from '../atoms/RatingsDiagram';
import { FullHeightPage } from '../templates/FullHeightPage';

export function ComponentTestPage(): JSX.Element {
	return (
		<FullHeightPage pageKey="test">
			<Center>
				<Box>
					<RatingsDiagram buy={30} hold={25} sell={45} count={42} width={300} height={300} />
				</Box>
			</Center>
		</FullHeightPage>
	);
}
