import { Box, Center, Flex, HStack, Image, Link, VStack } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { EmailListForm } from '../molecules/EmailListForm';
import { StyledSection } from '../molecules/StyledSection';

const backgroundSize: Record<string, string> = {
	sm: 'contain',
	md: 'cover',
	lg: 'cover',
	xl: 'cover',
};

const backgroundPosition: Record<string, string> = {
	sm: 'center 1rem',
	md: 'center 1rem',
	lg: 'center -1rem',
	xl: 'center -2rem',
};

const WIDTHS: Record<string, string> = {
	sm: '90%',
	md: '80%',
	lg: '70%',
	xl: '70%',
};

export function Footer({
	minH,
	breakpoint,
	withSignup,
}: {
	minH: string;
	breakpoint: string;
	withSignup?: boolean;
}): JSX.Element {
	const iconSize = useMemo(
		() => (['sm', 'md'].includes(breakpoint) ? '1.4rem' : '2rem'),
		[breakpoint],
	);
	const margin = useMemo(() => (withSignup ? '-12rem auto 0 auto' : '0 auto'), [withSignup]);

	const mainFooter = useMemo(
		() => (
			<Center
				className="footer"
				margin={margin}
				minH={minH}
				backgroundSize={backgroundSize[breakpoint]}
				sx={{ backgroundPosition: backgroundPosition[breakpoint] }}
			>
				<HStack
					justify="space-between"
					width={WIDTHS[breakpoint]}
					padding="0 0 1rem 0"
					className="bodycontent"
				>
					<Box>
						<Text fontSize=".8rem" float="right">
							Copyright 2022 SW DAO
							<br />
							All rights reserved
						</Text>
					</Box>
					<Box width="20%">
						<Center>
							<Image src="/images/swd-logo-vertical-white.png" alt="SW DAO" boxSize="4rem" />
						</Center>
					</Box>
					<VStack color="white">
						<HStack textAlign="right" spacing="0.25rem" fontSize={iconSize}>
							<Link isExternal href="https://dsc.gg/swdao" alt="Discord">
								<Image
									src="/images/icons/DiscordIcon.svg"
									alt="Discord"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link isExternal href="https://twitter.com/SW__DAO?s=20" alt="Twitter">
								<Image
									src="/images/icons/TwitterIcon.svg"
									alt="Twitter"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link isExternal href="https://medium.com/@sw_dao" alt="Medium">
								<Image
									src="/images/icons/MediumIcon.svg"
									alt="Medium"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link isExternal href="https://t.me/sw_dao" alt="Telegram">
								<Image
									src="/images/icons/TelegramIcon.svg"
									alt="Telegram"
									color="white"
									height={iconSize}
								/>
							</Link>
						</HStack>
						<HStack textAlign="right" spacing="0.25rem" fontSize={iconSize}>
							<Link isExternal href="https://sw-dao.gitbook.io/sw-dao/" alt="GitBook">
								<Image
									src="/images/icons/GitbookIcon.svg"
									alt="GitBook"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link isExternal href="https://github.com/sw-dao" alt="GitHub">
								<Image
									src="/images/icons/GithubIcon.svg"
									alt="GitHub"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link
								isExternal
								href="https://www.youtube.com/channel/UCGF2DpEMPlpuZ14Nf0lxaCQ"
								alt="Youtube"
							>
								<Image
									src="/images/icons/YoutubeIcon.svg"
									alt="Youtube"
									color="white"
									height={iconSize}
								/>
							</Link>
							<Link isExternal href="https://vote.swdao.org/" alt="Snapshot">
								<Image
									src="/images/icons/SnapshotIcon.svg"
									alt="Snapshop"
									color="white"
									height={iconSize}
								/>
							</Link>
						</HStack>
					</VStack>
				</HStack>
			</Center>
		),
		[margin, minH, breakpoint, iconSize],
	);

	if (!withSignup) {
		return mainFooter;
	}
	return (
		<Flex flexDirection="column" width="100%">
			<StyledSection
				id="emailform"
				section="purple"
				display="block"
				width="100%"
				paddingTop="11rem"
			>
				<Center>
					<EmailListForm minHeight="14rem" />
				</Center>
			</StyledSection>
			{mainFooter}
		</Flex>
	);
}
