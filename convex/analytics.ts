import { query } from './_generated/server';
import { v } from 'convex/values';

export const getProgressByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const analytics = await ctx.db
			.query('analytics')
			.withIndex('by_project_metric', (q) =>
				q.eq('projectId', args.projectId).eq('metric', 'progress'),
			)
			.order('desc')
			.take(30);

		return analytics;
	},
});

export const getBudgetUtilization = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) return 0;

		return project.spent > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
	},
});

export const getPerformanceMetrics = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const analytics = await ctx.db
			.query('analytics')
			.withIndex('by_project_metric', (q) => q.eq('projectId', args.projectId))
			.collect();

		const metrics = {
			progress: 0,
			efficiency: 0,
			quality: 0,
			safety: 0,
		};

		analytics.forEach((item) => {
			if (item.metric === 'progress') metrics.progress = item.value;
			if (item.metric === 'efficiency') metrics.efficiency = item.value;
			if (item.metric === 'quality') metrics.quality = item.value;
			if (item.metric === 'safety') metrics.safety = item.value;
		});

		return metrics;
	},
});
