import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { breakpointState } from '../../state';
import { StyledSection } from '../molecules/StyledSection';
import { FullHeightPage } from '../templates/FullHeightPage';

const STYLES: Record<string, Record<string, string>> = {
	sm: {
		width: '20rem',
		paddingTop: '10rem',
	},
	md: {
		width: '20rem',
		paddingTop: '10rem',
	},
	lg: {
		width: '40rem',
		paddingTop: '20rem',
	},
	xl: {
		width: '40rem',
		paddingTop: '20rem',
	},
};

export function NotFoundPage(): JSX.Element {
	const breakpoint = useRecoilValue(breakpointState);

	const style = useMemo(() => STYLES[breakpoint], [breakpoint]);

	return (
		<FullHeightPage pageKey="notfound" bgColor="black" withSignup={true}>
			<Center width="100%">
				<VStack spacing="1rem" mb="-155px" w="100%" bgColor="#061308">
					<StyledSection id="notfoundmain" section="clear">
						<Box className="bodycontent">
							<Box margin="0 0 2rem" color="#00ff59">
								<Heading
									color="#00ff59"
									backgroundImage="url(/images/swd-notfound.png)"
									backgroundPosition="top left"
									backgroundSize="contain"
									backgroundRepeat="no-repeat"
									margin="0 auto 2rem"
									{...style}
								>
									We couldn't find the page you were looking for.
								</Heading>
								<Text width={style.width} margin="0 auto">
									There is an error in the URL entered into your web browser. Please check the URL
									and try again. The page you are looking for has been moved or deleted.
								</Text>
								<Heading color="white" pt="4rem" fontSize="1.8rem">
									What about this?
								</Heading>
							</Box>
						</Box>
					</StyledSection>
				</VStack>
			</Center>
		</FullHeightPage>
	);
}
