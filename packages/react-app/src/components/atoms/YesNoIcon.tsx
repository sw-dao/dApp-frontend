import { Box } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineCheck, AiOutlineInfoCircle } from 'react-icons/ai';

interface IconProps {
	status: boolean;
	color?: string;
	size?: string;
}

export function YesNoIcon(props: IconProps): JSX.Element {
	const { status, color = 'bodytext', size = '1rem' } = props;

	const icon = React.useMemo(() => (status ? AiOutlineCheck : AiOutlineInfoCircle), [status]);

	return <Box as={icon} color={color} size={size} />;
}
