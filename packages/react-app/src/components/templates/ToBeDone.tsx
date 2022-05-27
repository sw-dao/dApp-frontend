import { Box, Center, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { FullHeightPage } from './FullHeightPage';

export function ToBeDonePage({ which = 'TBD' }) {
	return (
		<FullHeightPage>
			<Center>
				<VStack mt="2em">
					<Box>
						<Text>{which}</Text>
					</Box>
				</VStack>
			</Center>
		</FullHeightPage>
	);
}
