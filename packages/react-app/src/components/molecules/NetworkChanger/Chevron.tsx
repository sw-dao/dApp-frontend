import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Chevron(props: { isOpen: boolean; color: string }): JSX.Element {
	const { isOpen, color } = props;
	return isOpen ? <FaChevronUp color={color} /> : <FaChevronDown color={color} />;
}
