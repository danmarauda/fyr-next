import { action, mutation } from './_generated/server';

// Create admin user mutation - directly uses db
export const createDevAdminMutation = mutation({
	handler: async (ctx) => {
		const adminEmail = 'admin@alias.com.ai';

		// Check if admin user already exists
		const existingUser = await ctx.db
			.query('user')
			.filter((q) => q.eq(q.field('email'), adminEmail))
			.first();

		if (existingUser) {
			return {
				success: true,
				message: 'Admin user already exists',
				userId: existingUser._id,
			};
		}

		// Create admin user
		const now = Date.now();
		const userId = await ctx.db.insert('user', {
			email: adminEmail,
			name: 'Admin User',
			role: 'admin',
			emailVerified: true,
			createdAt: now,
			updatedAt: now,
			lastLoginAt: now,
			loginCount: 0,
		});

		return { success: true, message: 'Admin user created successfully', userId };
	},
});

// Create admin user for development (action wrapper that calls the mutation)
export const createDevAdmin = action({
	handler: async (ctx) => {
		// Only allow in development
		if (process.env.NODE_ENV !== 'development') {
			return {
				success: false,
				message: 'Dev admin creation only available in development mode',
			};
		}

		try {
			// For now, return a placeholder since we can't easily call mutations from actions
			// The mutation can be called directly from the client instead
			return {
				success: true,
				message: 'Use createDevAdminMutation directly from the client',
			};
		} catch (error: any) {
			console.error('Failed to create admin user:', error);
			return { success: false, message: 'Failed to create admin user', error: error.message };
		}
	},
});
