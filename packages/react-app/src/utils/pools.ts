import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { Contract } from 'ethers';

import { SWD_FARMS } from '../config';
import { chains } from '../config/chains';
import { CONTRACT as slpContract } from '../config/slpContract';

interface PoolInfo {
	lpToken: string;
	allocPoint: BigNumber;
	lastRewardBlock: BigNumber;
	accSwdPerShare: BigNumber;
	name: string;
	symbols: string[];
	poolIndex: number;
}
interface PoolInfoMap {
	[key: string]: PoolInfo;
}
interface ContractMap {
	[key: string]: Contract;
}

const pools: PoolInfoMap = {};
const contracts: ContractMap = {};
const blocksPerDay = 24 * 60 * 4; // 4 blocks per minute
const blocksPerYear = blocksPerDay * 365;

export async function getPoolTokenForPool(
	chainId: string,
	poolId: number,
	provider: any,
): Promise<Contract | null> {
	const pool = await getPool(chainId, poolId, provider);
	if (!pool) {
		return null;
	}
	if (!contracts[pool.lpToken]) {
		contracts[pool.lpToken] = new Contract(pool.lpToken, slpContract.ABI, provider);
	}
	return contracts[pool.lpToken];
}

export async function getPoolBalance(
	chainId: string,
	poolId: number,
	address: string,
	provider: any,
): Promise<BigNumber> {
	const poolToken = await getPoolTokenForPool(chainId, poolId, provider);
	if (!poolToken) {
		console.warn('No pool token found for pool', poolId);
	} else {
		try {
			return await poolToken.balanceOf(address);
		} catch (e) {
			console.error(`Failed to get Pool Balance: Pool# ${poolId} @ ${address}`, e);
		}
	}
	console.warn('returing 0 bal for pool', poolId);
	return BigNumber.from(0);
}

export async function getPoolTotalSupply(
	chainId: string,
	poolId: number,
	provider: any,
): Promise<BigNumber> {
	const poolToken = await getPoolTokenForPool(chainId, poolId, provider);
	return poolToken?.totalSupply() || BigNumber.from(0);
}

export async function getStakedRatio(
	chainId: string,
	poolId: number,
	address: string,
	provider: any,
): Promise<BigNumber> {
	const balance = await getPoolBalance(chainId, poolId, address, provider);
	const totalSupply = await getPoolTotalSupply(chainId, poolId, provider);
	return balance.div(totalSupply);
}

export function getStakingContract(chainId: string, provider: any): Contract | null {
	const {
		contracts: {
			Staking: { address, abi },
		},
	} = chains[chainId];
	if (!address || !abi) {
		console.error('No staking contract found for chain', chainId);
		return null;
	}
	if (!contracts[address]) {
		contracts[address] = new Contract(address, abi, provider);
	}
	return contracts[address];
}

/**
 * Get the total staked amount in the pool
 * @param {Number} poolId
 * @param {Provider} provider
 * @returns {<Promise>BigNumber} staked amount
 */
export async function getPoolStaked(
	chainId: string,
	poolId: number,
	provider: any,
): Promise<BigNumber> {
	const poolToken = await getPoolTokenForPool(chainId, poolId, provider);
	const stakingContract = await getStakingContract(chainId, provider);
	if (!poolToken) {
		console.warn('No pool token found for pool', poolId);
	}
	if (!stakingContract) {
		console.warn('No staking contract found for chain', chainId);
	}
	if (poolToken && stakingContract) {
		try {
			return poolToken.balanceOf(stakingContract.address);
		} catch (e) {
			console.error(
				`Failed to get Pool Staked Balance: Pool# ${poolId} @ ${stakingContract.address}`,
				e,
			);
		}
	}
	console.warn('returning 0 staked for pool', poolId);
	return BigNumber.from(0);
}

/**
 * From PancakeSwap
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const calculatePoolApr = (
	stakingTokenPrice: BigNumber,
	rewardTokenPrice: BigNumber,
	totalStaked: BigNumber,
	tokenPerBlock: BigNumber,
): BigNumber => {
	const totalRewardPricePerYear = rewardTokenPrice.mul(tokenPerBlock).mul(blocksPerYear);
	const totalStakingTokenInPool = stakingTokenPrice.mul(totalStaked);
	const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).mul(100);
	return apr;
};

export async function getPool(
	chainId: string,
	poolId: number,
	provider: any,
): Promise<PoolInfo | null> {
	if (!pools[poolId]) {
		const contract = getStakingContract(chainId, provider);
		if (!contract) {
			console.warn('No staking contract found for chain', chainId);
			return null;
		}
		const pool = await contract.poolInfo(poolId);
		// add name and symbols
		const farm = SWD_FARMS.find(({ poolIndex }) => poolIndex === poolId);
		const decorated = farm ? { ...farm, ...pool } : pool;
		pools[poolId] = decorated;
	}
	return pools[poolId];
}

export const getPoolApr = async (
	chainId: string,
	poolId: number,
	poolTokenPrice: BigNumber,
	rewardTokenPrice: BigNumber,
	provider: any,
): Promise<string | null> => {
	const totalStaked = await getPoolStaked(chainId, poolId, provider);
	if (totalStaked.eq(0)) {
		console.log('No staked');
		return null;
	}
	const tokenPerBlock = await getPoolRewardPerBlock(chainId, poolId, provider);

	const pool = await getPool(chainId, poolId, provider);
	if (!pool) {
		console.warn('No pool found for pool', poolId, chainId);
		return null;
	}
	const { allocPoint } = pool;
	const stakingContract = getStakingContract(chainId, provider);
	const totalAllocPoints = (await stakingContract?.totalAllocPoint()) || BigNumber.from(0);
	console.log(allocPoint.toString(), totalAllocPoints.toString());
	return calculatePoolApr(
		poolTokenPrice,
		rewardTokenPrice,
		totalStaked,
		tokenPerBlock.mul(allocPoint).div(totalAllocPoints),
	).toString();
};

export const getPoolTokenPrice = async (
	chainId: string,
	poolId: number,
	pairPrices: Array<number>,
	provider: any,
): Promise<BigNumber | null> => {
	const poolToken = await getPoolTokenForPool(chainId, poolId, provider);
	if (!poolToken) {
		console.warn('No pool token found for pool', poolId, chainId);
		return null;
	}
	const reserves = await poolToken.getReserves();
	if (!pairPrices.every((p) => !!p)) {
		console.log("Some null pairprices, can't calculate APR");
		return null;
	}
	const mantissa = parseEther('1');
	const values = pairPrices.map((p, ix) => reserves[ix].mul(parseEther('0' + p)).div(mantissa));
	const total = values[0].add(values[1]);
	const totalSupply = await getPoolTotalSupply(chainId, poolId, provider);
	const price = total.div(totalSupply);
	return price;
};

export async function getPoolRewardPerBlock(
	chainId: string,
	poolId: number,
	provider: any,
): Promise<BigNumber> {
	const stakingContract = getStakingContract(chainId, provider);
	if (!stakingContract) {
		console.warn('No staking contract found for chain', chainId);
		return BigNumber.from(0);
	}
	const stakingReward = await stakingContract.swdPerBlock();
	const pool = await getPool(chainId, poolId, provider);
	if (!pool) {
		console.warn('No pool found for pool', poolId, chainId);
		return BigNumber.from(0);
	}
	const { allocPoint } = pool;
	return stakingReward.mul(allocPoint.div(100));
}

export async function getPoolClaimBalance(
	chainId: string,
	poolId: number,
	address: string,
	provider: any,
): Promise<BigNumber> {
	const contract = getStakingContract(chainId, provider);
	return contract?.pendingSwd(poolId, address) || BigNumber.from(0);
}

export async function getPoolStakedBalance(
	chainId: string,
	poolId: number,
	address: string,
	provider: any,
): Promise<[BigNumber, BigNumber]> {
	const contract = getStakingContract(chainId, provider);
	const info = contract?.userInfo(poolId, address);
	if (info === null) {
		console.warn('no info for pool', poolId, address);
		const zero = BigNumber.from(0);
		return [zero, zero];
	}
	return info;
}

export async function stakeInPool(
	chainId: string,
	poolId: number,
	amount: BigNumber,
	wallet: any,
): Promise<any> {
	const { provider }: { provider: Web3Provider } = wallet;
	const signer = provider.getSigner(0);
	const contract = getStakingContract(chainId, provider);
	return contract?.connect(signer).deposit(poolId, amount);
}

export async function unstakeFromPool(
	chainId: string,
	poolId: number,
	amount: BigNumber,
	wallet: any,
): Promise<any> {
	const provider: Web3Provider = wallet.provider;
	const signer = provider.getSigner(0);
	const contract = getStakingContract(chainId, provider);
	return contract?.connect(signer).withdraw(poolId, amount);
}
