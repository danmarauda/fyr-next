'use client';

import React, { ReactNode, useCallback } from 'react';
import { ConvexProviderWithAuth } from 'convex/react';
import { AuthKitProvider, useAuth, useAccessToken } from '@workos-inc/authkit-nextjs/components';
import { convexClient } from '@/lib/convex-client';

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
	return (
		<AuthKitProvider>
			<ConvexProviderWithAuth client={convexClient} useAuth={useAuthFromAuthKit}>
				{children}
			</ConvexProviderWithAuth>
		</AuthKitProvider>
	);
};

function useAuthFromAuthKit() {
	const { user, loading: isLoading } = useAuth();
	const { getAccessToken, refresh } = useAccessToken();

	const isAuthenticated = !!user;

	const fetchAccessToken = useCallback(
		async ({ forceRefreshToken }: { forceRefreshToken?: boolean } = {}) => {
			if (!user) {
				return null;
			}

			try {
				if (forceRefreshToken) {
					return (await refresh()) ?? null;
				}

				return (await getAccessToken()) ?? null;
			} catch (error) {
				console.error('Failed to get access token:', error);
				return null;
			}
		},
		[user, refresh, getAccessToken],
	);

	return {
		isLoading,
		isAuthenticated,
		fetchAccessToken,
	};
}
