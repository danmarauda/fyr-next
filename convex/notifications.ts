import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getCurrentUser } from './auth';

// Get notifications for current user
export const getNotifications = query({
	args: {
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
		read: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) throw new Error('Not authenticated');

		let query = ctx.db
			.query('notifications')
			.withIndex('by_user_read', (q) =>
				q.eq('userId', user._id).eq('read', args.read ?? false),
			);

		// Filter out expired notifications
		const now = Date.now();
		query = query.filter((q) =>
			q.or(q.eq(q.field('expiresAt'), undefined), q.gt(q.field('expiresAt'), now)),
		);

		return await query.order('desc').take(args.limit || 50);
	},
});

// Create notification
export const createNotification = mutation({
	args: {
		userId: v.id('user'),
		title: v.string(),
		message: v.string(),
		type: v.union(
			v.literal('info'),
			v.literal('warning'),
			v.literal('error'),
			v.literal('success'),
			v.literal('system'),
		),
		data: v.optional(v.object({})),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const notificationId = await ctx.db.insert('notifications', {
			...args,
			read: false,
			createdAt: Date.now(),
		});

		return notificationId;
	},
});

// Mark notification as read
export const markAsRead = mutation({
	args: {
		notificationId: v.id('notifications'),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) throw new Error('Not authenticated');

		const notification = await ctx.db.get(args.notificationId);
		if (!notification || notification.userId !== user._id) {
			throw new Error('Notification not found');
		}

		await ctx.db.patch(args.notificationId, {
			read: true,
			readAt: Date.now(),
		});
	},
});

// Mark all notifications as read
export const markAllAsRead = mutation({
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) throw new Error('Not authenticated');

		const notifications = await ctx.db
			.query('notifications')
			.withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
			.collect();

		await Promise.all(
			notifications.map((notification) =>
				ctx.db.patch(notification._id, {
					read: true,
					readAt: Date.now(),
				}),
			),
		);
	},
});

// Delete notification
export const deleteNotification = mutation({
	args: {
		notificationId: v.id('notifications'),
	},
	handler: async (ctx, args) => {
		const user = await getCurrentUser(ctx);
		if (!user) throw new Error('Not authenticated');

		const notification = await ctx.db.get(args.notificationId);
		if (!notification || notification.userId !== user._id) {
			throw new Error('Notification not found');
		}

		await ctx.db.delete(args.notificationId);
	},
});

// Get unread count
export const getUnreadCount = query({
	handler: async (ctx) => {
		const user = await getCurrentUser(ctx);
		if (!user) return 0;

		const notifications = await ctx.db
			.query('notifications')
			.withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
			.collect();

		return notifications.length;
	},
});

// Send system notification to all users (admin only)
export const sendSystemNotification = mutation({
	args: {
		title: v.string(),
		message: v.string(),
		type: v.union(
			v.literal('info'),
			v.literal('warning'),
			v.literal('error'),
			v.literal('success'),
			v.literal('system'),
		),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		// Only admins can send system notifications
		await ctx.runQuery(requireRole, 'admin');

		// Get all users
		const users = await ctx.db.query('user').collect();

		// Create notification for each user
		await Promise.all(
			users.map((user) =>
				ctx.db.insert('notifications', {
					userId: user._id,
					title: args.title,
					message: args.message,
					type: args.type,
					read: false,
					data: {},
					expiresAt: args.expiresAt,
					createdAt: Date.now(),
				}),
			),
		);
	},
});

// Clean up expired notifications (background job)
export const cleanupExpiredNotifications = mutation({
	handler: async (ctx) => {
		const now = Date.now();

		const expiredNotifications = await ctx.db
			.query('notifications')
			.filter((q) =>
				q.and(q.neq(q.field('expiresAt'), undefined), q.lt(q.field('expiresAt'), now)),
			)
			.collect();

		await Promise.all(
			expiredNotifications.map((notification) => ctx.db.delete(notification._id)),
		);

		return expiredNotifications.length;
	},
});
