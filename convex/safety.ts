import { query } from './_generated/server';
import { v } from 'convex/values';

export const getIncidentsByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const incidents = await ctx.db
			.query('safetyIncidents')
			.withIndex('projectId', (q) => q.eq('projectId', args.projectId))
			.collect();
		return incidents;
	},
});

export const getIncidentStats = query({
	handler: async (ctx) => {
		const incidents = await ctx.db.query('safetyIncidents').collect();

		const total = incidents.length;
		const resolved = incidents.filter((i) => i.resolved).length;
		const pending = total - resolved;

		const bySeverity = {
			low: incidents.filter((i) => i.severity === 'low').length,
			medium: incidents.filter((i) => i.severity === 'medium').length,
			high: incidents.filter((i) => i.severity === 'high').length,
			critical: incidents.filter((i) => i.severity === 'critical').length,
		};

		return {
			total,
			resolved,
			pending,
			bySeverity,
		};
	},
});
