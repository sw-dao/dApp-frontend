import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'ethers/lib/utils';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { SushiswapLink } from '../../atoms/SushiswapLink';

type InputFieldProps = {
	border: string;
	d: string;
	w: string;
	padding: string;
	bgColor: string;
	color?: string;
};

const inputProps: InputFieldProps = {
	border: '1px solid #5E69FF',
	d: 'inline-block',
	w: '50%',
	padding: '0 0.5rem 0 1rem',
	bgColor: 'black',
};

interface FarmDetailFieldProps {
	lpAddresses: [string, string];
	buttonLabel: string;
	clearOnSend: boolean;
	label: string;
	available: BigNumber;
	value: BigNumber;
	onChange: (value: string) => void;
	onClick: (e: any) => void;
	disabled: boolean;
}

export function FarmDetailField({
	lpAddresses,
	buttonLabel,
	clearOnSend = true,
	label,
	available,
	value,
	onChange,
	onClick,
	disabled,
}: FarmDetailFieldProps): JSX.Element {
	const [fieldVal, setFieldVal] = useState(formatEther(value));
	const [debouncedOnChange] = useDebounce(onChange, 1000);

	const formattedAvailable = formatEther(available);

	const mergedProps = {
		...inputProps,
	};

	let buttonDisabled = disabled;

	if (disabled) {
		mergedProps.bgColor = 'gray.200';
	}
	if (value.gt(available)) {
		mergedProps.color = 'red';
		buttonDisabled = true;
	}

	const handleChange = (e: any) => {
		setFieldVal(e.target.value);
		debouncedOnChange(e.target.value);
	};

	const handleClick = (e: any) => {
		onClick(e);
		if (clearOnSend) setFieldVal('0');
	};

	return (
		<Box className="farmDetail">
			<Text>
				{label}
				{lpAddresses && (
					<SushiswapLink addresses={lpAddresses} marginLeft="7rem" color="bodytext" fontSize="sm" />
				)}
			</Text>

			<Text fontWeight="bold" cursor="pointer" onClick={() => onChange(formattedAvailable)}>
				{formattedAvailable}
			</Text>
			<HStack spacing="0.5rem">
				<Input {...mergedProps} value={fieldVal} onChange={handleChange} />
				<Button
					float="right"
					p="0 0.5rem"
					fontSize="sm"
					onClick={handleClick}
					disabled={buttonDisabled}
				>
					{buttonLabel}
				</Button>
			</HStack>
		</Box>
	);
}
