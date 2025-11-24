import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireRole, logSecurityEvent } from './auth';

// Get current user with full profile
export const getCurrentUser = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;

		// Find user by email
		const user = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), identity.email))
			.first();

		if (!user) return null;

		// Get user's organizations and roles
		const memberships = await ctx.db
			.query('member')
			.withIndex('organizationId_userId', (q) => q.eq('userId', user._id))
			.collect();

		const organizations = await Promise.all(
			memberships.map(async (membership) => {
				const org = await ctx.db.get(membership.organizationId);
				return {
					...org,
					role: membership.role,
					joinedAt: membership.createdAt,
				};
			}),
		);

		return {
			...user,
			organizations,
		};
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
		// Only admins can set roles
		const admin = await requireRole(ctx, 'admin');

		const user = await ctx.db.get(args.userId);
		if (!user) throw new Error('User not found');

		const oldRole = user.role;
		await ctx.db.patch(args.userId, { role: args.role });

		// Log security event
		await ctx.runMutation(logSecurityEvent, {
			userId: admin._id,
			action: 'role_change',
			resource: 'user',
			resourceId: args.userId,
			details: {
				oldRole,
				newRole: args.role,
				targetUserId: args.userId,
			},
		});
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

		const users = await query.order('desc').paginate({
			numItems: args.limit || 50,
			cursor: args.offset
				? { __tableName: 'user', __indexName: '_creationTime', __indexValue: args.offset }
				: null,
		});

		return users;
	},
});

// Ban/unban user (admin only)
export const toggleUserBan = mutation({
	args: {
		userId: v.id('user'),
		banned: v.boolean(),
		banReason: v.optional(v.string()),
		banExpires: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const admin = await requireRole(ctx, 'admin');

		const user = await ctx.db.get(args.userId);
		if (!user) throw new Error('User not found');

		await ctx.db.patch(args.userId, {
			banned: args.banned,
			banReason: args.banned ? args.banReason : undefined,
			banExpires: args.banned ? args.banExpires : undefined,
		});

		// Log security event
		await ctx.runMutation(logSecurityEvent, {
			userId: admin._id,
			action: args.banned ? 'user_banned' : 'user_unbanned',
			resource: 'user',
			resourceId: args.userId,
			details: {
				banReason: args.banReason,
				banExpires: args.banExpires,
			},
		});
	},
});

// Track user login
export const trackLogin = mutation({
	args: {
		ipAddress: v.optional(v.string()),
		userAgent: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return;

		// Find user by email
		const user = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), identity.email))
			.first();

		if (!user) return;

		const now = Date.now();

		await ctx.db.patch(user._id, {
			lastLoginAt: now,
			loginCount: (user?.loginCount || 0) + 1,
		});

		// Log security event
		await ctx.runMutation(logSecurityEvent, {
			userId: user._id,
			action: 'login',
			resource: 'auth',
			details: {
				ipAddress: args.ipAddress,
				userAgent: args.userAgent,
			},
		});
	},
});
