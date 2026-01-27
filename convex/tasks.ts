import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getTasksByProject = query({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const tasks = await ctx.db
			.query('tasks')
			.withIndex('projectId', (q) => q.eq('projectId', args.projectId))
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

// Mutations for optimistic UI updates
export const createTask = mutation({
	args: {
		projectId: v.id('projects'),
		title: v.string(),
		description: v.string(),
		status: v.string(),
		priority: v.string(),
		dueDate: v.optional(v.number()),
		assigneeId: v.optional(v.id('user')),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		const taskId = await ctx.db.insert('tasks', {
			...args,
			tags: args.tags || [],
			dependencies: [],
			createdAt: now,
			updatedAt: now,
		});
		return taskId;
	},
});

export const updateTask = mutation({
	args: {
		id: v.id('tasks'),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		status: v.optional(v.string()),
		priority: v.optional(v.string()),
		dueDate: v.optional(v.number()),
		assigneeId: v.optional(v.id('user')),
		tags: v.optional(v.array(v.string())),
		completedAt: v.optional(v.number()),
		actualHours: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now(),
		});
		return id;
	},
});

export const updateTaskStatus = mutation({
	args: {
		id: v.id('tasks'),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const now = Date.now();
		const updateData: { status: string; updatedAt: number; completedAt?: number } = {
			status: args.status,
			updatedAt: now,
		};

		// If marking as completed, set completedAt
		if (args.status === 'completed') {
			updateData.completedAt = now;
		}

		await ctx.db.patch(args.id, updateData);
		return args.id;
	},
});

export const deleteTask = mutation({
	args: { id: v.id('tasks') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return args.id;
	},
});
