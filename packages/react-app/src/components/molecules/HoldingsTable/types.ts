export type ColumnStyles = {
	name: Record<string, any>;
	ticker: Record<string, any>;
	price: Record<string, any>;
	change: Record<string, any>;
	chart: Record<string, any>;
	action: Record<string, any>;
};

export type SizedColumnStyles = Record<string, ColumnStyles>;

export const DEFAULT_COL_STYLES: SizedColumnStyles = {
	sm: {
		name: {
			width: '100%',
			height: '4rem',
		},
		ticker: {
			width: '40%',
			ml: '4.5rem',
			mt: '-1.3rem',
			textAlign: 'left',
		},
		price: {
			width: 'auto',
			ml: '4.5rem',
			mt: '-2.5rem',
			textAlign: 'left',
		},
		change: {
			width: '40%',
			ml: '40%',
			mt: '-1.2rem',
			paddingLeft: '9rem',
			textAlign: 'left',
		},
		chart: {
			ml: '4.5rem',
			width: '90%',
			paddingRight: '2rem',
		},
		action: {
			disabled: true,
		},
	},
	md: {
		name: {
			width: '100%',
			height: '4rem',
		},
		ticker: {},
		price: {
			width: 'auto',
			ml: '4.5rem',
			mt: '-2.5rem',
			textAlign: 'left',
		},
		change: {
			width: '40%',
			ml: '50%',
			mt: '-1.2rem',
			paddingLeft: '9rem',
			textAlign: 'left',
		},
		chart: {
			ml: '4.5rem',
			width: '90%',
			paddingRight: '2rem',
		},
		action: {
			disabled: true,
		},
	},
	lg: {
		name: {
			height: '4rem',
			width: '18rem',
		},
		ticker: {
			height: '4rem',
			lineHeight: '4rem',
			width: '8rem',
			textAlign: 'center',
		},
		price: {
			height: '4rem',
			lineHeight: '4rem',
			width: '8rem',
			textAlign: 'center',
		},
		change: {
			height: '4rem',
			lineHeight: '4rem',
			width: '10rem',
			textAlign: 'center',
		},
		chart: {
			height: '4rem',
			lineHeight: '4rem',
			width: '200px',
			minWidth: '200px',
			textAlign: 'center',
		},
		action: {
			height: '4rem',
			width: '7rem',
			padding: '1rem',
			textAlign: 'center',
		},
	},
	xl: {
		name: {
			height: '4rem',
			width: '18rem',
		},
		ticker: {
			height: '4rem',
			lineHeight: '4rem',
			width: '8rem',
			textAlign: 'center',
		},
		price: {
			height: '4rem',
			lineHeight: '4rem',
			width: '8rem',
			textAlign: 'center',
		},
		change: {
			height: '4rem',
			lineHeight: '4rem',
			width: '10rem',
			textAlign: 'center',
		},
		chart: {
			height: '4rem',
			lineHeight: '4rem',
			width: '40%',
			minWidth: '300px',
			textAlign: 'center',
		},
		action: {
			height: '4rem',
			width: '7rem',
			padding: '1rem',
			textAlign: 'center',
		},
	},
};
