import React from 'react';

interface LimitedTextProps {
	maxLength: number;
	text: string;
	fromEnd?: number;
}

export const LimitedText = (props: LimitedTextProps): JSX.Element => {
	const { maxLength, text, fromEnd = 0 } = props;
	if (text && text.length > maxLength) {
		if (fromEnd > 0) {
			return (
				<span>
					{text.slice(0, maxLength - fromEnd)}&hellip;
					{text.slice(text.length - fromEnd)}
				</span>
			);
		}
		return <span>{text.slice(0, maxLength)}&hellip;</span>;
	}
	return <span>{text}</span>;
};
