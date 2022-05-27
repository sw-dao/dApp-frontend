import { ExtendedTokenDetails, TokenDetails } from '../../../../types';

export type TokenDetailPane = {
	width: string;
	margin: string;
	symbol: string;
	data: TokenDetails | null | undefined;
	details: ExtendedTokenDetails | null | undefined;
};
