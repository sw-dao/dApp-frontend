import { Button, Image, useToast } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React, { useCallback, useMemo } from 'react';
import { getProviderInfo } from 'web3modal';

import { TOAST_TIMEOUT_ALERT } from '../../config';
import { PRODUCTS } from '../../config/products';
import { Toaster } from '../../types';
import { getTokenUrl } from '../../utils';
import { decimalsOf } from '../../utils/contracts';
import { showToast } from '../../utils/toasts';

type WalletButtonProps = {
	symbol: string;
	address?: string;
};

export default function AddToWalletButton({ symbol, address }: WalletButtonProps): JSX.Element {
	const toast: Toaster = useToast();
	const { isConnected, provider } = useWallet();
	const providerInfo = useMemo(() => getProviderInfo(provider), [provider]);

	const handleAdd = useCallback(() => {
		if (!address) {
			PRODUCTS.forEach((p) => {
				if (p.symbol == symbol) {
					address = p.addresses['0x89'];
				}
			});
		}
		if (isConnected && provider && address) {
			showToast(
				'Adding to wallet',
				{
					title: 'Adding to wallet',
					description: `Adding ${symbol}, please approve in your wallet.`,
				},
				toast,
			);
			const image = `${window.location.origin}${getTokenUrl(symbol)[0]}`;
			console.log('adding to wallet', image);
			provider.send('wallet_watchAsset', {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				type: 'ERC20',
				options: {
					address: address,
					symbol,
					decimals: decimalsOf(symbol),
					image,
				},
			});
		} else {
			if (!address) {
				showToast(
					'No address',
					{
						title: 'No address',
						description: `No address found for ${symbol}.`,
					},
					toast,
				);
			} else {
				showToast(
					'add-token',
					{
						title: 'Wallet not connected',
						description: 'Please connect to your wallet',
						duration: TOAST_TIMEOUT_ALERT,
						status: 'error',
					},
					toast,
				);
			}
		}
	}, [address, isConnected, provider, symbol, toast]);

	if (providerInfo.name !== 'Web3') {
		return <></>;
	}

	return (
		<Button
			className="border-thicken"
			onClick={handleAdd}
			position="absolute"
			right="0"
			variant="outline"
			bgColor="transparent"
			fontSize="lg"
			color="purple"
			fontWeight={600}
			borderColor="blue5"
			borderWidth={2}
			_hover={{ bgColor: '#BCE7FE', color: '#000', borderColor: '#BCE7FE' }}
		>
			<Image src="/images/metamask.png" alt="add to Metamask" />
			&nbsp;+
		</Button>
	);
}
