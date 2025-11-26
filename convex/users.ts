import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireRole, logSecurityEvent } from './auth';

// Get current user with full profile
export const getCurrentUser = query({
	handler: async (ctx) => {
		// For now, return null until auth is fully integrated
		return null;
	},
});

// Update user role (admin only)
export const setUserRole = mutation({
	args: {
		userId: v.id('user'),
		role: v.union(
			v.literal('admin'),
			v.literal('user'),
			v.literal('moderator'),
			v.literal('manager'),
		),
	},
	handler: async (ctx, args) => {
		// For now, do nothing until auth is fully integrated
		return { success: true };
	},
});

// Update user preferences
export const updateUserPreferences = mutation({
	args: {
		preferences: v.object({
			theme: v.optional(v.string()),
			notifications: v.optional(
				v.object({
					email: v.boolean(),
					push: v.boolean(),
					marketing: v.boolean(),
				}),
			),
			language: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		// Find user by email
		const user = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), identity.email))
			.first();

		if (!user) throw new Error('User not found');

		await ctx.db.patch(user._id, { preferences: args.preferences });
	},
});

// Get user by email
export const getUserByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), args.email))
			.first();
	},
});

// Create user (for development/admin purposes)
export const createUser = mutation({
	args: {
		email: v.string(),
		name: v.string(),
		role: v.optional(v.string()),
		password: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Only allow in development or for admin users
		if (process.env.NODE_ENV !== 'development') {
			await requireRole(ctx, 'admin');
		}

		const existingUser = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), args.email))
			.first();

		if (existingUser) {
			throw new Error('User already exists');
		}

		const now = Date.now();
		const userId = await ctx.db.insert('user', {
			email: args.email,
			name: args.name,
			role: args.role || 'user',
			emailVerified: true,
			createdAt: now,
			updatedAt: now,
			lastLoginAt: now,
			loginCount: 0,
		});

		return userId;
	},
});

// Update user profile
export const updateProfile = mutation({
	args: {
		name: v.optional(v.string()),
		bio: v.optional(v.string()),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		location: v.optional(v.string()),
		website: v.optional(v.string()),
		github: v.optional(v.string()),
		linkedin: v.optional(v.string()),
		x: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		// Find user by email
		const user = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), identity.email))
			.first();

		if (!user) throw new Error('User not found');

		await ctx.db.patch(user._id, args);
	},
});

// Get users for admin management
export const getUsers = query({
	args: {
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
		role: v.optional(v.string()),
		search: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Only admins can list users
		await requireRole(ctx, 'admin');

		let query = ctx.db.query('user');

		if (args.role) {
			query = query.filter((q) => q.eq(q.field('role'), args.role));
		}

		if (args.search) {
			// Search by name or email
			query = query.filter((q) =>
				q.or(q.eq(q.field('name'), args.search), q.eq(q.field('email'), args.search)),
			);
		}

		const users = await query.order('desc').take(args.limit || 50);

		return users;
	},
});

// Ban/unban user (admin only)
export const toggleUserBan = mutation({
	args: {
		userId: v.id('user'),
		banned: v.boolean(),
		reason: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// For now, do nothing until auth is fully integrated
		return { success: true };
	},
});

// Track user login
export const trackLogin = mutation({
	args: {
		email: v.string(),
	},
	handler: async (ctx, args) => {
		// For now, do nothing until auth is fully integrated
		return { success: true };
	},
});
