import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { SWD_DISTRIBUTION } from '../../config';

const data = SWD_DISTRIBUTION.map(([title, value]) => ({ title, value }));
const COLORS = ['highlight', '#3861f7', '#43a7fd', '#00b22d', '#e2ac2f', '#857afd'];

const RADIAN = Math.PI / 180;

interface CustomLabelRenderProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
}

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: CustomLabelRenderProps): JSX.Element => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	let x = cx + radius * Math.cos(-midAngle * RADIAN);
	// correct for character width
	const nudge = (Math.ceil(percent / 10) + 0.5) * 5;
	if (x > cx) {
		x -= nudge;
	} else {
		x += nudge;
	}

	const y = cy + radius * Math.sin(-midAngle * RADIAN) * 0.95;

	return (
		<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

export function SWDDistributionChart(): JSX.Element {
	return (
		<Box textAlign="left" w="100%">
			<Heading fontSize="1.6rem">SWD Distribution</Heading>
			<Center>
				<Box
					backgroundImage="url(/images/token-swd-lg.png)"
					backgroundRepeat="no-repeat"
					backgroundSize="160px 160px"
					backgroundPosition="125px 120px"
					height="425px"
					width="500px"
				>
					<PieChart width={400} height={400}>
						<Pie
							data={data}
							cx={200}
							cy={200}
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={180}
							innerRadius={120}
							fill="#8884d8"
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					</PieChart>
				</Box>
			</Center>
			<Center>
				<Flex spacing="2.5rem" mt="1rem">
					{SWD_DISTRIBUTION.map(([title], index) => {
						const color = COLORS[index];
						return (
							<Box key={title} lineHeight="1rem" mr="2.5rem" position="relative">
								<Box
									h="1rem"
									w="1rem"
									bgColor={color}
									position="absolute"
									top={0}
									left={0}
									mr="1rem"
								>
									&nbsp;
								</Box>
								<Text d="inline-block" color="white" fontSize="sm" ml="2rem" whiteSpace="nowrap">
									{title}
								</Text>
							</Box>
						);
					})}
				</Flex>
			</Center>
		</Box>
	);
}
