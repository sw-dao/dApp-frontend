import React, { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import { TIME_PERIODS } from '../../config';
import { ChartData } from '../../types';

function BlankLine({ height, width }: { height: number; width: number | string }): JSX.Element {
	return (
		<svg width={width} height={height}>
			<line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#1f8cfd" strokeWidth={2} />
		</svg>
	);
}

interface TokenSparklineProps {
	prices: ChartData;
	symbol: string;
	period: string;
	width?: number | string;
	height?: number;
}

export function TokenSparkline(props: TokenSparklineProps): JSX.Element {
	const { prices, symbol, period, width = '100%', height = 50 } = props;
	const trimmedWidth = useMemo(() => {
		const key = `${width}`;
		if (key.endsWith('%') || key.endsWith('px')) {
			return width;
		}
		return parseInt(key, 10);
	}, [width]);

	const key = `grad${symbol}`;

	if (!prices || !prices.length) {
		return <BlankLine height={height} width={trimmedWidth} />;
	}

	let minData = 0;
	let maxData = 0;
	const cleanedPrices: Array<[number, number]> = [];
	if (prices.length > 0) {
		minData = parseFloat(prices[0][1]);
		maxData = parseFloat(prices[0][1]);
	}
	if (prices.length > 0) {
		const endTs = new Date().getTime() / 1000;
		const startTs = endTs - TIME_PERIODS[period].seconds;
		// build initial set of merged prices
		prices
			.filter((p) => p && p[1] !== null)
			.filter((p) => {
				const ts = p[0];
				return ts > startTs && ts < endTs;
			})
			.forEach((p) => {
				const val = parseFloat(p[1]);
				if (val < minData) minData = val;
				if (val > maxData) maxData = val;
				cleanedPrices.push([p[0], val]);
			});

		if (minData === maxData) return <BlankLine height={height} width={width} />;
	}
	return (
		<ResponsiveContainer width="99%" height={height}>
			<LineChart data={cleanedPrices} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
				<YAxis
					domain={[minData, maxData]}
					type="number"
					scale="auto"
					axisLine={false}
					tick={false}
					tickLine={false}
					hide={true}
				/>
				<defs>
					<linearGradient id={key} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#1f8cfd" stopOpacity={1} />
						<stop offset="95%" stopColor="#7200e6" stopOpacity={1} />
					</linearGradient>
				</defs>
				<Line type="monotone" dataKey="1" strokeWidth={2} stroke={`url(#${key})`} dot={false} />
			</LineChart>
		</ResponsiveContainer>
	);
}
