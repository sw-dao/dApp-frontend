import { useToast } from '@chakra-ui/react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { WalletProvider } from '@raidguild/quiver';
import WalletConnectProvider from '@walletconnect/web3-provider';
// import FrameProvider from 'eth-provider';
import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { usePath, useRoutes, useTitle } from 'hookrouter';
import React, { Suspense, useEffect } from 'react';
import ReactGA from 'react-ga';
import { RecoilRoot } from 'recoil';
import { IProviderOptions } from 'web3modal';

import { NotFoundPage } from './components/pages/NotFoundPage';
import { DEFAULT_CHAIN_ID, INFURA_ID, SUBGRAPH_SWD_URL, SUPPORTED_NETWORKS } from './config';
import { routes, titles } from './routes';
import { SwdDataProvider } from './state/SwdDataProvider';
import { showErrorToast } from './utils/toasts';

const TRACKING_ID = 'G-MWVMGM6NLJ';
ReactGA.initialize(TRACKING_ID);

const providerOptions: IProviderOptions = {
	walletlink: {
		package: CoinbaseWalletSDK,
		options: {
			appName: 'SWDAO',
			infuraId: INFURA_ID,
		},
	},
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			rpc: {
				/* 1: SUPPORTED_NETWORKS['0x1'].rpc,
				4: SUPPORTED_NETWORKS['0x4'].rpc,
				1337: SUPPORTED_NETWORKS['0x539'].rpc, */
				137: SUPPORTED_NETWORKS['0x89'].rpc,
				80001: SUPPORTED_NETWORKS['0x13881'].rpc,
			},
		},
	},
	/* 	frame: {
		package: FrameProvider,
	}, */
	// .. Other providers
};

const web3modalOptions = {
	cacheProvider: true,
	providerOptions,
	theme: 'dark',
};

const graphqlClient = new GraphQLClient({
	url: SUBGRAPH_SWD_URL,
});

type PossibleError = { code: string; message: string } | undefined;

export function App(): JSX.Element {
	const routedPage = useRoutes(routes) || <NotFoundPage />;
	const title = useRoutes(titles) || 'SW DAO';
	useTitle(title);
	const path = usePath();
	const toast = useToast();

	// force a scroll to top when path changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [path]);

	const handleModalEvents = (eventName: string, error: PossibleError): void => {
		if (error) {
			showErrorToast(eventName, {}, error, toast);
		}
		console.log(`quiver event: ${eventName}`, error);
	};

	return (
		<RecoilRoot>
			<WalletProvider
				web3modalOptions={web3modalOptions}
				networks={SUPPORTED_NETWORKS}
				defaultChainId={DEFAULT_CHAIN_ID}
				handleModalEvents={handleModalEvents}
			>
				<Suspense fallback={<div>Loading...</div>}>
					<ClientContext.Provider value={graphqlClient}>
						<SwdDataProvider>{routedPage}</SwdDataProvider>
					</ClientContext.Provider>
				</Suspense>
			</WalletProvider>
		</RecoilRoot>
	);
}
