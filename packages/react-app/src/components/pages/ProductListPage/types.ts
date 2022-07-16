export interface CategoryButtonProps {
	name: string;
	onClick: (name: string) => void;
	active: boolean;
	widths: Record<string, string>;
	isOpen: boolean;
}

export interface ActiveProps {
	color: string;
	bgColor: string;
	borderColor: string;
}

export interface ButtonProps {
	label: string;
	image: string;
	active: ActiveProps;
	inactive: ActiveProps;
	imageHeight?: string;
	imageTop?: string;
}

export interface ButtonStyleProps {
	[key: string]: ButtonProps;
}
