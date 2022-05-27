import { Box, useToast } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionReceipt } from '@ethersproject/providers';
import { WalletContextType, useWallet } from '@raidguild/quiver';
import { useOnRepetition } from 'eth-hooks';
import { Contract } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';

import { PoolDescription } from '../../../config/types';
import { useEthPrice } from '../../../hooks/useEthPrice';
import { allSwappableTokensState, tokenDetailsForCurrentPeriod } from '../../../state';
import { Toaster, TokenSummaryInfoMap } from '../../../types';
import { getRequiredApprovals } from '../../../utils';
import {
	getPoolApr,
	getPoolClaimBalance,
	getPoolStaked,
	getPoolStakedBalance,
	getPoolTokenForPool,
	getPoolTokenPrice,
	getStakingContract,
	stakeInPool,
	unstakeFromPool,
} from '../../../utils/pools';
import { showErrorToast, showSuccessToast, showToast } from '../../../utils/toasts';
import { TransactionDescription } from '../../atoms/TransactionDescription';
import { FarmDetail } from './FarmDetail';
import { FarmHeader } from './FarmHeader';

const ZERO = parseEther('0');
const APPROVAL_MESSAGES = {
	waiting: 'Waiting for approval to be confirmed before we can stake.',
	rejected: 'We cannot stake without this contract permission, sorry.',
	success: 'Approval confirmed, you can now click "Stake"',
};

const doStake = async (
	chainId: string,
	poolId: number,
	amount: BigNumber,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<TransactionReceipt | null> => {
	console.log('Sending Stake', poolId, formatEther(amount));
	const provider = wallet.provider;
	if (!provider) {
		console.error('⚠ Cannot stake without a provider');
		return null;
	}
	try {
		const stakeTx = await stakeInPool(chainId, poolId, amount, wallet);
		let description = (
			<TransactionDescription
				message={`Sent stake of ${formatEther(amount)}`}
				tx={stakeTx.hash}
				chainId={chainId}
			/>
		);
		showToast(`send_${poolId}`, { status: 'info', title: 'Sent', description }, toast);
		await provider.waitForTransaction(stakeTx.hash);
		description = (
			<TransactionDescription
				message={`Staked ${formatEther(amount)}`}
				tx={stakeTx.hash}
				chainId={chainId}
			/>
		);
		showSuccessToast(`success_${poolId}`, { description }, toast);
		return provider.getTransactionReceipt(stakeTx.hash);
	} catch (error) {
		console.error('⚠ Could not send stake', error);
		showErrorToast(`error_${poolId}`, {}, error, toast);
		return null;
	}
};

type StakingMessages = {
	tx: string;
	success: string;
	error: string;
};

const UNSTAKE_MESSAGES = (amount: BigNumber): StakingMessages => ({
	tx: `Sent unstake request for ${formatEther(amount)}`,
	success: `Unstaked ${formatEther(amount)}`,
	error: 'Could not unstake',
});

const CLAIM_MESSAGES = (amount: BigNumber): StakingMessages => ({
	tx: `Sent claim request for ${formatEther(amount)}.`,
	success: `Claimed ${formatEther(amount)} SWD`,
	error: 'Could not claim',
});

const doUnstake = async (
	chainId: string,
	poolId: number,
	amount: BigNumber,
	wallet: WalletContextType,
	toast: Toaster,
	messages: StakingMessages,
): Promise<TransactionReceipt | null> => {
	console.log(messages.tx, poolId, formatEther(amount));
	const provider = wallet.provider;
	if (!provider) {
		console.error('⚠ Cannot unstake without a provider');
		return null;
	}
	try {
		const stakeTx = await unstakeFromPool(chainId, poolId, amount, wallet);
		let description = (
			<TransactionDescription message={messages.tx} tx={stakeTx.hash} chainId={chainId} />
		);
		showToast(`send_un${poolId}`, { status: 'info', title: 'Sent', description }, toast);
		await provider.waitForTransaction(stakeTx.hash);
		description = (
			<TransactionDescription message={messages.success} tx={stakeTx.hash} chainId={chainId} />
		);
		showSuccessToast(`success_un${poolId}`, { description }, toast);
		return provider.getTransactionReceipt(stakeTx.hash);
	} catch (error) {
		console.error(`⚠ ${messages.error}`, error);
		showErrorToast(`error_un${poolId}`, {}, error, toast);
		return null;
	}
};

async function updateAllowance(
	poolIndex: number,
	poolToken: Contract,
	address: string,
	target: string,
	current: BigNumber,
	setter: SetterOrUpdater<BigNumber>,
) {
	let allowance = current;
	try {
		allowance = await poolToken.allowance(address, target);
		if (hasChanged(allowance, current)) {
			console.log(`new allowance for poolToken ${poolIndex} is ${formatEther(allowance)}`);
			setter(allowance);
		}
	} catch (e) {
		console.error('⚠ Could not get token allowance', e);
	}
	return allowance;
}

async function updateClaimBalance(
	chainId: string,
	poolIndex: number,
	address: string,
	current: BigNumber,
	setter: SetterOrUpdater<BigNumber>,
	provider: any,
) {
	try {
		const claimBalance = await getPoolClaimBalance(chainId, poolIndex, address, provider);
		if (hasChanged(claimBalance, current)) {
			console.log(`new claim balance for poolToken ${poolIndex} is ${formatEther(claimBalance)}`);
			setter(claimBalance);
		}
	} catch (e) {
		console.error('⚠ Could not get claim balance', e);
	}
}

async function updateStakedBalance(
	chainId: string,
	poolIndex: number,
	address: string,
	currentStaked: BigNumber,
	setter: SetterOrUpdater<BigNumber>,
	provider: any,
) {
	try {
		const [stakedBalance] = await getPoolStakedBalance(chainId, poolIndex, address, provider);
		if (hasChanged(stakedBalance, currentStaked)) {
			console.log(`new staked balance for poolToken ${poolIndex} is ${stakedBalance}`);
			setter(stakedBalance);
		}
	} catch (e) {
		console.error('⚠ Could not get staked balance', e);
	}
}

async function updateUnstakedBalance(
	poolIndex: number,
	poolToken: Contract,
	address: string,
	current: BigNumber,
	setter: SetterOrUpdater<BigNumber>,
) {
	try {
		// eslint-disable-next-line
		const balance = await poolToken.balanceOf(address);
		if (hasChanged(balance, current)) {
			console.log(`new unstaked balance for poolToken ${poolIndex} is ${formatEther(balance)}`);
			setter(balance);
		}
	} catch (e) {
		console.error('⚠ Could not get unstaked balance', e);
	}
}

const hasChanged = (current: BigNumber, newValue: BigNumber): boolean => {
	return current < newValue || current > newValue;
};

const symbolToLpAddress = (symbol: string, tokens: TokenSummaryInfoMap) => {
	if (symbol === 'ETH') return 'ETH';
	if (symbol === 'MATIC') return 'MATIC';
	return tokens[symbol]?.address || '';
};

interface FarmProps {
	farm: PoolDescription;
}

export function FarmWrapper({ farm }: FarmProps): JSX.Element {
	const { poolIndex, symbols } = farm;
	const [isOpen, setIsOpen] = useState(true);
	const [unstakedBalance, setUnstakedBalance] = useState(ZERO);
	const [authBalance, setAuthBalance] = useState(ZERO);
	const [claimBalance, setClaimBalance] = useState(ZERO);
	const [stakedBalance, setStakedBalance] = useState(ZERO);
	const [poolToken, setPoolToken] = useState<Contract | null>(null);
	const [poolTokenPrice, setPoolTokenPrice] = useState<BigNumber | null>(null);
	const [poolStaked, setPoolStaked] = useState(ZERO);
	const [stakingContract, setStakingContract] = useState<Contract | null>(null);
	const [apr, setApr] = useState<string>('');
	const [swdPrice, setSwdPrice] = useState(0);
	const tokens = useRecoilValue(tokenDetailsForCurrentPeriod);
	const swappable = useRecoilValue(allSwappableTokensState);
	const ethPrice = useEthPrice();

	const toast: Toaster = useToast();
	const wallet = useWallet();

	const { address, provider, isConnected, chainId } = wallet;
	const allTokens: TokenSummaryInfoMap = useMemo(
		() => ({ ...swappable.ERC20, ...swappable.TokenProducts }),
		[swappable],
	);

	const lpAddresses = useMemo(() => {
		if (!!swappable) {
			return [
				symbolToLpAddress(symbols[0], allTokens),
				symbolToLpAddress(symbols[1], allTokens),
			] as [string, string];
		}
		return ['', ''] as [string, string];
	}, [allTokens, swappable, symbols]);

	useEffect(() => {
		if (isConnected && provider && chainId) {
			getPoolTokenForPool(chainId, poolIndex, provider)
				.then((p) => {
					setPoolToken(p);
				})
				.catch((e) => {
					console.error('⚠ Could not get pool token', e);
				});
			setStakingContract(getStakingContract(chainId, provider));
		}
	}, [provider, isConnected, setPoolToken, poolIndex, chainId]);

	useEffect(() => {
		if (tokens && provider && chainId) {
			const prices = symbols.map((symbol) =>
				symbol === 'ETH' ? ethPrice : tokens[symbol]?.currentPrice,
			);
			const swdPrice = tokens.SWD?.currentPrice;
			if (swdPrice) {
				setSwdPrice(swdPrice);
			}

			if (!(prices && swdPrice && prices[0] && prices[1])) {
				console.log('⚠️ Prices not ready');
			} else {
				console.log('💰 Prices ready', prices, swdPrice);
				getPoolTokenPrice(chainId, poolIndex, prices as number[], provider)
					.then((p) => {
						setPoolTokenPrice(p);
					})
					.catch((e) => {
						console.error('⚠ Could not get pool token price', e);
					});
			}
		}
	}, [symbols, ethPrice, setSwdPrice, provider, setApr, swdPrice, poolIndex, chainId, tokens]);

	useEffect(() => {
		if (poolTokenPrice && swdPrice && provider && chainId) {
			getPoolStaked(chainId, poolIndex, provider).then((s) => {
				setPoolStaked(s.mul(poolTokenPrice));
			});

			const swdPriceInWei = parseEther(swdPrice.toString());
			getPoolApr(chainId, poolIndex, poolTokenPrice, swdPriceInWei, provider).then((p) => {
				if (p) setApr(p);
			});
		}
	}, [provider, poolTokenPrice, poolIndex, setApr, swdPrice, setPoolStaked, chainId]);

	const updateAll = useCallback(() => {
		if (isConnected && provider && address && poolToken && stakingContract && chainId) {
			return Promise.all([
				updateAllowance(
					poolIndex,
					poolToken,
					address,
					stakingContract.address,
					authBalance,
					setAuthBalance,
				),
				updateClaimBalance(chainId, poolIndex, address, claimBalance, setClaimBalance, provider),
				updateStakedBalance(chainId, poolIndex, address, stakedBalance, setStakedBalance, provider),
				updateUnstakedBalance(poolIndex, poolToken, address, unstakedBalance, setUnstakedBalance),
			]);
		}
	}, [
		address,
		authBalance,
		chainId,
		claimBalance,
		isConnected,
		provider,
		poolToken,
		stakingContract,
		poolIndex,
		stakedBalance,
		unstakedBalance,
	]);

	const pollBalance = useCallback(async () => {
		if (poolToken != null && stakingContract != null) {
			updateAll();
		}
	}, [poolToken, stakingContract, updateAll]);

	useOnRepetition(pollBalance, {
		pollTime: 60 * 1000 * 1, // 1 minute
		leadingTrigger: (poolToken && poolToken.provider != null) || false,
	});

	const handleChange = (change: string, value: BigNumber) => {
		if (poolToken != null && stakingContract != null && isConnected && chainId) {
			switch (change) {
				case 'claim':
					console.log(`claiming rewards for poolToken ${poolIndex}`);
					doUnstake(chainId, poolIndex, ZERO, wallet, toast, CLAIM_MESSAGES(claimBalance)).then(
						() => updateAll(),
					);
					break;
				case 'stake':
					doStake(chainId, poolIndex, value, wallet, toast).then(() => updateAll());
					break;
				case 'unstake':
					doUnstake(chainId, poolIndex, value, wallet, toast, UNSTAKE_MESSAGES(value)).then(() =>
						updateAll(),
					);
					break;
				case 'authorize':
					console.log(`Requesting approval for poolToken ${poolIndex}`);
					getRequiredApprovals(
						{
							sellToken: symbols.join('-'),
							sellAddr: poolToken.address,
							sellAmount: parseFloat(formatEther(value)),
							sellUnits: BigNumber.from(value),
						},
						stakingContract.address,
						wallet,
						toast,
						APPROVAL_MESSAGES,
					).then(() =>
						updateAllowance(
							poolIndex,
							poolToken,
							address || '',
							stakingContract.address,
							authBalance,
							setAuthBalance,
						),
					);

					break;
				default:
					console.error(`unknown change ${change}`);
			}
		}
	};

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Box
			className="farm"
			borderWidth="1px"
			borderColor="lightline"
			bgColor="bodydark"
			color="white"
			borderRadius="2rem .2rem 2rem .2rem"
			width="100%"
			m="1rem"
		>
			<FarmHeader
				farm={farm}
				isOpen={isOpen}
				onToggle={handleToggle}
				lpAddresses={lpAddresses}
				stakedBalance={stakedBalance}
				claimBalance={claimBalance}
				price={poolTokenPrice || ZERO}
				liquidity={poolStaked}
				apr={apr}
			/>
			<FarmDetail
				isOpen={isOpen}
				allowance={authBalance}
				claimBalance={claimBalance}
				stakedBalance={stakedBalance}
				unstakedBalance={unstakedBalance}
				connected={isConnected}
				lpAddresses={lpAddresses}
				onChange={handleChange}
			/>
		</Box>
	);
}
