import { query } from './_generated/server';
import { v } from 'convex/values';

export const getResourcesByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const resources = await ctx.db
			.query('resources')
			.withIndex('projectId', (q) => q.eq('projectId', args.projectId))
			.collect();
		return resources;
	},
});

export const getEquipmentByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const equipment = await ctx.db
			.query('equipment')
			.withIndex('projectId', (q) => q.eq('projectId', args.projectId))
			.collect();
		return equipment;
	},
});

export const getResourceUtilization = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const resources = await ctx.db
			.query('resources')
			.withIndex('projectId', (q) => q.eq('projectId', args.projectId))
			.collect();

		const activeResources = resources.filter((r) => r.status === 'active').length;
		const totalResources = resources.length;

		return totalResources > 0 ? Math.round((activeResources / totalResources) * 100) : 0;
	},
});
