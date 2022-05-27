import { Box, Checkbox, Text } from '@chakra-ui/react';
import React from 'react';

type CheckboxToggleProps = {
	label: string;
	onChange: (checked: boolean) => void;
	checked: boolean;
};

export function CheckboxToggle(props: CheckboxToggleProps): JSX.Element {
	const { label, onChange, checked } = props;

	return (
		<Box textAlign="right">
			<Checkbox
				defaultChecked={checked}
				colorScheme="purple"
				color="purple"
				border={1}
				borderColor="purple"
				height="1.25rem"
				onChange={(e) => {
					onChange(e.target.checked);
				}}
			>
				<Text fontSize="sm" color="purple">
					{label}
				</Text>
			</Checkbox>
		</Box>
	);
}
