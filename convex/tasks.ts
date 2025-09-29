import { query } from './_generated/server';
import { v } from 'convex/values';

export const getTasksByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return tasks;
	},
});

export const getTasksByStatus = query({
	args: { status: v.string() },
	handler: async (ctx, args) => {
		const tasks = await ctx.db
			.query('tasks')
			.filter((q) => q.eq(q.field('status'), args.status))
			.collect();
		return tasks;
	},
});

export const getOverdueTasks = query({
	handler: async (ctx) => {
		const now = Date.now();
		const tasks = await ctx.db
			.query('tasks')
			.filter((q) => q.and(q.eq(q.field('status'), 'pending'), q.lt(q.field('dueDate'), now)))
			.collect();
		return tasks;
	},
});
