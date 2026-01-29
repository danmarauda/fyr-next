import { convex } from '@convex-dev/better-auth/plugins';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import { createApi, createClient } from 'better-convex/auth';
import type { ActionCtx, MutationCtx, QueryCtx } from './_generated/server';
import { internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import authConfig from './auth.config';
import schema from './schema';

const siteUrl =
	process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Create the auth client using better-convex
export const authClient = createClient<DataModel, typeof schema>({
	authFunctions: internal.auth,
	schema,
	internalMutation,
});

// Auth options factory
const createAuthOptions = (ctx: QueryCtx | MutationCtx | ActionCtx): BetterAuthOptions => ({
	baseURL: siteUrl,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24 * 15, // 15 days
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	telemetry: { enabled: false },
	trustedOrigins: [
		siteUrl,
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:3002',
		'http://localhost:3003',
	],
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
	plugins: [
		convex({
			authConfig,
		}),
	],
	database: authClient.httpAdapter(ctx),
});

// For queries/mutations - uses sync adapter
export const getAuth = <Ctx extends QueryCtx | MutationCtx>(ctx: Ctx) =>
	betterAuth({
		...createAuthOptions(ctx),
		database: authClient.adapter(ctx, createAuthOptions),
	});

// For actions/HTTP - uses http adapter
export const createAuth = (ctx: ActionCtx) => betterAuth(createAuthOptions(ctx));

// Create API functions for Better Auth
export const { create, deleteMany, deleteOne, findMany, findOne, updateMany, updateOne } =
	createApi(schema, createAuth, { internalMutation });

// Get current user helper
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const auth = getAuth(ctx);
		const session = await auth.api.getSession({ headers: new Headers() });
		return session?.user ?? null;
	},
});

// Role guard helper
export const requireRole = async (ctx: QueryCtx | MutationCtx, role: string) => {
	const auth = getAuth(ctx);
	const session = await auth.api.getSession({ headers: new Headers() });
	if (!session?.user || session.user.role !== role) {
		throw new Error(`Role "${role}" required`);
	}
	return session.user;
};

// Security event logger
export const logSecurityEvent = async (
	_ctx: QueryCtx | MutationCtx,
	event: Record<string, unknown>,
) => {
	console.log('Security event:', event);
	return null;
};

// Export auth for CLI usage
export const auth = betterAuth(createAuthOptions({} as ActionCtx));
