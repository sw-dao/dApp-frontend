import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { LimitedText } from '../../atoms/LimitedText';
import { TooltipWrapper } from '../../atoms/TooltipWrapper';
import WalletStatusModal from './WalletStatusModal';

interface WalletProps {
	icon: React.ReactNode;
	variant: string;
	width?: string;
	connectLabel?: string;
	size?: string;
	tooltip?: boolean;
	onClick?: () => void;
}

export default function WalletButton(props: WalletProps): JSX.Element {
	const {
		icon,
		variant,
		width,
		connectLabel = 'Connect',
		size = 'md',
		tooltip = true,
		onClick,
	} = props;
	const { connectWallet, isConnecting, isConnected, address, provider } = useWallet();
	const [changeRegistered, setChangeRegistered] = useState(false);
	const isCurrent = useRef(false);
	const { isOpen, onClose, onOpen } = useDisclosure();

	useEffect(() => {
		isCurrent.current = true;
		return () => {
			// called when the component is going to unmount
			isCurrent.current = false;
		};
	}, [isCurrent]);

	const toggleWallet = () => {
		onClick && onClick();
		if (isConnected) {
			onOpen();
			/* localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
			disconnect(); */
		} else {
			connectWallet();
		}
	};

	useEffect(() => {
		if (isCurrent.current && isConnected && !changeRegistered) {
			provider?.on('accountsChanged', () => {
				window.location.reload();
			});
			setChangeRegistered(true);
			return () => {
				provider?.off('accountsChanged');
			};
		}
	}, [changeRegistered, provider, isCurrent, isConnected]);

	const label = useMemo(() => {
		if (isConnecting) {
			return 'Connecting...';
		}
		if (!isConnected) {
			return 'Click to connect';
		}
		return 'Click to change providers or disconnect';
	}, [isConnected, isConnecting]);

	const buttonText = useMemo(
		() =>
			isConnected && address ? (
				<LimitedText maxLength={10} fromEnd={4} text={address} />
			) : (
				connectLabel
			),
		[address, connectLabel, isConnected],
	);

	const breakpoints = width || ['7rem', '7rem', '9rem', '11rem'];
	return (
		<>
			<TooltipWrapper show={tooltip} label={label}>
				<Button
					variant={variant}
					disabled={isConnecting}
					onClick={toggleWallet}
					className="walletButton"
					width={breakpoints}
					size={size}
					fontSize="xs"
					marginTop="-.2rem"
				>
					{icon && (
						<Box mr="2" verticalAlign="center" display={['none', 'none', 'none', 'inline-block']}>
							{icon}
						</Box>
					)}
					{buttonText}
				</Button>
			</TooltipWrapper>
			<WalletStatusModal isOpen={isOpen} onClose={onClose} />
		</>
	);
}

WalletButton.defaultProps = {
	icon: null,
	variant: 'primary',
};
