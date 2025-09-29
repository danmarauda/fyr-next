import { betterAuth } from 'better-auth';
import { ConvexAdapter } from 'better-auth/adapters/convex';
import { convexClient } from './convex-client';

export const auth = betterAuth({
	database: ConvexAdapter(convexClient),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	advanced: {
		generateId: false, // Let Convex handle ID generation
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	rateLimit: {
		window: 10,
		max: 100,
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
	},
	plugins: [],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
