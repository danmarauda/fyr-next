'use client';

import React, { ReactNode } from 'react';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { convexClient } from '@/lib/convex-client';
import { authClient } from '@/lib/auth-client';

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ConvexBetterAuthProvider authClient={authClient} client={convexClient}>
			{children}
		</ConvexBetterAuthProvider>
	);
};
