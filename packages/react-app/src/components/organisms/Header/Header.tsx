import { Box, Flex, Image, Spacer, useDisclosure } from '@chakra-ui/react';
import { A, navigate, usePath } from 'hookrouter';
import React, { useMemo } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';
import useImage from 'react-use-image';

import { SIDE_PADDING, WIDTHS } from '../../../config';
import { SearchField } from '../../atoms/SearchField';
// import { NetworkChanger } from '../../molecules/NetworkChanger';
import WalletButton from '../../molecules/WalletButton/WalletButton';
import { HeaderLink } from './HeaderLink';
import { ModalMenu } from './ModalMenu';

const walletIcon = <Image src="/images/swd-logo-sm-white.png" alt="SW DAO Logo" h="25px" />;

const getPathKey = (path: string) => {
	const pathParts = path.split('/');
	if (!pathParts) {
		return 'products';
	}
	let pathKey = pathParts.shift();
	// ignore site part of url
	while (pathKey === 'site' || pathKey === '') pathKey = pathParts.shift();
	// drop querystrings
	if (pathKey && pathKey.indexOf('?') > -1) pathKey = pathKey.split('?')[0];
	if (pathKey === 'product') pathKey = 'products';
	return pathKey || 'products';
};

export function Header(props: { breakpoint: string; mobile: boolean }): JSX.Element {
	const { breakpoint, mobile } = props;
	const path = usePath();
	const pathKey = getPathKey(path);
	const { isOpen, onOpen, onClose } = useDisclosure();
	useImage('/images/swd-logo.png');
	useImage('/images/swd-logo-text.png');
	useImage('/images/swd-logo-sm-white.png');

	function handleSearch(token: string): void {
		if (token === 'SWD') {
			navigate('/token');
		} else {
			navigate(`/product/${token}`);
		}
	}

	const swdLogo = useMemo(
		() => (breakpoint === 'xl' ? '/images/swd-logo-text.png' : '/images/swd-logo.png'),
		[breakpoint],
	);

	const links = useMemo(() => {
		const links: Array<JSX.Element> =
			breakpoint !== 'sm'
				? [
						<HeaderLink key="products" page="Products" url="/" isActive={pathKey === 'products'} />,
						<Spacer key="spc2" />,
						<HeaderLink key="token" page="Token" isActive={pathKey === 'token'} />,
						<Spacer key="spc" />,
						<HeaderLink key="portfolio" page="Portfolio" isActive={pathKey === 'portfolio'} />,
						<Spacer key="spc" />,
				  ]
				: [];
		if (['lg', 'xl'].includes(breakpoint)) {
			links.push(
				<Box
					key="search"
					className={mobile ? 'mobile' : 'desktop'}
					width={[0, 0, '11rem', '14rem']}
					textAlign="left"
					bgColor="transparent"
					borderRadius="max"
					borderColor="#fff"
					position="relative"
				>
					<SearchField
						absolute
						label="Search"
						top="0"
						width={[null, null, '11rem', '14rem']}
						onChange={handleSearch}
						longLabel={true}
						zIndex={20}
						mobile={false}
					/>
				</Box>,
			);
		}
		links.push(<Spacer key="spc3" />);
		// links.push(<NetworkChanger key="networkchange" />);
		links.push(<WalletButton key="wallet" variant="primary" icon={walletIcon} />);
		if (['sm', 'md'].includes(breakpoint)) {
			links.push(
				<Box
					as={HiOutlineMenu}
					key="menu"
					size="1.5rem"
					color="white"
					onClick={onOpen}
					_hover={{ color: '#AADCFE', cursor: 'pointer' }}
					ml="1rem"
				/>,
			);
		}
		return links;
	}, [breakpoint, mobile, onOpen, pathKey]);

	return (
		<Box margin="0.5 auto" padding={`0.5em ${SIDE_PADDING[breakpoint]}`}>
			<Flex
				flexFlow="row nowrap"
				className="header bodycontent"
				justify="space-between"
				height="80px"
				width={WIDTHS[breakpoint]}
				maxWidth="1440px"
				fontSize="1.5rem"
				verticalAlign="middle"
				lineHeight="1.5rem"
				marginTop="1.2rem"
			>
				<A href={window.location.origin}>
					<Image
						src={swdLogo}
						d="inline-block"
						h="90px"
						padding="0 0 1rem 0"
						lineHeight="80px"
						marginTop="-1.2rem"
					/>
				</A>
				<Spacer />
				{links}
			</Flex>
			<ModalMenu
				breakpoint={breakpoint}
				isOpen={isOpen}
				onClose={onClose}
				handleSearch={handleSearch}
				pathKey={pathKey}
				mobile={mobile}
			/>
		</Box>
	);
}
