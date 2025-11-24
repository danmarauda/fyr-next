import { query } from './_generated/server';
import { v } from 'convex/values';

export const getProject = query({
	args: { id: v.string() },
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.id as any);
		return project;
	},
});

export const getProjects = query({
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		return projects;
	},
});

export const getProjectsByStatus = query({
	args: { status: v.string() },
	handler: async (ctx, args) => {
		const projects = await ctx.db
			.query('projects')
			.withIndex('by_status', (q) => q.eq('status', args.status))
			.collect();
		return projects;
	},
});

export const getProjectProgress = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();

		const completedTasks = tasks.filter((task) => task.status === 'completed').length;
		const totalTasks = tasks.length;

		return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	},
});

// Get projects for the current user
export const getUserProjects = query({
	args: { userId: v.id('user') },
	handler: async (ctx, args) => {
		const projects = await ctx.db
			.query('projects')
			.filter((q) => q.eq(q.field('managerId'), args.userId))
			.collect();
		return projects;
	},
});
