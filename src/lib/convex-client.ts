// Mock Convex client for testing without Convex backend
// This provides a no-op implementation that matches the Convex API

export const convexClient = {
	// Query method (mock)
	query: function (functionName: string, args?: unknown) {
		console.log('[MOCK CONVEX] Query:', { functionName, args });
		return Promise.resolve(null);
	},

	// Mutation method (mock)
	mutation: function (functionName: string, args?: unknown) {
		console.log('[MOCK CONVEX] Mutation:', { functionName, args });
		return Promise.resolve(null);
	},

	// Subscription method (mock)
	subscribe: function (functionName: string, args?: unknown) {
		console.log('[MOCK CONVEX] Subscribe:', { functionName, args });
		return {
			unsubscribe: () => console.log('[MOCK CONVEX] Unsubscribed'),
		};
	},
};

// Export a class-based mock for compatibility with ConvexReactClient
export class ConvexReactClient {
	constructor(url?: string) {
		console.log('[MOCK CONVEX] ConvexReactClient initialized', url);
	}

	query = convexClient.query;
	mutation = convexClient.mutation;
	subscribe = convexClient.subscribe;
}

// Export a singleton instance
export const convexClientInstance = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL || 'mock-url',
);
