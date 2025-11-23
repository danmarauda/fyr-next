import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
	fetchOptions: {
		onRequest: (context) => {
			return {
				...context,
				headers: {
					...context.headers,
				},
			};
		},
		onResponse: (context) => {
			return context;
		},
	},
});

export const { signIn, signUp, signOut, useSession } = authClient;
