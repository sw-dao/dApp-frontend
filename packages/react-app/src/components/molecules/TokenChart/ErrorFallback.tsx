import React from 'react';

import { getErrorMessage } from '../../../Errors';

export function ErrorFallback(params: any): JSX.Element {
	const message = getErrorMessage(params.error);
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre style={{ color: 'red' }}>{message}</pre>
		</div>
	);
}
