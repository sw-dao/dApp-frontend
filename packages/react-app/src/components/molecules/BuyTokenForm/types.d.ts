import { BigNumber } from 'ethers';
import { CoinBalances } from '../../../types';

export type BuyTokenProps = {
	symbol: string;
	allowedTokens: TokenSummaryInfoMap;
	marginTop: string;
	breakpoint: string;
	width: number | string;
	id?: string;
};

export type FormProps = {
	amounts: [string, string];
	allowedTokens: TokenSummaryInfoMap;
	approved: boolean;
	balances: CoinBalances;
	breakpoint: string;
	buttonEnabled: boolean;
	buttonLabel: string;
	buySymbol: string;
	disabled?: boolean;
	disabledLabel?: string;
	isBusy?: boolean;
	loaded: boolean;
	loading: boolean;
	sellSymbol: string;
	onSubmit: () => void;
	onBuyAmountChange: (amount: string) => void;
	onSellAmountChange: (amount: string) => void;
	onSymbolChange: (symbol: string) => void;
};
