'use client';

import React, { type ReactNode } from 'react';
import { ThemeContextProvider } from '@/context/themeContext';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeContextProvider>
			<ConvexClientProvider>{children}</ConvexClientProvider>
		</ThemeContextProvider>
	);
};

export default Providers;
