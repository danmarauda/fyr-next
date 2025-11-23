import React from 'react';
import TranslationsProvider from '@/components/TranslationsProvider';
import HomeClient from '@/app/[locale]/(home)/_client';
import PageFallbackTemplate from '@/templates/PageFallback.template';

const i18nNamespaces = ['translation'];

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
	const { locale } = await params;

	return (
		<TranslationsProvider
			namespaces={i18nNamespaces}
			locale={locale}
			fallback={<PageFallbackTemplate />}>
			<HomeClient />
		</TranslationsProvider>
	);
};

export default Home;
