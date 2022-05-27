import { Box } from '@chakra-ui/react';
import Fuse from 'fuse.js';
import React, { useMemo } from 'react';
import SelectSearch from 'react-select-search';
import { useRecoilValue } from 'recoil';

import { PRODUCTS } from '../../config/products';
import { tokenDetailsForCurrentPeriod } from '../../state';
import { TokenDetails, TokenDetailsMap } from '../../types';
import { getOverriddenDetails } from '../../utils';
import { SearchIcon } from './ClientIcons';

type OptionType = {
	name: string;
	value: string;
	symbol: string;
};

const toOption = (token: TokenDetails, longLabel: boolean): OptionType => {
	let { symbol = '' } = token;
	symbol = symbol.toUpperCase();
	const overrides = getOverriddenDetails(symbol);
	const label = overrides.name || symbol;

	return {
		name: label && longLabel ? label : symbol,
		value: symbol,
		symbol,
	};
};

const makeOptions = (tokens: TokenDetailsMap, longLabel: boolean): OptionType[] => {
	const tokensList: Array<TokenDetails> = Object.values(tokens);
	const opts = tokensList.map((token) => toOption(token, longLabel));
	PRODUCTS.forEach((p) => {
		if (!opts.find((o) => o.symbol === p.symbol)) {
			opts.push({
				name: p.name,
				value: p.symbol,
				symbol: p.symbol,
			});
		}
	});
	opts.sort((a, b) => (a.name > b.name ? 1 : -1));
	return opts;
};
/*
const customStyles = {
	option: (styles: any) => {
		return {
			...styles,
			textAlign: 'left',
			fontStyle: 'underline',
		};
	},
}; */

function fuzzySearch(options: any): any {
	const fuse = new Fuse(options, {
		keys: ['name', 'value', 'symbol', 'allocation.name', 'allocation.symbol'],
		threshold: 0.3,
	});

	return (value: string) => {
		if (!value.length) {
			return []; //options;
		}

		const found = fuse.search(value);
		return found.map((f) => f.item);
	};
}

interface SearchFieldProps {
	label: string;
	longLabel?: boolean;
	mobile: boolean;
	onChange: (search: any) => void;
	right?: number;
	top?: string;
	height?: string;
	width?: string | Array<null | string>;
	zIndex?: number;
	fontSize?: string;
	absolute?: boolean;
}

export function SearchField(props: SearchFieldProps): JSX.Element {
	const {
		label,
		longLabel = true,
		mobile,
		onChange,
		height = '1.5rem',
		right = 0,
		top = '0',
		width = '8rem',
		zIndex = 100,
		absolute = false,
	} = props;
	const tokenDetails = useRecoilValue(tokenDetailsForCurrentPeriod);
	const options = React.useMemo(() => {
		const opts = makeOptions(tokenDetails, longLabel);
		return opts;
	}, [tokenDetails, longLabel]);

	const classes = useMemo(() => {
		const c = [];
		if (!absolute) {
			c.push('searchbox');
			c.push('not-absolute');
		} else {
			c.push('search');
		}
		c.push(mobile ? 'mobile' : 'desktop');
		return c.join(' ');
	}, [absolute, mobile]);

	if (absolute) {
		return (
			<Box position="absolute" right={right} top={top}>
				<Box width={width} d="inline-block" position="relative" color="alttext" zIndex={zIndex}>
					<SelectSearch
						className={classes}
						options={options}
						filterOptions={fuzzySearch}
						placeholder={label}
						search={true}
						onChange={onChange}
					/>
					<SearchIcon position="absolute" left="1rem" top=".6rem" width="2rem" height={height} />
				</Box>
			</Box>
		);
	}
	return (
		<SelectSearch
			className={classes}
			options={options}
			filterOptions={fuzzySearch}
			placeholder={label}
			search={true}
			onChange={onChange}
		/>
	);
}
