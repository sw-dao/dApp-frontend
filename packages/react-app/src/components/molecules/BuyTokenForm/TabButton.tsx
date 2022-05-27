import { Tab } from '@chakra-ui/react';
import React from 'react';

import { styles } from './styles';

interface TabButtonProps {
	label: string;
}

export default function TabButton({ label }: TabButtonProps): JSX.Element {
	return (
		<Tab
			fontWeight={500}
			fontSize="20px"
			_selected={styles.active}
			_hover={styles.active}
			_active={styles.active}
			{...styles.inactive}
		>
			{label}
		</Tab>
	);
}
