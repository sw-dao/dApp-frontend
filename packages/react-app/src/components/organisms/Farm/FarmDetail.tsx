import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';

import { FarmDetailField } from './FarmDetailField';

const ZERO = parseEther('0');

interface FarmDetailProps {
	allowance: BigNumber;
	connected: boolean;
	lpAddresses: [string, string];
	isOpen: boolean;
	claimBalance: BigNumber;
	stakedBalance: BigNumber;
	unstakedBalance: BigNumber;
	onChange: (action: string, value: BigNumber) => void;
}

export function FarmDetail(props: FarmDetailProps): JSX.Element {
	const {
		allowance = ZERO,
		connected = false,
		lpAddresses,
		isOpen = false,
		claimBalance = ZERO,
		stakedBalance = ZERO,
		unstakedBalance = ZERO,
		onChange,
	} = props;

	const [unstaked, setUnstaked] = useState(unstakedBalance);
	const [lastUnstaked, setLastUnstaked] = useState(unstakedBalance);
	const [staked, setStaked] = useState(ZERO);
	const [lastStaked, setLastStaked] = useState(ZERO);

	useEffect(() => {
		// only update if the user has not changed the value
		if (unstaked === lastUnstaked) {
			setUnstaked(unstakedBalance);
			setLastUnstaked(unstakedBalance);
		}
	}, [lastUnstaked, unstakedBalance, unstaked]);

	useEffect(() => {
		// only update if the user has not changed the value
		if (staked === lastStaked) {
			setStaked(stakedBalance);
			setLastStaked(stakedBalance);
		}
	}, [lastStaked, stakedBalance, staked]);

	const handleClaim = (evt: any) => {
		evt?.preventDefault();
		onChange('claim', staked);
	};

	const handleStake = (evt: any) => {
		evt?.preventDefault();
		if (!isAuthorized) {
			onChange('authorize', unstaked);
		} else {
			onChange('stake', unstaked);
		}
	};

	const handleUnstake = (evt: any) => {
		evt?.preventDefault();
		onChange('unstake', staked);
	};

	// handle an update to the "unstaked" field
	const handleUnstakedChange = (value: string) => {
		try {
			setUnstaked(parseEther(value));
		} catch (e) {
			// ignore
		}
	};

	// handle an update to the "staked" field
	const handleStakedChange = (value: string) => {
		try {
			setStaked(parseEther(value));
		} catch (e) {
			// ignore
		}
	};

	const isAuthorized = allowance && unstaked && allowance.gte(unstaked);

	if (!isOpen) {
		return <></>;
	}

	return (
		<Grid
			textAlign="left"
			minHeight="3rem"
			bgColor="page.bg"
			templateColumns="repeat(5, 1fr)"
			gap="0.5rem"
			padding="0.5rem 0.5rem 0.5rem 1.5rem"
			margin="0.5rems 0"
		>
			<GridItem colSpan={2}>
				<FarmDetailField
					buttonLabel={isAuthorized ? 'Stake' : 'Authorize'}
					label="Your LP Balance"
					lpAddresses={lpAddresses}
					disabled={!connected}
					available={unstakedBalance}
					value={unstaked}
					onChange={handleUnstakedChange}
					onClick={handleStake}
					clearOnSend={isAuthorized}
				/>
			</GridItem>
			<GridItem colSpan={2}>
				<FarmDetailField
					buttonLabel="Unstake"
					label="LP Staked"
					disabled={!connected}
					available={stakedBalance}
					value={staked}
					onChange={handleStakedChange}
					onClick={handleUnstake}
					clearOnSend={false}
					lpAddresses={lpAddresses}
				/>
			</GridItem>
			<GridItem>
				<Text>SWD Earned</Text>
				<Text>&nbsp;</Text>
				<HStack spacing="1rem">
					<Text fontWeight="bold" w="50%">
						{formatEther(claimBalance)}
					</Text>
					<Button
						float="right"
						p="0 1rem"
						fontSize="sm"
						disabled={!connected}
						onClick={handleClaim}
					>
						Claim
					</Button>
				</HStack>
			</GridItem>
		</Grid>
	);
}
