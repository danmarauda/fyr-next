// Mock auth types for testing without Convex/better-auth

export interface Session {
	user: {
		id: string;
		email: string;
		name?: string;
		username?: string;
		role?: string;
		image?: string | null;
		emailVerified?: boolean;
		createdAt?: string;
	};
}

export type Auth = {
	session: Session | null;
};
