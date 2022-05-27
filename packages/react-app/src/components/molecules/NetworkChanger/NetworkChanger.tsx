import { Box, Button, List, ListItem, Text, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React, { useMemo } from 'react';

import Chevron from './Chevron';
import Network from './Network';

interface NetworkChangerProps {
	right: string;
	top: string;
}

const breakpoints = ['6rem', '6rem', '6rem', '8rem'];

const boxProps = {
	bgColor: 'blue5',
	borderWidth: '1px',
	borderColor: 'purple',
	borderRadius: '2rem',
	color: 'whitish',
	fontSize: 'md',
	width: breakpoints,
};

const hover = {
	fontWeight: 500,
	color: 'alttext',
};

export function NetworkChanger(props: NetworkChangerProps): JSX.Element {
	const { right, top } = props;
	const { isConnected, networks, chainId, switchNetwork, isMetamask } = useWallet();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const chain = useMemo(() => {
		if (!isConnected && !chainId) {
			return null;
		}
		return networks[chainId || '-'] || null;
	}, [isConnected, chainId, networks]);

	const networkSelector: JSX.Element = useMemo(() => {
		if (!chain) {
			return (
				<Button variant="outline" {...boxProps} _hover={hover} fontWeight={400} size="md">
					<Text>No Network</Text>
				</Button>
			);
		}

		// checking metamask here because it's the only one that has a network selector
		const chevron = !isOpen && isMetamask ? <Chevron isOpen={isOpen} color="#FCFCFC" /> : undefined;

		const currChain = (
			<Network
				chainId={chainId || '-'}
				color="#FCFCFC"
				name={chain.name}
				icon={chevron}
				hover={hover}
			/>
		);

		const otherChainId = chainId === '0x1' ? '0x89' : '0x1';
		const otherNetwork = networks[otherChainId];

		if (!isOpen || !otherNetwork) {
			return (
				<Button variant="outline" {...boxProps} _hover={hover} onClick={onOpen}>
					{currChain}
				</Button>
			);
		}

		const otherChain = (
			<Network chainId={otherChainId} color="#FCFCFC" name={otherNetwork.name} hover={hover} />
		);

		return (
			<Box {...boxProps}>
				<List textAlign="left" padding="0.5rem 1rem">
					<ListItem height="2rem" onClick={onClose}>
						{currChain}
					</ListItem>
					<ListItem
						height="2rem"
						onClick={() => {
							switchNetwork(otherChainId);
							onClose();
						}}
					>
						{otherChain}
					</ListItem>
				</List>
			</Box>
		);
	}, [chain, chainId, isMetamask, isOpen, networks, onClose, onOpen, switchNetwork]);

	// <Tooltip label={`Click to change network`}>{networkSelector}</Tooltip>
	return (
		<Box position="relative" width={breakpoints}>
			<Box position="absolute" right={right} top={top}>
				<Box d="inline-block" position="relative">
					{networkSelector}
				</Box>
			</Box>
		</Box>
	);
}

NetworkChanger.defaultProps = {
	right: '0',
	top: '-1.3rem',
};
