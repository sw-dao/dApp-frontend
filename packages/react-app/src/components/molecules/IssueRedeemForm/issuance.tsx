import { BigNumber } from '@ethersproject/bignumber';
import { Provider } from '@ethersproject/providers';
import { WalletContextType } from '@raidguild/quiver';
import { Contract, ethers } from 'ethers';

import { DEFAULT_CHAIN_ID } from '../../../config';
import { SetToken } from '../../../typechain/SetToken';
import {
	AllowanceRequestProps,
	CoinBalances,
	MessagesProps,
	Toaster,
	TokenSummaryInfoMap,
} from '../../../types';
import { getMultipleRequiredApprovals, getRequiredApprovals } from '../../../utils';
import {
	decimalsOf,
	getAddressForZeroExSymbol,
	getBalanceOfSymbol,
	getSetIssuance,
	getSetToken,
	getZeroExIssuanceContract,
	isNative,
	waitForBalancesAfterTrade,
} from '../../../utils/contracts';
import { multiplyBignumberByFloat, percentageDifference } from '../../../utils/numbers';
import { getSetAPI } from '../../../utils/sets';
import {
	showErrorToast,
	showToast,
	showTransactionApprovalToast,
	showTransactionSendingToast,
	showTransactionSentToast,
	showTransactionSettlingToast,
	showTransactionSuccessToast,
} from '../../../utils/toasts';

const { formatUnits, parseUnits } = ethers.utils;
const BIG_ZERO = BigNumber.from(0);

const ISSUE_APPROVAL_MESSAGES = {
	waiting:
		'Waiting for approval transaction to be confirmed on-chain before sending the trade to execution.',
	rejected:
		'We cannot execute the Issue request without this contract permission. Please re-submit for approval.',
	success:
		'Approval confirmed on-chain, now initiating the trade. Please confirm the transaction in your wallet.',
};

const REDEEM_APPROVAL_MESSAGES = {
	waiting:
		'Waiting for approval transaction to be confirmed on-chain before sending the trade to execution.',
	rejected: 'We cannot execute the Redemption request without this contract permission, sorry.',
	success:
		'Approval confirmed on-chain, now initiating the trade. Please confirm the transaction in your wallet.',
};

const getQuoteAddress = (symbol: string, tokens: TokenSummaryInfoMap) => {
	const quoteSymbol = isNative(symbol) ? `W${symbol}` : symbol;
	const address = tokens[quoteSymbol].address;
	return address;
};

export function allApproved(
	amount: string,
	contractAddresses: TokenSummaryInfoMap,
	approvals: Record<string, BigNumber>,
	positions: Record<string, BigNumber>,
): boolean {
	if (!positions || !approvals || Object.keys(approvals).length === 0) {
		return false;
	}
	const needed = getApprovalsNeeded(amount, contractAddresses, approvals, positions);
	return Object.keys(needed).length === 0;
}

export function checkApproval(symbol: string, amount: number, approvals: CoinBalances): boolean {
	if (isNative(symbol)) {
		return true;
	}
	if (!approvals[symbol]) {
		return false;
	}
	const approval = formatUnits(approvals[symbol], decimalsOf(symbol));
	const approvalAmount = parseFloat(approval);
	const approved = approvalAmount >= amount;
	/* 	if (approvalAmount > 0.0 && !approved) {
		console.log(`${symbol} not approved for enough. ${approval} < ${amount}`);
	}
 */
	return approved;
}

export function getApprovalsNeeded(
	amount: string,
	contractAddresses: TokenSummaryInfoMap,
	approvals: Record<string, BigNumber>,
	positions: Record<string, BigNumber>,
): Record<string, AllowanceRequestProps> {
	const approvalsNeeded: Record<string, AllowanceRequestProps> = {};
	const amountNum = parseFloat(amount);

	Object.keys(positions).forEach((symbol) => {
		const sellAddr = contractAddresses[symbol]?.address;
		if (!sellAddr) {
			console.warn(`No contract address for ${symbol}`);
		} else {
			const approval = approvals[symbol] || '0';
			const approvalNum = parseFloat(formatUnits(approval, decimalsOf(symbol)));
			const position = positions[symbol];
			const positionNum = parseFloat(formatUnits(position, decimalsOf(symbol)));
			if (approvalNum < positionNum * amountNum) {
				const needed = positionNum * amountNum - approvalNum;
				const decimals = decimalsOf(symbol);
				approvalsNeeded[symbol] = {
					sellAmount: needed,
					sellUnits: parseUnits(needed.toFixed(decimals), decimals),
					sellToken: symbol,
					sellAddr,
				};
			}
		}
	});
	return approvalsNeeded;
}

export async function getIssuanceModuleAddress(setToken: SetToken): Promise<string> {
	return setToken.getModules().then((modules) => modules[0]);
}

async function doIssuanceApproval(
	amount: string,
	issuanceModule: string,
	approvals: Record<string, BigNumber>,
	baseTokens: TokenSummaryInfoMap,
	componentTokens: TokenSummaryInfoMap,
	positionMap: Record<string, BigNumber>,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const tokenAddresses = {
		...baseTokens,
		...componentTokens,
	};
	const approvalsNeeded = getApprovalsNeeded(amount, tokenAddresses, approvals, positionMap);
	const needed = Object.keys(approvalsNeeded).length;
	if (needed === 0) {
		return true;
	}
	const { address, provider } = wallet;
	if (!provider || !address) {
		throw new Error('No provider or address');
	}
	showTransactionApprovalToast(needed, toast);
	const approved = await getMultipleRequiredApprovals(
		Object.values(approvalsNeeded),
		issuanceModule,
		wallet,
		toast,
		ISSUE_APPROVAL_MESSAGES,
	);
	return approved;
}

async function doIssuanceIssue(
	amount: string,
	symbol: string,
	issuanceModule: string,
	settokenContract: SetToken,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const { provider, address } = wallet;
	if (!provider || !address) {
		return false;
	}
	toast.closeAll();
	showTransactionSendingToast('issue-exact-tokens-sending', toast);
	const issuance = getSetIssuance(issuanceModule, provider);
	if (!issuance) {
		return false;
	}
	try {
		const signer = provider.getSigner(0);
		const amountInWei = parseUnits(amount, decimalsOf(symbol));
		const tx = await issuance.connect(signer).issue(settokenContract.address, amountInWei, address);
		showTransactionSentToast('issing-tokens-sent', tx.hash, wallet.chainId, toast);
		const receipt = await provider.waitForTransaction(tx.hash, 1);
		if (receipt.status === 1) {
			showTransactionSuccessToast(
				'issuing-tokens-success',
				receipt.confirmations,
				receipt.transactionHash,
				symbol,
				amountInWei,
				'using underlying tokens',
				BigNumber.from(0),
				wallet.chainId || DEFAULT_CHAIN_ID,
				toast,
				false,
			);
			return true;
		}
		console.warn('invalid issuance', receipt);
		toast.closeAll();
		showToast(
			'issuing-tokens-error',
			{ status: 'error', title: 'Error', description: 'Issuance failed' },
			toast,
		);
	} catch (e: any) {
		console.error('error issuing', e);
		showErrorToast('issuing-tokens-error', { status: 'error', title: 'Error Issuing' }, e, toast);
	}
	return false;
}

async function doIssueExactCall(
	amount: string,
	symbol: string,
	inputSymbol: string,
	inputAddress: string,
	inputAmount: number,
	quotes: string[],
	issuanceModule: string,
	settokenContract: SetToken,
	zeroExExchangeIssuance: Contract,
	tokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const { provider, address } = wallet;
	if (!provider || !address) {
		console.log('no provider or address');
		return false;
	}
	toast.closeAll();
	showTransactionSendingToast('issue-exact-tokens-sending', toast);
	let buyBalance = BIG_ZERO;
	let sellBalance = BIG_ZERO;
	try {
		buyBalance = await getBalanceOfSymbol(symbol, address, tokens, provider);
		sellBalance = await getBalanceOfSymbol(inputSymbol, address, tokens, provider);
	} catch (e) {
		console.error('error getting balance', e);
		showErrorToast('issuing-tokens-error', { status: 'error', title: 'Error Issuing' }, e, toast);
		return false;
	}
	try {
		const signer = provider.getSigner(0);
		const zeSigner = zeroExExchangeIssuance.connect(signer);
		const amountInWei = parseUnits(amount, decimalsOf(symbol));
		const inputAmountInWei = parseUnits(inputAmount.toString(), decimalsOf(inputSymbol));
		let tx: any;
		let gasLimit: BigNumber = BigNumber.from('500000');

		if (isNative(inputSymbol)) {
			/* console.log(`issuing native using ${inputAmount} ${inputSymbol}`);
			console.log(
				[
					`issuing ${symbol} with:`,
					`- setTokenAddress: ${settokenContract.address}`,
					`- amount: ${formatUnits(amountInWei, decimalsOf(inputSymbol))}	`,
					`- quotes: ${quotes.join(',\n')}`,
					`- issuance: ${issuanceModule}`,
				].join('\n'),
			); */
			gasLimit = await zeSigner.estimateGas.issueExactSetFromETH(
				settokenContract.address,
				amountInWei,
				quotes,
				issuanceModule,
				false,
				{ value: inputAmountInWei },
			);
			gasLimit = multiplyBignumberByFloat(gasLimit, 1.2);
			tx = await zeSigner.issueExactSetFromETH(
				settokenContract.address,
				amountInWei,
				quotes,
				issuanceModule,
				false,
				{
					gasLimit: gasLimit.toString(),
					value: inputAmountInWei,
				},
			);
		} else {
			// console.log('issuing erc20');
			gasLimit = await zeSigner.estimateGas.issueExactSetFromToken(
				settokenContract.address,
				inputAddress,
				amountInWei,
				inputAmountInWei,
				quotes,
				issuanceModule,
				false,
			);
			gasLimit = multiplyBignumberByFloat(gasLimit, 1.2);
			tx = await zeSigner.issueExactSetFromToken(
				settokenContract.address,
				inputAddress,
				amountInWei,
				inputAmountInWei,
				quotes,
				issuanceModule,
				false,
				{ gasLimit: gasLimit.toString() },
			);
		}
		showTransactionSentToast('issing-tokens-sent', tx.hash, wallet.chainId, toast);
		const receipt = await provider.waitForTransaction(tx.hash, 1);
		if (receipt.status === 1) {
			const [buyDelta, sellDelta] = await waitForBalancesAfterTrade(
				address,
				tokens,
				symbol,
				buyBalance,
				inputSymbol,
				sellBalance,
				receipt,
				provider,
			);
			showTransactionSuccessToast(
				'issuing-tokens-success',
				receipt.confirmations,
				receipt.transactionHash,
				symbol,
				buyDelta,
				inputSymbol,
				sellDelta,
				wallet.chainId || DEFAULT_CHAIN_ID,
				toast,
			);
			return true;
		}
		console.log('invalid issuance', receipt);
		showToast(
			'issuing-tokens-error',
			{ status: 'error', title: 'Error', description: 'Issuance failed', duration: 100000 },
			toast,
		);
	} catch (e: any) {
		console.error('error issuing', e);
		showErrorToast(
			'issuing-tokens-error',
			{ status: 'error', title: 'Error Issuing', duration: 10000 },
			e,
			toast,
		);
	}
	return false;
}

/* function logSwapQuote(quote: any) {
	console.log(`SwapQuote:
	From: ${quote.from}
	From Address: ${quote.fromTokenAddress}
	Sell Amount: ${formatUnits(quote.fromTokenAmount, 18)}
	To address: ${quote.toTokenAddress}
	Buy Amount: ${formatUnits(quote.toTokenAmount, 18)}
	Gas: ${quote.gas}
	Gas Price: ${quote.gasPrice}`);
} */

async function getIssuanceQuotes(
	address: string,
	setToken: SetToken,
	inputTokenAddress: string,
	setAmount: number,
	slippagePercents = 1.0,
	firmQuote: boolean,
	provider: Provider,
	chainId: string,
): Promise<[string[], BigNumber]> {
	const positions = await setToken.getPositions();
	const positionQuotes: string[] = [];
	let inputTokenAmount = BigNumber.from(0);
	// 0xAPI expects percentage as value between 0-1 e.g. 5% -> 0.05
	// const slippagePercentage = slippagePercents / 100;

	const sellToken = inputTokenAddress;

	const setApi = getSetAPI(provider, chainId);
	const gasPrice = await setApi.utils.fetchGasPriceAsync();

	for (const position of positions) {
		const buyAmount = multiplyBignumberByFloat(position.unit, setAmount);
		const buyToken = position.component;
		if (getAddressForZeroExSymbol(buyToken) === getAddressForZeroExSymbol(sellToken)) {
			// console.log('Not calling 0x for input token');
			positionQuotes.push(ethers.utils.formatBytes32String('FOOBAR'));
			inputTokenAmount = inputTokenAmount.add(buyAmount);
		} else {
			// const buyString = formatUnits(buyAmount, decimalsOf(buyToken));
			// console.log(`Calling 0x for ${buyToken} to buy ${buyString} with ${sellToken}`);
			const quote = await setApi.utils.fetchSwapQuoteAsync(
				sellToken,
				buyToken,
				buyAmount.toString(),
				true,
				setToken.address,
				setApi.setToken,
				gasPrice,
				slippagePercents,
				firmQuote,
				0,
				'',
			);
			// console.log('set quote', quote);
			// logSwapQuote(quote);
			positionQuotes.push(quote.calldata);
			inputTokenAmount = inputTokenAmount.add(BigNumber.from(quote.fromTokenAmount));
		}
	}
	inputTokenAmount = inputTokenAmount.mul(100).div(100 - slippagePercents);
	return [positionQuotes, inputTokenAmount];
}

export async function getIssuanceQuotesForSet(
	address: string,
	setSymbol: string,
	inputSymbol: string,
	amount: number,
	tokens: TokenSummaryInfoMap,
	provider: Provider,
	chainId: string,
	toast: Toaster,
): Promise<[string[], BigNumber]> {
	const setToken = getSetToken(tokens[setSymbol].address, provider);
	if (!setToken) {
		showErrorToast(
			'get-issuance-quote-error',
			{ status: 'error', title: 'Error' },
			'No set token',
			toast,
		);
		return [[], BigNumber.from(0)];
	}
	const inputAddress = getQuoteAddress(inputSymbol, tokens);
	return getIssuanceQuotes(address, setToken, inputAddress, amount, 1.0, false, provider, chainId);
}

async function getRedemptionQuotes(
	setToken: SetToken,
	outputTokenAddress: string,
	setAmount: number,
	slippagePercents: number,
	firmQuote: boolean,
	provider: Provider,
	chainId: string,
): Promise<[string[], BigNumber]> {
	const positions = await setToken.getPositions();
	const positionQuotes: string[] = [];
	let outputTokenAmount = BigNumber.from(0);
	const setApi = getSetAPI(provider, chainId);
	const gasPrice = await setApi.utils.fetchGasPriceAsync();

	for (const position of positions) {
		const sellAmount = multiplyBignumberByFloat(position.unit, setAmount);
		const sellToken = position.component;
		const buyToken = outputTokenAddress;
		if (getAddressForZeroExSymbol(buyToken) === getAddressForZeroExSymbol(sellToken)) {
			console.log('Not calling 0x for output token');
			positionQuotes.push(ethers.utils.formatBytes32String('FOOBAR'));
			outputTokenAmount = outputTokenAmount.add(sellAmount);
		} else {
			const quote = await setApi.utils.fetchSwapQuoteAsync(
				sellToken,
				buyToken,
				sellAmount.toString(),
				false,
				setToken.address,
				setApi.setToken,
				gasPrice,
				slippagePercents,
				firmQuote,
				0,
				'',
			);
			// logSwapQuote(quote);
			positionQuotes.push(quote.calldata);
			outputTokenAmount = outputTokenAmount.add(BigNumber.from(quote.toTokenAmount));
		}
	}
	outputTokenAmount = outputTokenAmount.div(100).mul(100 - slippagePercents);

	return [positionQuotes, outputTokenAmount];
}

export async function getRedemptionQuotesForSet(
	setSymbol: string,
	outputSymbol: string,
	amount: number,
	tokens: TokenSummaryInfoMap,
	provider: Provider,
	chainId: string,
	toast: Toaster,
): Promise<[string[], BigNumber]> {
	const setToken = getSetToken(tokens[setSymbol].address, provider);
	if (!setToken) {
		showErrorToast(
			'get-output-quote-error',
			{ status: 'error', title: 'Error' },
			'No set token',
			toast,
		);
		return [[], BigNumber.from(0)];
	}
	const outputAddress = getQuoteAddress(outputSymbol, tokens);
	return getRedemptionQuotes(setToken, outputAddress, amount, 1.0, false, provider, chainId);
}

export async function doIssuance(
	amount: string,
	symbol: string,
	issuanceModule: string,
	settokenContract: SetToken,
	approvals: Record<string, BigNumber>,
	baseTokens: TokenSummaryInfoMap,
	componentTokens: TokenSummaryInfoMap,
	positionMap: Record<string, BigNumber>,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const approved = await doIssuanceApproval(
		amount,
		issuanceModule,
		approvals,
		baseTokens,
		componentTokens,
		positionMap,
		wallet,
		toast,
	);

	if (!approved) {
		return false;
	}
	return doIssuanceIssue(amount, symbol, issuanceModule, settokenContract, wallet, toast);
}

async function doGetApprovals(
	amount: number,
	symbol: string,
	allowanceTarget: string,
	approvals: Record<string, BigNumber>,
	tokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	approvalMessages: MessagesProps,
	toast: Toaster,
) {
	if (isNative(symbol)) {
		return true;
	}
	const approval = approvals[symbol] || '0';
	const approvalNum = parseFloat(formatUnits(approval, decimalsOf(symbol)));
	if (approvalNum >= amount) {
		return true;
	}
	const { address, provider } = wallet;
	if (!provider || !address) {
		throw new Error('No provider or address');
	}
	showTransactionApprovalToast(1, toast);
	const allowance: AllowanceRequestProps = {
		sellAddr: tokens[symbol].address,
		sellToken: symbol,
		sellAmount: amount,
		sellUnits: parseUnits(amount.toString(), decimalsOf(symbol)),
	};
	const approved = await getRequiredApprovals(
		allowance,
		allowanceTarget,
		wallet,
		toast,
		approvalMessages,
	);
	// console.log('approved', approved);
	return approved;
}

export async function doIssueExact(
	amount: string,
	symbol: string,
	inputSymbol: string,
	inputAmount: number,
	issuanceModule: string,
	settokenContract: SetToken,
	approvals: Record<string, BigNumber>,
	tokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	chainId: string,
	toast: Toaster,
): Promise<boolean> {
	const { address, provider } = wallet;
	if (!provider || !address) {
		return false;
	}
	const zeroExContract = await getZeroExIssuanceContract(chainId, provider);

	if (!zeroExContract) {
		toast.closeAll();
		showErrorToast(
			'get-issuance-quote-error',
			{ status: 'error', title: 'Error' },
			'No zeroEx contract',
			toast,
		);
		return false;
	}

	const approved = await doGetApprovals(
		inputAmount,
		inputSymbol,
		zeroExContract.address,
		approvals,
		tokens,
		wallet,
		ISSUE_APPROVAL_MESSAGES,
		toast,
	);

	if (!approved || !wallet.address) {
		return false;
	}
	const inputAddress = getQuoteAddress(inputSymbol, tokens);
	const [componentQuotes, freshAmount] = await getIssuanceQuotes(
		wallet.address,
		settokenContract,
		inputAddress,
		parseFloat(amount),
		1.0,
		true,
		provider,
		chainId,
	);
	const freshMaxVal = parseFloat(formatUnits(freshAmount, decimalsOf(inputSymbol)));
	if (percentageDifference(freshMaxVal, inputAmount) > 1) {
		toast.closeAll();
		showToast(
			'issue-exact-change',
			{
				title: 'Price has changed',
				description: `Prices have changed since we last checked. Please review before restarting.`,
				status: 'warning',
			},
			toast,
		);
		return false;
	}

	// console.log('about to issue');
	return doIssueExactCall(
		amount,
		symbol,
		inputSymbol,
		inputAddress,
		freshMaxVal,
		componentQuotes,
		issuanceModule,
		settokenContract,
		zeroExContract,
		tokens,
		wallet,
		toast,
	);
}

async function doRedemptionApproval(
	amount: string,
	symbol: string,
	issuanceModule: string,
	settokenContract: SetToken,
	approvals: Record<string, BigNumber>,
	componentTokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const approval = approvals[symbol] || '0';
	const approvalNum = parseFloat(formatUnits(approval, decimalsOf(symbol)));
	const amountNum = parseFloat(amount);
	if (approvalNum >= amountNum) {
		return true;
	}
	const { address, provider } = wallet;
	if (!provider || !address) {
		throw new Error('No provider or address');
	}
	showTransactionApprovalToast(1, toast);
	const allowance: AllowanceRequestProps = {
		sellAddr: settokenContract.address,
		sellToken: symbol,
		sellAmount: amountNum,
		sellUnits: parseUnits(amount, decimalsOf(symbol)),
	};
	const approved = await getRequiredApprovals(
		allowance,
		issuanceModule,
		wallet,
		toast,
		REDEEM_APPROVAL_MESSAGES,
	);
	// console.log('approved', approved);
	return approved;
}

async function doRedemptionRedeem(
	amount: string,
	symbol: string,
	issuanceModule: string,
	settokenContract: SetToken,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const { provider, address } = wallet;
	if (!provider || !address) {
		return false;
	}
	const issuance = getSetIssuance(issuanceModule, provider);
	if (!issuance) {
		return false;
	}
	// console.log(`About to Redeem ${amount} ${symbol}`);
	toast.closeAll();
	showTransactionSendingToast('redeem-tokens-sending', toast);
	const amountInWei = parseUnits(amount, decimalsOf(symbol));
	const signer = provider.getSigner(0);
	const tx = await issuance.connect(signer).redeem(settokenContract.address, amountInWei, address);
	showTransactionSentToast('redeem-tokens-sent', tx.hash, wallet.chainId, toast);
	const receipt = await provider.waitForTransaction(tx.hash, 1);
	if (receipt.status === 1) {
		showTransactionSuccessToast(
			'redeem-tokens-success',
			receipt.confirmations,
			receipt.transactionHash,
			symbol,
			amountInWei,
			'to its underlying tokens',
			BigNumber.from(0),
			wallet.chainId || DEFAULT_CHAIN_ID,
			toast,
			false,
		);
		return true;
	}
	console.log('invalid redemption', receipt);
	showToast(
		'redeeming-tokens-error',
		{ status: 'error', title: 'Error', description: 'Redemption failed' },
		toast,
	);
	return false;
}

export async function doRedemption(
	amount: string,
	symbol: string,
	issuanceModule: string,
	settokenContract: SetToken,
	approvals: Record<string, BigNumber>,
	componentTokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const approved = await doRedemptionApproval(
		amount,
		symbol,
		issuanceModule,
		settokenContract,
		approvals,
		componentTokens,
		wallet,
		toast,
	);
	if (!approved) {
		return false;
	}
	return doRedemptionRedeem(amount, symbol, issuanceModule, settokenContract, wallet, toast);
}

async function doRedeemExactCall(
	amount: string,
	symbol: string,
	outputSymbol: string,
	outputAddress: string,
	outputAmount: number,
	quotes: string[],
	issuanceModule: string,
	settokenContract: SetToken,
	zeroExExchangeIssuance: Contract,
	tokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	toast: Toaster,
): Promise<boolean> {
	const { provider, address } = wallet;
	if (!provider || !address) {
		console.log('no provider or address');
		return false;
	}
	showTransactionSendingToast('redeem-exact-tokens-sending', toast);
	let buyBalance = BIG_ZERO;
	let sellBalance = BIG_ZERO;
	try {
		buyBalance = await getBalanceOfSymbol(outputSymbol, address, tokens, provider);
		sellBalance = await getBalanceOfSymbol(symbol, address, tokens, provider);
	} catch (e) {
		console.error('error getting balance', e);
		showErrorToast('issuing-tokens-error', { status: 'error', title: 'Error Issuing' }, e, toast);
		return false;
	}
	try {
		const signer = provider.getSigner(0);
		const zeSigner = zeroExExchangeIssuance.connect(signer);
		const amountInWei = parseUnits(amount, decimalsOf(symbol));
		const outputAmountInWei = parseUnits(outputAmount.toString(), decimalsOf(outputSymbol));
		let tx: any;
		let gasLimit: BigNumber = BigNumber.from('500000');
		/* console.log('issuing exact', amount, outputSymbol, outputAddress);
		console.log(
			[
				`redeeming ${symbol} with:`,
				`- setTokenAddress: ${settokenContract.address}`,
				`- amount: ${formatUnits(amountInWei, decimalsOf(outputSymbol))}	`,
				`- quotes: ${quotes.join(',\n')}`,
				`- issuance: ${issuanceModule}`,
			].join('\n'),
		); */

		if (isNative(outputSymbol)) {
			// console.log(`redeeming native ${outputAmount} ${outputSymbol}`);
			gasLimit = await zeSigner.estimateGas.redeemExactSetForETH(
				settokenContract.address,
				amountInWei,
				outputAmountInWei,
				quotes,
				issuanceModule,
				false,
			);
			gasLimit = multiplyBignumberByFloat(gasLimit, 1.2);
			tx = await zeSigner.redeemExactSetForETH(
				settokenContract.address,
				amountInWei,
				outputAmountInWei,
				quotes,
				issuanceModule,
				false,
				{ gasLimit: gasLimit.toString() },
			);
		} else {
			// console.log(`redeeming erc20 ${outputAmount} ${outputSymbol}`);
			gasLimit = await zeSigner.estimateGas.redeemExactSetForToken(
				settokenContract.address,
				outputAddress,
				amountInWei,
				outputAmountInWei,
				quotes,
				issuanceModule,
				false,
			);
			gasLimit = multiplyBignumberByFloat(gasLimit, 1.2);
			tx = await zeSigner.redeemExactSetForToken(
				settokenContract.address,
				outputAddress,
				amountInWei,
				outputAmountInWei,
				quotes,
				issuanceModule,
				false,
				{ gasLimit: gasLimit.toString() },
			);
		}
		showTransactionSentToast('redeem-tokens-sent', tx.hash, wallet.chainId, toast);
		const receipt = await provider.waitForTransaction(tx.hash, 1);
		// console.log('receipt', receipt);
		if (receipt.status === 1) {
			showTransactionSettlingToast(
				'redeeming-tokens-settling',
				receipt.transactionHash,
				wallet.chainId || DEFAULT_CHAIN_ID,
				toast,
			);
			const [buyDelta, sellDelta] = await waitForBalancesAfterTrade(
				address,
				tokens,
				outputSymbol,
				buyBalance,
				symbol,
				sellBalance,
				receipt,
				provider,
			);
			showTransactionSuccessToast(
				'redeem-tokens-success',
				receipt.confirmations,
				receipt.transactionHash,
				symbol,
				sellDelta,
				outputSymbol,
				buyDelta,
				wallet.chainId || DEFAULT_CHAIN_ID,
				toast,
			);
			console.log('success redeeming');
			return true;
		}
		console.warn('invalid redemption', receipt);
		showToast(
			'redeem-tokens-error',
			{ status: 'error', title: 'Error', description: 'Issuance failed', duration: 100000 },
			toast,
		);
	} catch (e: any) {
		console.error('error redeeming', e);
		showErrorToast(
			'redeem-tokens-error',
			{ status: 'error', title: 'Error Redeeming', duration: 10000 },
			e,
			toast,
		);
	}
	return false;
}

export async function doRedeemExact(
	amount: string,
	symbol: string,
	outputSymbol: string,
	outputAmount: number,
	issuanceModule: string,
	settokenContract: SetToken,
	approvals: Record<string, BigNumber>,
	tokens: TokenSummaryInfoMap,
	wallet: WalletContextType,
	chainId: string,
	toast: Toaster,
): Promise<boolean> {
	const { address, provider } = wallet;
	if (!provider || !address) {
		return false;
	}
	const zeroExContract = await getZeroExIssuanceContract(chainId, provider);

	if (!zeroExContract) {
		showErrorToast(
			'get-redemption-quote-error',
			{ status: 'error', title: 'Error' },
			'No zeroEx contract',
			toast,
		);
		return false;
	}

	const amountNum = parseFloat(amount);
	const approved = await doGetApprovals(
		amountNum,
		symbol,
		zeroExContract.address,
		approvals,
		tokens,
		wallet,
		REDEEM_APPROVAL_MESSAGES,
		toast,
	);

	if (!approved) {
		return false;
	}
	const outputAddress = getQuoteAddress(outputSymbol, tokens);
	const [componentQuotes, freshAmount] = await getRedemptionQuotes(
		settokenContract,
		outputAddress,
		amountNum,
		1.0,
		true,
		provider,
		chainId,
	);
	const freshMaxVal = parseFloat(formatUnits(freshAmount, decimalsOf(outputSymbol)));
	if (percentageDifference(freshMaxVal, outputAmount) > 1) {
		showToast(
			'redeem-exact-change',
			{
				title: 'Price has changed',
				description: `Prices have changed since we last checked. Please review before restarting.`,
				status: 'warning',
			},
			toast,
		);
		return false;
	}

	console.log('about to redeem');
	return doRedeemExactCall(
		amount,
		symbol,
		outputSymbol,
		outputAddress,
		freshMaxVal,
		componentQuotes,
		issuanceModule,
		settokenContract,
		zeroExContract,
		tokens,
		wallet,
		toast,
	);
}
