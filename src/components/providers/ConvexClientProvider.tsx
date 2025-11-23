'use client';

import React, { ReactNode } from 'react';
import { ConvexProviderWithAuth } from 'convex/react';
import { convexClient } from '@/lib/convex-client';
import { authClient } from '@fyr/auth';

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ConvexProviderWithAuth client={convexClient} useAuth={useAuthFromBetterAuth}>
			{children}
		</ConvexProviderWithAuth>
	);
};

function useAuthFromBetterAuth() {
	const { data: session, isPending } = authClient.useSession();

	const isAuthenticated = !!session;
	const isLoading = isPending;

	const fetchAccessToken = async ({
		forceRefreshToken,
	}: { forceRefreshToken?: boolean } = {}) => {
		try {
			// For better-auth, we can get the session token
			if (session?.session?.token) {
				return session.session.token;
			}
			return null;
		} catch (error) {
			console.error('Failed to get access token:', error);
			return null;
		}
	};

	return {
		isLoading,
		isAuthenticated,
		fetchAccessToken,
	};
}
