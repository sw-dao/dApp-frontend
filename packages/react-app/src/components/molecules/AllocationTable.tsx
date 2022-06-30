import { Center, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useWallet } from '@raidguild/quiver';
import { formatUnits } from 'ethers/lib/utils';
import PromiseThrottle from 'promise-throttle';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { DEFAULT_CHAIN_ID } from '../../config';
import { getCoinDataByAddress } from '../../services/coingecko';
import { allSwappableTokensState, breakpointState } from '../../state';
import { PositionStructOutput } from '../../typechain/ISetToken';
import { TokenSummaryInfoMap } from '../../types';
import { getTokenUrl } from '../../utils';
import { decimalsOf, getSetToken, getSymbolMap } from '../../utils/contracts';
import { CoinIcon } from '../atoms/CoinIcon';
import DisplayNumber from '../atoms/DisplayNumber';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

type PositionMap = {
	[key: string]: {
		quantity: string;
		allocation: string;
		value: string;
		amount: number;
		change: string;
	};
};

type AllocationTableProps = {
	symbol: string;
};

async function getPrices(componentTokens: TokenSummaryInfoMap, chainId: string) {
	const prices: Record<string, [number, number]> = {};

	const promiseThrottle = new PromiseThrottle({
		requestsPerSecond: 1,
		promiseImplementation: Promise,
	});
	const cId = chainId ?? DEFAULT_CHAIN_ID;
	const promises = Object.keys(componentTokens).map(async (sym) => {
		const address = componentTokens[sym].address;
		return promiseThrottle.add(async () => {
			const data = await getCoinDataByAddress(address, cId);
			if (data && data.success) {
				const { market_data } = data.data;
				const pair: [number, number] = [
					market_data.current_price.usd | 0,
					market_data.price_change_percentage_24h | 0,
				];
				prices[sym] = pair;
			}
		});
	});
	await Promise.all(promises);

	return prices;
}

export function AllocationTable(props: AllocationTableProps): JSX.Element {
	const { symbol } = props;
	const breakpoint = useRecoilValue(breakpointState);
	const [positions, setPositions] = useState<PositionStructOutput[]>([]);
	const [componentTokens, setComponentTokens] = useState<TokenSummaryInfoMap>({});
	const [positionMap, setPositionMap] = useState<PositionMap>({});
	const [priceMap, setPriceMap] = useState<Record<string, [number, number]>>({});
	const [addresses, setAddresses] = useState<string[]>([]);

	const [loading, setLoading] = useState<boolean>(false);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [updated, setUpdated] = useState(0);
	const { isConnected, provider, chainId } = useWallet();
	const swappable = useRecoilValue(allSwappableTokensState);
	const allowedTokens = useMemo(
		() => ({ ...swappable.ERC20, ...swappable.TokenProducts }),
		[swappable],
	);

	useEffect(() => {
		if (
			isConnected &&
			provider &&
			Object.keys(componentTokens).length > 0 &&
			!loading &&
			!loaded &&
			new Date().getTime() - updated > 10000
		) {
			setUpdated(new Date().getTime());
			setLoading(true);
			getPrices(componentTokens, chainId || DEFAULT_CHAIN_ID)
				.then((prices) => {
					setPriceMap(prices);
					setLoaded(true);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [isConnected, provider, componentTokens, chainId, loading, loaded]);

	useEffect(() => {
		if (isConnected && provider && allowedTokens[symbol] && !loading) {
			const address = allowedTokens[symbol]?.address || '';
			if (!address) {
				console.warn('No address for token', symbol);
				return;
			}
			const settokenContract = getSetToken(allowedTokens[symbol].address, provider);
			if (!settokenContract) {
				console.warn('No settoken contract for token', symbol);
			}
			setLoading(true);
			settokenContract
				?.getComponents()
				.then((components) => {
					setAddresses(components);
					return settokenContract.getPositions();
				})
				.then((positions: PositionStructOutput[]) => {
					setPositions(positions);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [allowedTokens, isConnected, loading, provider, symbol]);

	// reverse the token maps to map address to symbol
	const addressMap: Record<string, string> = useMemo(() => {
		const map: Record<string, string> = {};
		const tokenAddresses = {
			...allowedTokens,
			...componentTokens,
		};
		Object.keys(tokenAddresses).forEach((token) => {
			map[tokenAddresses[token].address] = token;
		});
		return map;
	}, [allowedTokens, componentTokens]);

	useEffect(() => {
		if (loaded && addressMap && Object.keys(positionMap).length !== positions.length) {
			const map: PositionMap = {};
			let total = 0;
			positions.forEach((position) => {
				const { component: address, unit: balance } = position;
				const symbol = addressMap[address];
				const quantity = formatUnits(balance, decimalsOf(symbol));
				const [price, change] = priceMap[symbol] || [0, 0];
				const value = price * parseFloat(quantity);
				map[symbol] = {
					quantity,
					allocation: '',
					amount: value,
					value: currencyFormatter.format(value),
					change: `${change.toFixed(2)}%`,
				};
				total += value;
			});
			Object.keys(map).forEach((symbol) => {
				const percent = (map[symbol].amount / total) * 100;
				map[symbol].allocation = `${percent.toFixed(2)}%`;
			});
			setPositionMap(map);
		}
	}, [addressMap, positions, loaded, componentTokens, priceMap, positionMap]);

	useEffect(() => {
		if (isConnected && provider && addresses.length > 0) {
			// We've got a list of addresses of components of the tokenset
			// but we need a symbol for all of them, so that we can use them
			// in the main getBalance Loop
			getSymbolMap(addresses, provider).then((symbolMap) => {
				setComponentTokens(symbolMap);
			});
		}
	}, [addresses, allowedTokens, isConnected, positions, provider, symbol]);

	const tableRows = useMemo(() => {
		const keys = Object.keys(positionMap);
		if (!keys.length) {
			return (
				<Tr>
					<Td colSpan={breakpoint === 'sm' ? 4 : 5}>
						<Center>
							{isConnected ? (
								<Spinner size="lg" />
							) : (
								<Text>Connect wallet to load current data.</Text>
							)}
						</Center>
					</Td>
				</Tr>
			);
		}
		keys.sort();
		return keys.map((symbol) => {
			const position = positionMap[symbol];
			if (parseFloat(position.quantity) < 0.001) {
				return;
			}
			return (
				<Tr key={symbol} color="purple">
					<Td padding="0 0 0 0.5em" className="nobreak coin">
						<CoinIcon symbol={symbol} src={getTokenUrl(symbol)[0]} />
						<Text fontSize="0.7rem" d="inline-block" className="symbol">
							{symbol}
						</Text>
					</Td>
					{breakpoint !== 'sm' && (
						<Td textAlign="center" fontSize="0.8rem" padding="0 0.25em">
							<DisplayNumber value={position.quantity} symbol={symbol} hideSymbol />
						</Td>
					)}
					{breakpoint !== 'sm' && (
						<Td textAlign="center" fontSize="0.8rem" padding="0 0.25em">
							{position.value}
						</Td>
					)}
					<Td textAlign="center" fontSize="0.8rem" padding="0 0.25em">
						{position.allocation}
					</Td>
					<Td textAlign="center" fontSize="0.8rem" padding="0 0.25em">
						{position.change}
					</Td>
				</Tr>
			);
		});
	}, [breakpoint, isConnected, positionMap]);

	return (
		<Table
			variant="unstyled"
			bgColor="blue5"
			className="token"
			fontSize="0.9rem"
			borderRadius="2em"
		>
			<Thead>
				<Tr color="alttext" textAlign="center">
					<Th textAlign="center" bgColor="bodydark" borderRadius="2em 0 0 0">
						Name
					</Th>
					{breakpoint !== 'sm' && (
						<Th textAlign="center" bgColor="bodydark">
							Quantity per token
						</Th>
					)}
					{breakpoint !== 'sm' && (
						<Th textAlign="center" bgColor="bodydark">
							Value per token
						</Th>
					)}
					<Th textAlign="center" bgColor="bodydark">
						Allocation
					</Th>
					<Th textAlign="center" bgColor="bodydark" borderRadius="0 2em 0 0">
						24hr Change
					</Th>
				</Tr>
			</Thead>
			<Tbody>{tableRows}</Tbody>
		</Table>
	);
}
