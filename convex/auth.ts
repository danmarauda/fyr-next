import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { createApi } from 'better-auth-convex';
import { api, internal } from './_generated/api';
import type { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';
import { internalMutation } from './_generated/server';
import { getConvexEnv } from './helpers/getEnv';
import schema from './schema';

// const authFunctions: any = internal.auth;

export const createAuth = (ctx: ActionCtx, { optionsOnly = false } = {}) => {
	const baseURL = process.env.NEXT_PUBLIC_SITE_URL!;

	return betterAuth({
		baseURL,
		logger: { disabled: optionsOnly },
		plugins: [convex()],
		session: {
			expiresIn: 60 * 60 * 24 * 30, // 30 days
			updateAge: 60 * 60 * 24 * 15, // 15 days
		},
		socialProviders: {
			github: {
				clientId: process.env.GITHUB_CLIENT_ID!,
				clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			},
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID!,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			},
		},
		telemetry: { enabled: false },
		trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL!],
		user: {
			additionalFields: {
				bio: {
					required: false,
					type: 'string',
				},
				firstName: {
					required: false,
					type: 'string',
				},
				lastName: {
					required: false,
					type: 'string',
				},
				username: {
					required: false,
					type: 'string',
				},
			},
		},
		database: {
			type: 'convex',
			url: process.env.CONVEX_URL!,
		},
	});
};

export const auth = createAuth({} as any, { optionsOnly: true });

export const getAuth = (ctx: ActionCtx) =>
	betterAuth({
		...auth.options,
		database: {
			type: 'convex',
			url: process.env.CONVEX_URL!,
			ctx,
		},
	});

export const { create, deleteMany, deleteOne, findMany, findOne, updateMany, updateOne } =
	createApi(schema, { ...auth.options, internalMutation });

// Helper function to get current user
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
	// For now, return null until Better Auth is fully integrated
	// This will be implemented once the auth system is working
	return null;
};

// Helper function to require role (placeholder)
export const requireRole = async (ctx: QueryCtx | MutationCtx, role: string) => {
	// For now, do nothing until auth is fully integrated
	return null;
};

// Helper function to log security events (placeholder)
export const logSecurityEvent = async (ctx: QueryCtx | MutationCtx, event: any) => {
	// For now, do nothing until auth is fully integrated
	return null;
};
