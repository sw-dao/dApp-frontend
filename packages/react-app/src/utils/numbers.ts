import { BigNumber } from 'ethers';

export function getPrecision(x: number): number {
	const parts = x.toString().split('.');
	if (parts.length === 1) {
		return 0;
	}
	return parts[1].length;
}

export function toPrecision(x: string, precision: number): string {
	const parts = x.split('.');
	if (parts.length === 1) {
		return parts[0];
	}
	return parts[0] + '.' + parts[1].substring(0, precision);
}

export function multiplyBignumberByFloat(x: BigNumber, y: number): BigNumber {
	const precision = getPrecision(y);
	if (precision === 0) {
		try {
			return x.mul(y);
		} catch (e: any) {
			if (e?.message.includes('underflow')) {
				console.warn('cannot multiply bignumber by float - underflow');
				return BigNumber.from(0);
			}
		}
	}
	const multiplier = Math.pow(10, precision);
	const yFixed = y * multiplier;
	return x.mul(yFixed).div(multiplier);
}

export const percentageDifference = (x: number, y: number): number =>
	100 * Math.abs((x - y) / ((x + y) / 2));
