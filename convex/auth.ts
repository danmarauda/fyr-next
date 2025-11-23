import { convexAuth } from '@convex-dev/better-auth';
import { auth } from '../packages/auth/src/lib/auth';

export const {
	auth: convexAuthMiddleware,
	signIn,
	signOut,
} = convexAuth({
	auth,
});
