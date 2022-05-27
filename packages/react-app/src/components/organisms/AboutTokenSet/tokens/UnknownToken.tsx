import React from 'react';

import FeeBox from './FeeBox';
import { TokenDetailPane } from './types';

export default function UnknownToken({
	symbol,
	width,
	margin,
	data,
	details,
}: TokenDetailPane): JSX.Element {
	return <FeeBox width={width} margin={margin} symbol={symbol} data={data} details={details} />;
}
