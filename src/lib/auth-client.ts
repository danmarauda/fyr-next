// Mock better-auth client for testing without authentication
// This provides a no-op implementation that matches the better-auth API

export const authClient = {
	// Session management
	useSession: () => ({
		data: {
			user: {
				id: 'mock-user-id',
				email: 'test@example.com',
				name: 'Test User',
				emailVerified: true,
				createdAt: new Date().toISOString(),
				username: 'testuser',
				role: 'admin',
				image: null,
			},
		},
		isPending: false,
		error: null,
	}),

	// Authentication methods
	signIn: {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		email: async ({ email, password }: { email: string; password: string }) => {
			console.log('[MOCK AUTH] Email sign in:', { email });
			// Simulate successful login
			return {
				data: { user: { id: 'mock-user-id', email, name: 'Test User' } },
				error: null,
			};
		},
		social: async ({ provider }: { provider: string }) => {
			console.log('[MOCK AUTH] Social sign in:', { provider });
			return { data: { user: { id: 'mock-user-id' } }, error: null };
		},
	},

	signUp: {
		email: async ({
			email,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			password,
			name,
		}: {
			email: string;
			password: string;
			name?: string;
		}) => {
			console.log('[MOCK AUTH] Email sign up:', { email, name });
			return { data: { user: { id: 'mock-user-id', email, name } }, error: null };
		},
	},

	signOut: async () => {
		console.log('[MOCK AUTH] Sign out');
		return { data: null, error: null };
	},

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	resetPassword: async ({ newPassword, token }: { newPassword: string; token: string }) => {
		console.log('[MOCK AUTH] Reset password:', { token });
		return { data: null, error: null };
	},

	forgetPassword: async ({ email }: { email: string }) => {
		console.log('[MOCK AUTH] Forget password:', { email });
		return { data: null, error: null };
	},

	// Verification methods
	sendVerificationEmail: async () => {
		console.log('[MOCK AUTH] Send verification email');
		return { data: null, error: null };
	},

	verifyEmail: async ({ token }: { token: string }) => {
		console.log('[MOCK AUTH] Verify email:', { token });
		return { data: null, error: null };
	},
};

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession } = authClient;
