'use client';

import React, { ReactNode } from 'react';
import { ThemeContextProvider } from '@/context/themeContext';
import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider';
import BetterAuthProvider from '../../../packages/auth/src/react/NextAuthProvider';

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeContextProvider>
			<ConvexClientProvider>
				<BetterAuthProvider>{children}</BetterAuthProvider>
			</ConvexClientProvider>
		</ThemeContextProvider>
	);
};

export default Providers;
