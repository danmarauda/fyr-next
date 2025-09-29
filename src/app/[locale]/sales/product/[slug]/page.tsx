import React from 'react';
import ProductPageClient from '@/app/[locale]/sales/product/[slug]/client';

const ProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const resolved = await params;
	return <ProductPageClient params={resolved} />;
};

export default ProductPage;
