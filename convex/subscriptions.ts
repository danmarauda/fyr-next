import { v } from 'convex/values';
import { action, mutation, query } from './_generated/server';
import { requireRole } from './auth';

// Get subscription plans
export const getPlans = query({
	handler: async (ctx) => {
		return await ctx.db
			.query('plans')
			.filter((q) => q.eq(q.field('isActive'), true))
			.collect();
	},
});

// Get user subscription
export const getUserSubscription = query({
	args: { userId: v.id('user') },
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query('subscriptions')
			.withIndex('userId', (q) => q.eq('userId', args.userId))
			.filter((q) => q.eq(q.field('status'), 'active'))
			.first();

		if (!subscription) return null;

		const plan = await ctx.db.get(subscription.stripePriceId as any);
		return {
			...subscription,
			plan,
		};
	},
});

// Create subscription checkout session (Stripe)
export const createCheckoutSession = action({
	args: {
		planId: v.id('plans'),
		userId: v.id('user'),
		successUrl: v.string(),
		cancelUrl: v.string(),
	},
	handler: async (ctx, args) => {
		// This would integrate with Stripe
		// For now, return a mock response
		return {
			url: `${args.successUrl}?session_id=mock_session`,
		};
	},
});

// Update subscription (admin only)
export const updateSubscription = mutation({
	args: {
		subscriptionId: v.id('subscriptions'),
		status: v.optional(v.string()),
		cancelAtPeriodEnd: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireRole(ctx, 'admin');

		await ctx.db.patch(args.subscriptionId, {
			...(args.status && { status: args.status }),
			...(args.cancelAtPeriodEnd !== undefined && {
				cancelAtPeriodEnd: args.cancelAtPeriodEnd,
			}),
		});
	},
});

// Cancel subscription
export const cancelSubscription = mutation({
	args: {
		subscriptionId: v.id('subscriptions'),
		immediately: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db.get(args.subscriptionId);
		if (!subscription) throw new Error('Subscription not found');

		// Check if user owns this subscription
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		// Find user by email
		const user = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), identity.email))
			.first();

		if (!user) throw new Error('User not found');

		if (subscription.userId !== user._id) {
			await requireRole(ctx, 'admin'); // Only admin can cancel others' subscriptions
		}

		if (args.immediately) {
			await ctx.db.patch(args.subscriptionId, {
				status: 'canceled',
				cancelAtPeriodEnd: false,
			});
		} else {
			await ctx.db.patch(args.subscriptionId, {
				cancelAtPeriodEnd: true,
			});
		}
	},
});

// Get subscription analytics
export const getSubscriptionAnalytics = query({
	handler: async (ctx) => {
		await requireRole(ctx, 'admin');

		const subscriptions = await ctx.db.query('subscriptions').collect();

		const analytics = {
			total: subscriptions.length,
			active: subscriptions.filter((s) => s.status === 'active').length,
			canceled: subscriptions.filter((s) => s.status === 'canceled').length,
			pastDue: subscriptions.filter((s) => s.status === 'past_due').length,
			revenue: subscriptions
				.filter((s) => s.status === 'active')
				.reduce((sum, s) => sum + s.amount, 0),
		};

		return analytics;
	},
});

// Webhook handler for Stripe events
export const handleStripeWebhook = action({
	args: {
		eventType: v.string(),
		eventData: v.object({
			id: v.string(),
			object: v.any(),
		}),
	},
	handler: async (ctx, args) => {
		switch (args.eventType) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				// Update subscription in database
				break;
			case 'customer.subscription.deleted':
				// Mark subscription as canceled
				break;
			case 'invoice.payment_succeeded':
				// Handle successful payment
				break;
			case 'invoice.payment_failed':
				// Handle failed payment
				break;
		}

		return { success: true };
	},
});
