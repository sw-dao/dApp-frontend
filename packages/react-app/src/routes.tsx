import React from 'react';
import { NotFoundPage } from './components/pages/NotFoundPage';

import { PortfolioPage } from './components/pages/PortfolioPage';
import { ProductDetailsPage } from './components/pages/ProductDetailsPage';
import { ProductListPage } from './components/pages/ProductListPage/ProductListPage';
import { SWDTokenPage } from './components/pages/SWDTokenPage';
import { PRODUCTS_BY_SYMBOL } from './config/products';
import { getTokenName } from './utils';

interface SymbolPath {
	symbol: string;
}

interface RouteDetail {
	component: (path: SymbolPath) => JSX.Element;
	title: (path: SymbolPath) => string;
}

interface RouteDetails {
	[key: string]: RouteDetail;
}

interface Routes {
	[key: string]: (path: SymbolPath) => JSX.Element;
}

interface Titles {
	[key: string]: (path: SymbolPath) => string;
}

export const routeDetails: RouteDetails = {
	'/token': {
		component: () => <SWDTokenPage />,
		title: () => 'SW DAO | SWD Token',
	},
	'/': {
		component: () => <ProductListPage />,
		title: () => 'SW DAO | Products',
	},
	'/product/:symbol': {
		component: ({ symbol }: SymbolPath) => {
			return !(symbol in PRODUCTS_BY_SYMBOL) ? (
				<NotFoundPage />
			) : (
				<ProductDetailsPage symbol={symbol} />
			);
		},
		title: ({ symbol }: SymbolPath) => `SW DAO | ${getTokenName(symbol)}`,
	},
	'/portfolio': {
		component: () => <PortfolioPage />,
		title: () => 'SW DAO | Portfolio Balance',
	},
};

export const routes: Routes = {};
export const titles: Titles = {};
Object.keys(routeDetails).forEach((key) => {
	routes[key] = routeDetails[key].component;
	titles[key] = routeDetails[key].title;
});
