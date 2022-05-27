import { ExtendedTokenDetails, TokenDetails } from '../../../types';

export interface TokenDescriptionProps {
	data: TokenDetails | null | undefined;
	details: ExtendedTokenDetails | null | undefined;
	description?: JSX.Element;
}

export interface AboutTokenSetProps {
	symbol: string;
	tokenData: TokenDetails | null | undefined;
	tokenDetails: ExtendedTokenDetails | null | undefined;
	width?: string;
	align?: string;
	textAlign?: string;
	mt?: string;
}
