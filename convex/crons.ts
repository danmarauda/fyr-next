import { cronJobs } from 'convex/server';
import { components, internal } from './_generated/api';
import { internalMutation } from './_generated/server';

const crons = cronJobs();

// Clean up old emails from the Resend component every hour
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const FOUR_WEEKS_MS = 4 * ONE_WEEK_MS;

crons.interval(
	'Remove old emails from resend component',
	{ hours: 1 },
	internal.crons.cleanupResend,
);

/**
 * Cleanup old finalized emails from the Resend component
 * - Removes delivered/bounced/cancelled emails older than 7 days
 * - Removes abandoned emails older than 4 weeks (indicates bugs)
 */
export const cleanupResend = internalMutation({
	args: {},
	handler: async (ctx) => {
		// Clean up old finalized emails (delivered, bounced, cancelled)
		await ctx.scheduler.runAfter(0, components.resend.lib.cleanupOldEmails, {
			olderThan: ONE_WEEK_MS,
		});

		// Clean up abandoned emails (stuck in processing - indicates bugs)
		await ctx.scheduler.runAfter(0, components.resend.lib.cleanupAbandonedEmails, {
			olderThan: FOUR_WEEKS_MS,
		});

		console.log('Scheduled email cleanup tasks');
	},
});

/**
 * Clean up old email events from our tracking table
 * Keeps events for 30 days for debugging purposes
 */
crons.interval(
	'Clean up old email events',
	{ hours: 24 },
	internal.crons.cleanupEmailEvents,
);

export const cleanupEmailEvents = internalMutation({
	args: {},
	handler: async (ctx) => {
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

		const oldEvents = await ctx.db
			.query('emailEvents')
			.withIndex('by_timestamp', (q) => q.lt('timestamp', thirtyDaysAgo))
			.collect();

		for (const event of oldEvents) {
			await ctx.db.delete(event._id);
		}

		if (oldEvents.length > 0) {
			console.log(`Cleaned up ${oldEvents.length} old email events`);
		}
	},
});

export default crons;
