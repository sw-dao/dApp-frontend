import { Input, InputProps } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { isValidNumber } from '../../utils';

type BNProps = Omit<InputProps, 'onChange'> & {
	onValueChange: (value: string) => void;
	disabled?: boolean;
};

export default function BigNumberInput(props: BNProps): JSX.Element {
	const { onValueChange, ...rest } = props;
	const { value } = rest;

	const handleChange = useMemo(
		() => (e: React.ChangeEvent<HTMLInputElement>) => {
			const { value: tgtValue } = e.target;
			if (tgtValue === '' || tgtValue === '.') {
				onValueChange('0');
				return;
			}
			if (!isValidNumber(tgtValue)) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			console.log('checking', value, tgtValue);

			// check for over-long input
			const parts = tgtValue.split('.');
			const ogParts = value ? `${value}`.split('.') : [];
			const lastPart = parts.length > 0 ? parts[parts.length - 1] : '';
			const lastOgPart = ogParts.length > 0 ? ogParts[ogParts.length - 1] : '';
			if (
				// more than one dot
				(parts.length > 2 && tgtValue.endsWith('.')) ||
				// decimal part too long
				(parts.length > 0 &&
					lastPart.length > 6 &&
					// allow for shortening overlong decimal part
					lastPart.length > lastOgPart.length)
			) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			try {
				// parse the value - and if successful, call the onValueChange handler
				parseFloat(tgtValue);
				onValueChange(tgtValue);
			} catch (e) {
				// pass
			}
		},
		[onValueChange, value],
	);

	return <Input onChange={handleChange} {...rest} />;
}
