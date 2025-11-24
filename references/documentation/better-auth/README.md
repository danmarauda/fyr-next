# Better Auth Documentation

## Overview

Better Auth is a framework-agnostic authentication library that provides comprehensive auth features with excellent Next.js and Convex integration.

## Key Features for Admin Templates

### Comprehensive Auth Features

- **Multi-provider OAuth** (GitHub, Google, Discord, etc.)
- **Email/Password authentication**
- **Session management**
- **Role-based access control**
- **Multi-factor authentication**
- **Password reset flows**
- **Email verification**
- **Account linking**

### Framework Integration

- **Next.js App Router** - Server Actions, middleware
- **Convex** - Real-time auth state, database integration
- **TypeScript** - Full type safety
- **Edge Runtime** - Deploy anywhere

## Quick Start with Next.js + Convex

### Installation

```bash
npm install better-auth @better-auth/convex
```

### Configuration

```ts
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { convexAdapter } from 'better-auth/adapters/convex';

export const auth = betterAuth({
	database: convexAdapter(),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	baseURL: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET,
});
```

### Convex Schema

```ts
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@better-auth/convex';

const auth = authTables();

export default defineSchema({
	...auth,
	// Your other tables
	users: defineTable({
		email: v.string(),
		name: v.string(),
		role: v.string(), // admin, user, etc.
	}),
});
```

### API Route Handler

```ts
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	return auth.handler(request);
}

export async function POST(request: NextRequest) {
	return auth.handler(request);
}
```

### Client Usage

```tsx
'use client';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Sign in with GitHub
await authClient.signIn.social({
	provider: 'github',
});

// Sign in with email
await authClient.signIn.email({
	email: 'user@example.com',
	password: 'password',
});
```

## Advanced Features

### Role-Based Access Control

```ts
// lib/auth.ts
export const auth = betterAuth({
	// ... other config
	user: {
		roles: ['admin', 'user', 'moderator'],
		defaultRole: 'user',
	},
	access: {
		adminOnly: ({ user }) => user.role === 'admin',
		moderatorOrAdmin: ({ user }) => user.role === 'admin' || user.role === 'moderator',
	},
});
```

### Multi-Factor Authentication

```ts
export const auth = betterAuth({
	// ... other config
	mfa: {
		enabled: true,
		totp: true, // Time-based OTP
		sms: true, // SMS codes
	},
});
```

### Custom Fields and Validation

```ts
export const auth = betterAuth({
	// ... other config
	user: {
		fields: {
			company: {
				type: 'string',
				required: false,
			},
			department: {
				type: 'string',
				required: false,
				validate: (value) => {
					const validDepartments = ['engineering', 'sales', 'marketing'];
					return validDepartments.includes(value);
				},
			},
		},
	},
});
```

## Integration with Admin Templates

### Protected Routes with Middleware

```ts
// middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
	const isAuth = !!req.auth;
	const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
	const isApiRoute = req.nextUrl.pathname.startsWith('/api');

	if (isApiRoute) return; // Let API routes handle auth

	if (isAuthPage) {
		if (isAuth) {
			return Response.redirect(new URL('/dashboard', req.url));
		}
		return; // Allow access to auth pages
	}

	if (!isAuth) {
		return Response.redirect(new URL('/auth/login', req.url));
	}

	// Role-based redirects
	if (req.auth.user.role === 'admin' && req.nextUrl.pathname === '/dashboard') {
		return Response.redirect(new URL('/admin', req.url));
	}
});
```

### Server Component Auth Check

```tsx
// app/admin/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
	const session = await auth();

	if (!session || session.user.role !== 'admin') {
		redirect('/unauthorized');
	}

	return <AdminDashboard />;
}
```

### Client-Side Auth State

```tsx
'use client';
import { useSession } from 'better-auth/react';

export function UserMenu() {
	const { data: session, isPending } = useSession();

	if (isPending) return <div>Loading...</div>;

	if (!session) {
		return <LoginButton />;
	}

	return (
		<div>
			<span>Welcome, {session.user.name}</span>
			<button onClick={() => authClient.signOut()}>Sign Out</button>
		</div>
	);
}
```

## Database Integration Patterns

### Convex Queries with Auth

```ts
// convex/users.ts
import { query } from './_generated/server';
import { auth } from './auth';

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx);
		if (!userId) return null;

		return await ctx.db.get(userId);
	},
});

export const getUsers = query({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx);
		const user = await ctx.db.get(userId);

		// Only admins can see all users
		if (user?.role !== 'admin') {
			throw new Error('Unauthorized');
		}

		return await ctx.db.query('users').collect();
	},
});
```

### Real-time Subscriptions

```tsx
'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function UserList() {
	const users = useQuery(api.users.getUsers);

	return (
		<div>
			{users?.map((user) => (
				<div key={user._id}>
					{user.name} - {user.email}
				</div>
			))}
		</div>
	);
}
```

## UI Components for Auth

### Login Form

```tsx
'use client';
import { authClient } from '@/lib/auth-client';

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailLogin = async (formData: FormData) => {
		setIsLoading(true);
		try {
			await authClient.signIn.email({
				email: formData.get('email'),
				password: formData.get('password'),
			});
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialLogin = async (provider: string) => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({
				provider: provider as any,
			});
		} catch (error) {
			console.error('Social login failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='login-form'>
			<form action={handleEmailLogin}>
				<input name='email' type='email' placeholder='Email' required />
				<input name='password' type='password' placeholder='Password' required />
				<button type='submit' disabled={isLoading}>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>

			<div className='social-login'>
				<button onClick={() => handleSocialLogin('github')}>Sign in with GitHub</button>
				<button onClick={() => handleSocialLogin('google')}>Sign in with Google</button>
			</div>
		</div>
	);
}
```

### Auth Guard Component

```tsx
'use client';
import { useSession } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({
	children,
	requiredRole,
}: {
	children: React.ReactNode;
	requiredRole?: string;
}) {
	const { data: session, isPending } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !session) {
			router.push('/auth/login');
			return;
		}

		if (!isPending && requiredRole && session?.user.role !== requiredRole) {
			router.push('/unauthorized');
			return;
		}
	}, [session, isPending, requiredRole, router]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (!session) {
		return null;
	}

	if (requiredRole && session.user.role !== requiredRole) {
		return null;
	}

	return <>{children}</>;
}
```

## Security Best Practices

### Environment Variables

```env
# .env.local
BETTER_AUTH_SECRET=your-super-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### CSRF Protection

Better Auth automatically handles CSRF protection for all requests.

### Session Security

- **HttpOnly cookies** for session tokens
- **Secure cookies** in production
- **Automatic session rotation**
- **Configurable session duration**

### Password Policies

```ts
export const auth = betterAuth({
	// ... other config
	password: {
		minLength: 8,
		requireNumbers: true,
		requireSymbols: true,
		requireUppercase: true,
	},
});
```

## Common Patterns for Admin Templates

### Admin Role Management

```ts
// Server Action for role updates
'use server';
export async function updateUserRole(userId: string, newRole: string) {
	const session = await auth();

	if (session?.user.role !== 'admin') {
		throw new Error('Unauthorized');
	}

	// Update user role in database
	await db.user.update(userId, { role: newRole });

	revalidatePath('/admin/users');
}
```

### Audit Logging

```ts
export const auth = betterAuth({
	// ... other config
	hooks: {
		after: {
			signIn: async ({ user }) => {
				await logActivity({
					action: 'sign_in',
					userId: user.id,
					timestamp: new Date(),
				});
			},
			signUp: async ({ user }) => {
				await logActivity({
					action: 'sign_up',
					userId: user.id,
					timestamp: new Date(),
				});
			},
		},
	},
});
```

Better Auth provides a solid foundation for authentication in admin templates, with excellent integration with Next.js and Convex, comprehensive security features, and a developer-friendly API.
