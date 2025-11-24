import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { createApi } from 'better-auth-convex';
import { api, internal } from './_generated/api';
import type { ActionCtx, GenericCtx, MutationCtx, QueryCtx } from './_generated/server';
import { internalMutation } from './_generated/server';
import { getEnv } from './helpers/getEnv';
import schema from './schema';

const authFunctions: any = internal.auth;

export const createAuth = (ctx: GenericCtx, { optionsOnly = false } = {}) => {
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

export const getAuth = (ctx: GenericCtx) =>
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
