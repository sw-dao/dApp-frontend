import { useWallet } from '@raidguild/quiver';
import { useOnRepetition } from 'eth-hooks';
import { useCallback, useState } from 'react';

import { DEFAULT_CHAIN_ID } from '../config';
import { getEthPrice } from '../services/backend';

export function useEthPrice(): number | undefined {
	const [ethPrice, setEthPrice] = useState<number | undefined>(undefined);
	const { isConnected, provider, chainId } = useWallet();

	const pollPrice = useCallback(() => {
		getEthPrice(chainId || DEFAULT_CHAIN_ID).then((price) => {
			if (price && price.ETH !== ethPrice) {
				console.log('ETH price updated', price.ETH);
				setEthPrice(price.ETH);
			}
		});
	}, [chainId, ethPrice]);

	useOnRepetition(pollPrice, {
		pollTime: 5 * 60 * 1000, // 5 minutes
		leadingTrigger: isConnected && !!provider,
	});
	return ethPrice;
}
