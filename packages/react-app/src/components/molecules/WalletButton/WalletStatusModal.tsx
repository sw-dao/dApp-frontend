import {
	Box,
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
} from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React, { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { getProviderInfo } from 'web3modal';

import { breakpointState } from '../../../state';
import { getNetworkInfo } from '../../../utils';

const SIZES: Record<string, string> = {
	sm: '100%',
	md: '30rem',
	lg: '30rem',
	xl: '30rem',
};

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function WalletStatusModal(props: ModalProps): JSX.Element {
	const { isOpen, onClose } = props;
	const breakpoint = useRecoilValue(breakpointState);
	const { provider, chainId, disconnect, connectWallet } = useWallet();

	const providerInfo = useMemo(() => getProviderInfo(provider), [provider]);

	const handleChange = useCallback(() => {
		onClose();
		disconnect();
		localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
		connectWallet();
	}, [onClose, disconnect, connectWallet]);

	const networkInfo = useMemo(() => {
		if (chainId) {
			const info = getNetworkInfo(chainId);
			return `on ${info.name}`;
		}
		return 'on an unknown network';
	}, [chainId]);

	return (
		<Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose} preserveScrollBarGap={false}>
			<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
			<ModalContent
				top="0"
				bgGradient="linear(180deg,#1F8CFD 0%, #7200E6 100%)"
				width={SIZES[breakpoint]}
				borderRadius="2em 0 2em 0"
			>
				<ModalHeader padding="0 2rem" height="4.5rem" maxHeight="4.5rem">
					<Flex
						flexFlow="row nowrap"
						justify="space-between"
						height="80px"
						width="20em"
						maxWidth="1440px"
						fontSize="1.5rem"
						verticalAlign="middle"
						lineHeight="2.5rem"
						marginTop="1.2rem"
					>
						<Box fontSize="lg" color="white">
							Account
						</Box>
						<Spacer />
						<ModalCloseButton top="25px" color="whitish" />
					</Flex>
				</ModalHeader>
				<ModalBody color="white">
					<Box
						border="2px solid"
						borderColor="#7077fe"
						borderRadius="2em 0 2em 0"
						padding="1rem 2rem"
						mb="2rem"
					>
						<Flex spacing={4} alignItems="baseline">
							<Box>
								Connected to {providerInfo.name} {networkInfo}
							</Box>
							<Spacer />
							<Button
								variant="outline"
								bgColor="transparent"
								border="1px solid"
								borderColor="blue5"
								borderRadius="2em"
								_hover={{
									bgColor: 'purple',
								}}
								onClick={handleChange}
							>
								Change
							</Button>
						</Flex>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
