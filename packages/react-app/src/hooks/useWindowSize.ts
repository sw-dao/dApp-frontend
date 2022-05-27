import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { UI_BREAKPOINTS } from '../config';

interface WindowSize {
	width: number;
	height: number;
}

export function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: -1,
		height: -1,
	});
	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		// Add event listener
		window.addEventListener('resize', handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize();
		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
}

const SIZES: string[] = ['sm', 'md', 'lg', 'xl'];

export function useSiteBreakpoint(): string {
	const { width } = useWindowSize();
	const [siteWidth] = useDebounce(width, 100);
	const [breakpoint, setBreakpoint] = useState<string>('xl');
	const [busy, setBusy] = useState<boolean>(false);

	useEffect(() => {
		if (siteWidth > -1 && !busy) {
			setBusy(true);
			let siteBp = 'xl';
			for (let i = 0; i < SIZES.length; i++) {
				const size = SIZES[i];
				if (siteWidth < UI_BREAKPOINTS[size]) {
					siteBp = size;
					break;
				}
			}

			if (siteBp !== breakpoint) {
				console.log(`Site breakpoint changed @ ${siteWidth}px ${breakpoint} -> ${siteBp}`);
				setBreakpoint(siteBp);
			}
			setBusy(false);
		}
	}, [breakpoint, busy, siteWidth]);

	return breakpoint;
}
