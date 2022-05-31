import { Button, Image, useToast } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React, { useCallback, useMemo } from 'react';
import { getProviderInfo } from 'web3modal';

import { TOAST_TIMEOUT_ALERT } from '../../config';
import { Toaster } from '../../types';
import { getTokenUrl } from '../../utils';
import { decimalsOf } from '../../utils/contracts';
import { showToast } from '../../utils/toasts';

type WalletButtonProps = {
	symbol: string;
	address?: string;
};
const addresses: { [key: string]: string } = {
	BMI: '0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb',
	BTBTC: '0x58f7C5707Ba8E09B5e61ceBe8821f65434372344',
	BTETH: '0x07A79127182a1c303d11eCDa951310EC1C2E1444',
	BTMAT: '0xb87352B4C3EB9daEd09cD4996dFf85c122394912',
	DBTC: '0xf2aa5ccea80c246a71e97b418173fcc956408d3f',
	DETH: '0x72b467cacbdbec5918d8eec0371ca33e6fd42421',
	DMATI: '0xab80a6e2909c8089ebd84f331c05bbefa3276cd2',
	DMI: '0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a',
	DVI: '0x62135f85899d97aed95f4405d710208e68b99f39',
	EIGHT: '0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b',
	EMI: '0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568',
	FOMO: '0x3c0744E72abb3A312122c2118F01F9EE2EB79d43',
	HORSE: '0x330FF0aFE63f42eb478c92dA79B0ce0c69070183',
	KEV: '0x4315C720Cad5aa41D7535902b58B015EEA6F97B0',
	MMI: '0xDFdDd9811796F72bA32a031724f5B1403CD48B91',
	MTBTC: '0x71b41b3b19aac53ca4063aec2d17fc3caeb38026',
	MTETH: '0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548',
	PEI: '0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff',
	QMB: '0xabcc2102065ba01c6df1a5a5a57158f452403b70',
	QME: '0x9984d846a3dc77aa0488f3758976b149e8475995',
	QMM: '0x20ab4cb8f8da39582bc92da954ab1bb128f4e244',
	SMI: '0xad2b726fd2bd3a7f8f4b3929152438eba637ef19',
	SSPOTS: '0x99Dd5231314005f26ce147E50F9BAC2365217fCe',
	SURF: '0xb656D21E3BFa5Aed5405760b891BA539f4CEb976',
	SWAP: '0x25ad32265c9354c29e145c902ae876f6b69806f2',
	SWBYF: '0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc',
	SWD: '0xaee24d5296444c007a532696aada9de5ce6cafd0',
	SWEYF: '0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a',
	SWMYF: '0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6',
	SWYF: '0xdc8d88d9e57cc7be548f76e5e413c4838f953018',
};
export default function AddToWalletButton({ symbol, address }: WalletButtonProps): JSX.Element {
	const toast: Toaster = useToast();
	const { isConnected, provider } = useWallet();
	address = addresses[symbol];
	const providerInfo = useMemo(() => getProviderInfo(provider), [provider]);

	const handleAdd = useCallback(() => {
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
						description: `No address found for ${symbol} Address: ${address}.`,
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
