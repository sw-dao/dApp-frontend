import {
	Box,
	Center,
	Flex,
	Image,
	List,
	ListItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import { navigate } from 'hookrouter';
import { A } from 'hookrouter';
import React, { useMemo } from 'react';
import { HiExternalLink } from 'react-icons/hi';

import { SIDE_PADDING, WIDTHS } from '../../../config';
import { SearchField } from '../../atoms/SearchField';
import WalletButton from '../../molecules/WalletButton/WalletButton';
import { HeaderLink } from './HeaderLink';

interface ModalMenuProps {
	handleSearch: (value: string) => void;
	isOpen: boolean;
	mobile: boolean;
	onClose: () => void;
	pathKey: string;
	breakpoint: string;
}

const listItemStyle: any = {
	color: 'bodytext',
	fontSize: 'xl',
	mb: '16px',
};

const walletIcon = <Image src="/images/swd-logo-sm-white.png" alt="SW DAO Logo" h="25px" />;

export function ModalMenu({
	handleSearch,
	isOpen,
	mobile,
	onClose,
	pathKey,
	breakpoint,
}: ModalMenuProps): JSX.Element {
	return (
		<Modal
			size="full"
			blockScrollOnMount={true}
			isOpen={isOpen}
			onClose={onClose}
			preserveScrollBarGap={false}
		>
			<ModalOverlay
				bg="blackAlpha.300"
				backdropFilter="blur(10px) hue-rotate(90deg)"
			></ModalOverlay>
			<ModalContent top="0" bgGradient="linear(180deg,#1F8CFD 0%, #7200E6 100%)">
				<ModalHeader padding="0">
					<Box className="header" margin="0.5 auto" padding={`0.5em ${SIDE_PADDING[breakpoint]}`}>
						<Flex
							flexFlow="row nowrap"
							justify="space-between"
							height="80px"
							width={WIDTHS[breakpoint]}
							maxWidth="1440px"
							fontSize="1.5rem"
							verticalAlign="middle"
							lineHeight="1.5rem"
							marginTop="1.2rem"
						>
							<Image
								d="inline-block"
								h="90px"
								padding="0 0 1rem 0"
								lineHeight="80px"
								marginTop="-1.3rem"
								src="/images/swd-logo.png"
								cursor="pointer"
								onClick={() => {
									onClose();
									navigate('/');
								}}
							/>
							<Box mr="2rem" mt="-4px">
								<WalletButton
									key="wallet"
									variant="primary"
									width="7rem"
									connectLabel="Connect"
									icon={walletIcon}
									tooltip={false}
									onClick={onClose}
								/>
							</Box>
							<ModalCloseButton top="25px" color="whitish" />
						</Flex>
					</Box>
				</ModalHeader>
				<ModalBody>
					<Center textAlign="center">
						<List>
							<ListItem>
								<HeaderLink
									variant="list"
									page="Token"
									isActive={pathKey === 'token'}
									url="/token"
								/>
							</ListItem>
							<ListItem>
								<HeaderLink
									variant="list"
									page="Products"
									isActive={pathKey === 'products'}
									url="/"
								/>
							</ListItem>
							<ListItem>
								<Box {...listItemStyle}>
									<A href="https://vote.swdao.org">
										<Text className="link" _hover={{ color: 'white', textDecoration: 'underline' }}>
											VOTE <Box display="inline-block" as={HiExternalLink} />
										</Text>
									</A>
								</Box>
							</ListItem>
							<ListItem>
								<Box {...listItemStyle}>
									<A href="https://dsc.gg/swdao">
										<Text className="link" _hover={{ color: 'white', textDecoration: 'underline' }}>
											JOIN US <Box display="inline-block" as={HiExternalLink} />
										</Text>
									</A>
								</Box>
							</ListItem>
							<ListItem>
								<Box
									width="15rem"
									textAlign="left"
									bgColor="black"
									borderRadius="3em"
									borderColor="#fff"
									position="relative"
								>
									<SearchField
										label="🔎︎  Search"
										width="15rem"
										height="1.5rem"
										onChange={handleSearch}
										longLabel={true}
										zIndex={40}
										mobile={mobile}
									/>
								</Box>
							</ListItem>
						</List>
					</Center>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

/*
<ListItem>
	<HeaderLink variant="list" page="Portfolio" isActive={pathKey === 'portfolio'} />
</ListItem>
*/
