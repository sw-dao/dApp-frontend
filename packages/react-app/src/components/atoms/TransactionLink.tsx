import { Box } from '@chakra-ui/react';
import React from 'react';
import { BiLinkExternal } from 'react-icons/bi';

import { getNetworkInfo } from '../../utils';
import { LimitedText } from './LimitedText';

interface TransactionLinkProps {
	tx: string;
	chainId: string;
}

export function TransactionLink({ tx, chainId }: TransactionLinkProps): JSX.Element {
	const net = getNetworkInfo(chainId);
	const explorer = net.explorers ? net.explorers[0].url : '';

	return (
		<Box d="inline-block">
			<a target="_blank" rel="noopener noreferrer" href={`${explorer}/tx/${tx}`}>
				<LimitedText text={tx} maxLength={20} />
			</a>
			<Box mt="0.25rem" pl="0.5rem" float="right">
				<BiLinkExternal />
			</Box>
		</Box>
	);
}
