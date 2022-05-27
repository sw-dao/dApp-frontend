import { useWallet } from '@raidguild/quiver';
import { A } from 'hookrouter';
import React from 'react';

import { DEFAULT_CHAIN_ID } from '../../config';
import { chains } from '../../config/chains';
import { LimitedText } from './LimitedText';

interface EtherscanLinkProps {
	tx?: string;
	address?: string;
	token?: string;
	maxLength?: number;
	fromEnd?: number;
}

export function EtherscanLink({
	tx = '',
	address = '',
	token = '',
	maxLength = 14,
	fromEnd = 6,
}: EtherscanLinkProps): JSX.Element {
	let section = 'tx';
	let val = tx;

	const { chainId } = useWallet();

	const chainKey = chainId || DEFAULT_CHAIN_ID || 'NO';
	const chain = chains[chainKey];
	const explorers = chain?.explorers;
	if (!explorers) {
		console.warn('no explorers from chain', chainKey);
	}
	const ETHERSCAN = explorers && explorers.length > 0 ? explorers[0].url : 'https://etherscan.io';

	if (address) {
		section = 'address';
		val = address;
	} else if (token) {
		section = 'token';
		val = token;
	}

	const href = `${ETHERSCAN}/${section}/${val}`;

	return (
		<A href={href} target="_blank" rel="noopener noreferrer">
			<LimitedText text={val} maxLength={maxLength} fromEnd={fromEnd} />
		</A>
	);
}
