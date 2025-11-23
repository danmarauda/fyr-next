'use client';

import React, { ReactNode } from 'react';
import { ThemeContextProvider } from '@/context/themeContext';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import { AuthProvider } from '@fyr/auth';

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeContextProvider>
			<ConvexClientProvider>
				<AuthProvider>{children}</AuthProvider>
			</ConvexClientProvider>
		</ThemeContextProvider>
	);
};

export default Providers;
