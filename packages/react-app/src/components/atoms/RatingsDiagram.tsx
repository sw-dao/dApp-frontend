import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import imgdye from 'imgdye';
import React from 'react';
import useDrawingCanvas from 'react-hooks-use-drawing-canvas';

interface RatingsDiagramProps {
	buy: number;
	hold: number;
	sell: number;
	count: number;
	width: number;
	height: number;
}

const renderRatingsDiamond =
	(buy: number, hold: number, sell: number, count: number, width: number, height: number) =>
	(ctx: CanvasRenderingContext2D) => {
		const diamond = new Image();
		diamond.src = '/images/ratings-diamond-300.png';
		diamond.onload = () => {
			const wScale = width / diamond.width;
			const hScale = height / diamond.height;
			const scale = Math.min(wScale, hScale);
			const w = Math.floor(diamond.width * scale);
			const h = Math.floor(diamond.height * scale);
			const buyH = Math.floor((h * buy) / 100.0);
			const holdH = Math.floor((h * hold) / 100.0);
			const holdY = buyH + 1; // +1 for white line
			const sellH = Math.floor((h * sell) / 100.0);
			const sellY = buyH + holdH + 2; // +1 for white line = +2 total
			const buyDiamond = imgdye(diamond, '#0088fc', 0.5);
			const holdDiamond = imgdye(diamond, '#f703fd', 0.5);
			const sellDiamond = imgdye(diamond, '#1c1526', 0.5);
			const whiteDiamond = imgdye(diamond, '#fff', 0.8);
			// background for white lines
			ctx.drawImage(whiteDiamond, 0, 0, w, h);
			// draw slices
			ctx.drawImage(buyDiamond, 0, 0, w / scale, buyH / scale, 0, 0, w, buyH);
			ctx.drawImage(holdDiamond, 0, holdY / scale, w / scale, holdH / scale, 0, holdY, w, holdH);
			ctx.drawImage(sellDiamond, 0, sellY / scale, w / scale, sellH / scale, 0, sellY, w, sellH);
			ctx.font = 'bold 48pt jost';
			ctx.strokeStyle = '#fff';
			ctx.fillStyle = '#fff';
			let labelW = ctx.measureText(count + '');
			let middleX = (width - labelW.width) / 2;
			ctx.fillText(count + '', middleX, 130);
			ctx.font = 'normal 24pt jost';
			labelW = ctx.measureText('ratings');
			middleX = (width - labelW.width) / 2;
			ctx.fillText('ratings', middleX, 180);
		};
	};

interface RatingsDiagramProps {
	buy: number;
	hold: number;
	sell: number;
	count: number;
	width: number;
	height: number;
}

export function RatingsDiagram(props: RatingsDiagramProps): JSX.Element {
	const { buy, hold, sell, count, width, height } = props;

	const canvasRef = useDrawingCanvas(renderRatingsDiamond(buy, hold, sell, count, width, height));
	return (
		<HStack className="ratings" width="800px">
			<Box color="#fff" position="relative" height={`${height}px`} width={`${width}px`}>
				<canvas ref={canvasRef} height={height} width={width} />
			</Box>
			<VStack>
				<Box color="#72f5fc">
					<Text fontSize="2rem">{buy && buy.toFixed(1)}%</Text>
					<Text fontSize="1.2rem">Buy</Text>
				</Box>
				<Box color="#f703fd">
					<Text fontSize="2rem">{hold && hold.toFixed(1)}%</Text>
					<Text fontSize="1.2rem">Hold</Text>
				</Box>
				<Box color="#8772c7">
					<Text fontSize="2rem">{sell && sell.toFixed(1)}%</Text>
					<Text fontSize="1.2rem">Sell</Text>
				</Box>
			</VStack>
		</HStack>
	);
}
