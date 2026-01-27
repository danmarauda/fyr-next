import { api } from '../../../convex/_generated/api';
import { convexBetterAuth } from 'better-convex/auth-nextjs';

export const { createContext, createCaller, handler } = convexBetterAuth({
	api,
	convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
	meta: {},
});
