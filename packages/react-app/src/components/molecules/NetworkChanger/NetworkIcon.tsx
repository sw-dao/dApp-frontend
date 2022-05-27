import { Box } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import EthIcon from './EthIcon';
import MaticIcon from './MaticIcon';

interface NetworkIconProps {
	network: string;
	width: number;
	height: number;
	color: string;
}

export default function NetworkIcon(props: NetworkIconProps): JSX.Element {
	const { network, width, height, color } = props;
	const networkIcon = useMemo(() => {
		switch (network) {
			case '0x1':
				return <EthIcon color="#627EEA" width={width + 2} height={height + 2} />;
			case '0x89':
				return <MaticIcon color={color} width={width} height={height} />;
			default:
				return <></>;
		}
	}, [color, height, network, width]);

	return (
		<Box mr="2" verticalAlign="center">
			{networkIcon}
		</Box>
	);
}
