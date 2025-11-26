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
		// For now, return empty array until auth is fully integrated
		return [];
	},
});

// Delete notification
export const deleteNotification = mutation({
	args: {
		notificationId: v.id('notifications'),
	},
	handler: async (ctx, args) => {
		// For now, do nothing until auth is fully integrated
		return null;
	},
});

// Get unread count
export const getUnreadCount = query({
	handler: async (ctx) => {
		// For now, return 0 until auth is fully integrated
		return 0;
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
		// For now, do nothing until auth is fully integrated
		return null;
	},
});

// Clean up expired notifications (background job)
export const cleanupExpiredNotifications = mutation({
	handler: async (ctx) => {
		const now = Date.now();

		const expiredNotifications = await ctx.db
			.query('notifications')
			.filter((q) => q.and(q.neq(q.field('expiresAt'), undefined), q.lt(q.field('expiresAt'), now)))
			.collect();

		await Promise.all(expiredNotifications.map((notification) => ctx.db.delete(notification._id)));

		return expiredNotifications.length;
	},
});
