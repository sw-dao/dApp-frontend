import { Box } from '@chakra-ui/react';
import React from 'react';

import { TransactionLink } from './TransactionLink';

interface TransactionDescriptionProps {
	message: string | JSX.Element;
	tx: string;
	chainId: string;
}

export function TransactionDescription({
	message,
	tx,
	chainId,
}: TransactionDescriptionProps): JSX.Element {
	return (
		<>
			{message}
			{tx && (
				<Box>
					Tx: #<TransactionLink tx={tx} chainId={chainId} />
				</Box>
			)}
		</>
	);
}
