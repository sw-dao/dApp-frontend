import { Box, Flex } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { browserName } from 'react-device-detect';
import { useRecoilValue } from 'recoil';
import useMobileDetect from 'use-mobile-detect-hook';
import vhCheck from 'vh-check';

import { breakpointState } from '../../state';
import { Footer } from '../organisms/Footer';
import { Header } from '../organisms/Header';

vhCheck();

const heights =
	browserName === 'Safari'
		? {
				100: 'calc(100vh - var(--vh-offset, 0px))',
				10: 'calc(10vh - var(--vh-offset, 0px))',
				90: 'calc(90vh - var(--vh-offset, 0px))',
		  }
		: {
				100: '100vh',
				10: '10vh',
				90: '90vh',
		  };

interface FullHeightPageProps {
	outerClass?: string;
	innerClass?: string;
	children: React.ReactNode;
	pageKey?: string;
	className?: string;
	bgColor?: string;
	withSignup?: boolean;
}

export const FullHeightPage = (props: FullHeightPageProps): JSX.Element => {
	const {
		outerClass = 'contentwrapper',
		innerClass = 'content',
		pageKey = 'standard',
		className = 'fullheight',
		withSignup = false,
		children,
		...rest
	} = props;

	const breakpoint = useRecoilValue(breakpointState);
	const detectMobile = useMobileDetect();
	const [mobile, pageClasses] = useMemo(() => {
		const classes = [className];
		const mobile = detectMobile.isMobile();
		classes.push(mobile ? 'mobile' : 'desktop');
		return [mobile, classes.join(' ')];
	}, [className, detectMobile]);

	return (
		<Flex id={pageKey} minH={heights['100']} direction="column" className={pageClasses} {...rest}>
			<Box id="fullwrap" className={breakpoint}>
				<Box id="fullcontent" className={outerClass} flex={1} minH={heights['90']}>
					<Box className={innerClass}>
						<Header breakpoint={breakpoint} mobile={mobile} />
						<Box className="pagecontent">{children}</Box>
					</Box>
				</Box>
			</Box>
			<Footer minH={heights['10']} breakpoint={breakpoint} withSignup={withSignup} />
		</Flex>
	);
};
