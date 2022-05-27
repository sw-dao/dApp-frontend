import { Box, HStack, Heading, Link, SimpleGrid, Text, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import React from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

import { PRODUCTS_BY_SYMBOL } from '../../../config/products';
import { PoolDescription } from '../../../config/types';
import { getTokenUrl } from '../../../utils';
import { CoinIcon } from '../../atoms/CoinIcon';

const SW_TOKENS = Object.keys(PRODUCTS_BY_SYMBOL);

function heightForIcon(symbol: string): string {
	return SW_TOKENS.includes(symbol) ? '2.5rem' : '2rem';
}

interface FarmHeaderProps {
	farm: PoolDescription;
	apr: string;
	isOpen: boolean;
	price: BigNumber;
	liquidity: BigNumber;
	stakedBalance: BigNumber;
	claimBalance: BigNumber;
	lpAddresses: [string, string];
	onToggle: () => void;
}

export function FarmHeader(props: FarmHeaderProps): JSX.Element {
	const {
		farm: { name, symbols },
		apr,
		isOpen,
		price,
		liquidity,
		stakedBalance,
		claimBalance,
		lpAddresses,
		onToggle,
	} = props;

	const CurrentIcon = isOpen ? AiOutlineUp : AiOutlineDown;

	const lpUrl = `https://app.sushi.com/add/${lpAddresses[0]}/${lpAddresses[1]}`;

	let lpValue = null;

	if (price && stakedBalance.gt(0)) {
		const label = `${formatEther(stakedBalance)} LP tokens @ $${price}`;
		lpValue = (
			<Tooltip label={label}>
				<Text color="bodytext">${formatEther(price.mul(stakedBalance))}</Text>
			</Tooltip>
		);
	}

	return (
		<SimpleGrid
			className="farmDetail"
			columns={6}
			spacing={4}
			padding=".5rem .5rem .5rem 1.5rem"
			textAlign="left"
		>
			<Box>
				<CoinIcon
					symbol={symbols[0]}
					src={getTokenUrl(symbols[0])[0]}
					height={heightForIcon(symbols[0])}
				/>
				<CoinIcon
					symbol={symbols[1]}
					src={getTokenUrl(symbols[1])[0]}
					height={heightForIcon(symbols[1])}
				/>
			</Box>
			<Box>
				<Heading fontSize="lg" mb="0.1rem">
					{name}
				</Heading>
				<Link target="_blank" rel="noreferrer" color="bodytext" fontSize="sm" href={lpUrl}>
					Get {name} LP
				</Link>
			</Box>
			<Box>
				<HStack spacing="2rem">
					<Text>{formatEther(stakedBalance)}</Text>
					{lpValue}
				</HStack>
				<Text color="bodytext">Staked</Text>
			</Box>
			<Box>
				<Text>{formatEther(claimBalance)} SWD</Text>
				<Text color="bodytext">Earned</Text>
			</Box>
			<Box>
				<Text>{apr ? `${apr.toString()}%` : '--'}</Text>
				<Text color="bodytext">APR</Text>
			</Box>
			<Box position="relative">
				<Text>{liquidity && `$${formatEther(liquidity)}`}</Text>
				<Text color="bodytext">Liquidity</Text>
				<Box position="absolute" top="1rem" right="1rem">
					<CurrentIcon onClick={onToggle} />
				</Box>
			</Box>
		</SimpleGrid>
	);
}
