/**
 * Popup for selecting category on narrow screens
 */

import { Box, List, ListItem } from '@chakra-ui/react';
import { navigate } from 'hookrouter';
import React, { useMemo } from 'react';

import { SearchField } from '../../atoms/SearchField';

interface PanelProps {
	categoryButtons: JSX.Element[];
}

const listItemStyle: any = {
	color: 'bodytext',
	fontSize: 'xl',
	mb: '16px',
};

function handleSearch(token: string): void {
	if (token === 'SWD') {
		navigate('/token');
	} else {
		navigate(`/product/${token}`);
	}
}

export default function CategoryPanel({ categoryButtons }: PanelProps): JSX.Element {
	const catList = useMemo(
		() =>
			categoryButtons.map((category: JSX.Element, index: number) => (
				<ListItem key={`cat_${index}`} {...listItemStyle}>
					{category}
				</ListItem>
			)),
		[categoryButtons],
	);

	return (
		<Box borderRadius="lg" border="1px solid sunsetblue">
			<List>
				{catList}
				<ListItem>
					<Box
						width="15rem"
						textAlign="left"
						bgColor="black"
						borderRadius="3em"
						borderColor="#fff"
						position="relative"
					>
						<SearchField
							label="Search"
							width="15rem"
							onChange={handleSearch}
							longLabel={true}
							zIndex={40}
							mobile={false}
						/>
					</Box>
				</ListItem>
			</List>
		</Box>
	);
}
