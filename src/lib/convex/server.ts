import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs';

const convexUrl =
	process.env.NEXT_PUBLIC_CONVEX_URL || 'https://resilient-dinosaur-332.convex.cloud';
const convexSiteUrl =
	process.env.NEXT_PUBLIC_CONVEX_SITE_URL || 'https://resilient-dinosaur-332.convex.site';

export const {
	handler,
	getToken,
	isAuthenticated,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
	preloadAuthQuery,
} = convexBetterAuthNextJs({
	convexUrl,
	convexSiteUrl,
});
