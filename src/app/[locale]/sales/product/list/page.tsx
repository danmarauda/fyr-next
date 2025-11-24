import React from 'react';
import { Metadata } from 'next';
import ProductListClient from './client';

export const metadata: Metadata = {
	title: 'ALIAS | Product List',
};

const ProductListPage = () => {
	return <ProductListClient />;
};

export default ProductListPage;
