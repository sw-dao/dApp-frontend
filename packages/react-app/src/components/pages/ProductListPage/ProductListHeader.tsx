import { Button, Flex, Spacer, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { MdClose, MdFilterAlt } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { PRODUCTS_BY_CATEGORY } from '../../../config/products';
import { isLargeBreakpoint } from '../../../state';
import CategoryButton from './CategoryButton';
import TimeButton from './TimeButton';

const CATEGORY_BUTTON_WIDTHS: Record<string, string> = {
	sm: '7rem',
	md: '7rem',
	lg: 'auto',
	xl: 'auto',
};

type ProductListHeaderProps = {
	filter: string;
	period: string;
	onFilterChange: (filter: string) => void;
	onPeriodChange: (period: string) => void;
};

export default function ProductListHeader({
	period,
	filter,
	onFilterChange,
	onPeriodChange,
}: ProductListHeaderProps): JSX.Element {
	const isLarge = useRecoilValue(isLargeBreakpoint);
	const { isOpen, onToggle, onClose } = useDisclosure();
	const { isOpen: isTimeOpen, onToggle: onTimeToggle, onClose: onTimeClose } = useDisclosure();

	const handleFilter = useCallback(
		(filter: string) => {
			onFilterChange(filter);
			if (isOpen) onClose();
		},
		[isOpen, onClose, onFilterChange],
	);

	const effectiveFilter = useMemo(
		() => (filter === 'all' || filter === '' ? 'ALL' : filter),
		[filter],
	);

	const categoryButtons = useMemo(() => {
		const keys = Object.keys(PRODUCTS_BY_CATEGORY);
		keys.sort();
		return ['ALL', ...keys].map((key: string) => {
			return (
				<CategoryButton
					key={key}
					name={key}
					onClick={handleFilter}
					active={effectiveFilter === key}
					widths={CATEGORY_BUTTON_WIDTHS}
				/>
			);
		});
	}, [effectiveFilter, handleFilter]);

	const dynamicButtons = useMemo(() => {
		if (!isLarge) {
			if (isOpen) {
				return (
					<VStack
						alignItems="baseline"
						bgColor="blue5"
						border="1px solid #3861F7"
						borderRadius="2em"
						left="0"
						padding="0.5rem 0.5rem 1rem 1rem"
						pos="absolute"
						spacing="1.5rem"
						top="0"
						width="9rem"
						zIndex={1}
					>
						<Button
							_hover={{ color: '#120046', bgColor: 'alttext' }}
							alignSelf="left"
							bgColor="transparent"
							borderColor="alttext"
							borderWidth="1px"
							color="alttext"
							fontSize="0.9rem"
							onClick={onToggle}
							padding="0.4rem 3rem"
							width="7rem"
							variant="unstyled"
						>
							<MdClose />
						</Button>
						{categoryButtons}
					</VStack>
				);
			}
			return (
				<Button
					_hover={{ color: '#120046', bgColor: 'alttext' }}
					bgColor="transparent"
					borderColor="alttext"
					borderWidth="1px"
					color="alttext"
					fontSize="0.9rem"
					onClick={onToggle}
					padding="0.5rem 2rem"
					variant="unstyled"
				>
					<MdFilterAlt />
				</Button>
			);
		}
		return categoryButtons;
	}, [categoryButtons, isLarge, isOpen, onToggle]);

	const [borderRadius, mb] = useMemo(
		() => (isLarge ? ['2em 2em 0 0', '0'] : ['2em', '1rem']),
		[isLarge],
	);

	const handlePeriodChange = useCallback(
		(newPeriod: string) => {
			onPeriodChange(newPeriod);
			onTimeClose();
		},
		[onPeriodChange, onTimeClose],
	);

	return (
		<Flex
			id="mainheader"
			width="100%"
			borderRadius={borderRadius}
			bgColor="#060119"
			padding="1rem"
			mb={mb}
			pos="relative"
			alignItems="flex-end"
		>
			{dynamicButtons}
			<Spacer />
			<TimeButton period={period} onClick={onTimeToggle} />
			{isTimeOpen && (
				<VStack
					border="1px solid #3861F7"
					bgColor="blue5"
					borderRadius="12px"
					pos="absolute"
					right="0"
					top="0"
					padding="0.5rem 0.5rem 1rem 0.5rem"
					zIndex={1}
				>
					<Button
						_hover={{ color: '#120046', bgColor: 'alttext' }}
						alignSelf="left"
						bgColor="transparent"
						borderColor="alttext"
						borderWidth="1px"
						borderRadius="12px"
						color="alttext"
						fontSize="0.9rem"
						onClick={onTimeClose}
						width="7rem"
						variant="unstyled"
						paddingLeft="3rem"
					>
						<MdClose />
					</Button>
					<TimeButton period="1Y" onClick={handlePeriodChange} />
					<TimeButton period="1M" onClick={handlePeriodChange} />
					<TimeButton period="1W" onClick={handlePeriodChange} />
					<TimeButton period="1D" onClick={handlePeriodChange} />
				</VStack>
			)}
		</Flex>
	);
}
