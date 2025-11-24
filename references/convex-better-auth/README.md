# Better Auth Integration with Convex

Comprehensive authentication patterns using Better Auth with Convex backend for modern web applications.

## 🔐 Better Auth Overview

Better Auth is a flexible authentication library that integrates seamlessly with Convex, providing:

- **Multiple OAuth providers** (GitHub, Google, Apple, etc.)
- **Magic links and OTP** authentication
- **Password-based auth** with reset flows
- **Custom authentication providers**
- **Session management**
- **Type-safe API**

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install better-auth @better-auth/convex
```

### 2. Configure Convex Auth

```typescript
// convex/auth.ts
import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		Password,
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async afterUserCreatedOrUpdated(ctx, { userId }) {
			// Set default user properties
			const user = await ctx.db.get(userId);
			if (!user?.role) {
				await ctx.db.patch(userId, { role: 'user' });
			}
		},
	},
});
```

### 3. Set up HTTP Routes

```typescript
// convex/http.ts
import { httpRouter } from 'convex/server';
import { auth } from './auth';

const http = httpRouter();
auth.addHttpRoutes(http);

export default http;
```

### 4. Configure Client Provider

```tsx
// components/ConvexClientProvider.tsx
'use client';
import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
	return <ConvexAuthNextjsProvider client={convex}>{children}</ConvexAuthNextjsProvider>;
}
```

### 5. Set up Middleware

```typescript
// middleware.ts
import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isSignInPage = createRouteMatcher(['/signin']);
const isProtectedRoute = createRouteMatcher(['/', '/dashboard']);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	// Redirect authenticated users away from sign-in
	if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, '/');
	}

	// Redirect unauthenticated users to sign-in
	if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, '/signin');
	}
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## 🎯 Authentication Flows

### Sign In Component

```tsx
// app/signin/page.tsx
'use client';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
	const { signIn } = useAuthActions();
	const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	return (
		<div className='mx-auto mt-8 max-w-md'>
			<h1 className='mb-6 text-2xl font-bold'>{flow === 'signIn' ? 'Sign In' : 'Sign Up'}</h1>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					formData.set('flow', flow);

					void signIn('password', formData)
						.catch((error) => {
							setError(error.message);
						})
						.then(() => {
							router.push('/');
						});
				}}
				className='space-y-4'>
				<input
					name='email'
					type='email'
					placeholder='Email'
					required
					className='w-full rounded border p-2'
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					required
					className='w-full rounded border p-2'
				/>

				<button type='submit' className='w-full rounded bg-blue-600 p-2 text-white'>
					{flow === 'signIn' ? 'Sign In' : 'Sign Up'}
				</button>
			</form>

			{/* OAuth Providers */}
			<div className='mt-6 space-y-2'>
				<button
					onClick={() => signIn('github')}
					className='w-full rounded bg-gray-800 p-2 text-white'>
					Continue with GitHub
				</button>
				<button
					onClick={() => signIn('google')}
					className='w-full rounded bg-red-600 p-2 text-white'>
					Continue with Google
				</button>
			</div>

			<button
				onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
				className='mt-4 text-blue-600 underline'>
				{flow === 'signIn'
					? 'Need an account? Sign up'
					: 'Already have an account? Sign in'}
			</button>

			{error && <div className='mt-4 rounded bg-red-100 p-2 text-red-800'>{error}</div>}
		</div>
	);
}
```

### Protected Page Component

```tsx
// app/dashboard/page.tsx
'use client';
import { useConvexAuth } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const { signOut } = useAuthActions();
	const router = useRouter();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		router.push('/signin');
		return null;
	}

	return (
		<div>
			<h1 className='mb-4 text-2xl font-bold'>Dashboard</h1>
			<p>Welcome to your dashboard!</p>

			<button
				onClick={() =>
					void signOut().then(() => {
						router.push('/signin');
					})
				}
				className='mt-4 rounded bg-red-600 px-4 py-2 text-white'>
				Sign Out
			</button>
		</div>
	);
}
```

## 🔑 Advanced Patterns

### Magic Link Authentication

```typescript
// convex/auth.ts
import { ResendOTP } from './resend.otp';

export const { auth, signIn, signOut } = convexAuth({
	providers: [
		ResendOTP({
			apiKey: process.env.RESEND_API_KEY!,
			from: 'auth@yourapp.com',
		}),
	],
});
```

### Custom User Properties

```typescript
// convex/auth.ts
export const { auth, signIn, signOut } = convexAuth({
	providers: [Password],
	callbacks: {
		async afterUserCreatedOrUpdated(ctx, { userId, isNewUser }) {
			if (isNewUser) {
				// Set up new user profile
				await ctx.db.patch(userId, {
					firstName: '',
					lastName: '',
					avatar: null,
					role: 'user',
					preferences: {
						theme: 'light',
						notifications: true,
					},
				});

				// Create user settings
				await ctx.db.insert('userSettings', {
					userId,
					emailNotifications: true,
					marketingEmails: false,
				});
			}
		},
	},
});
```

### Role-Based Access Control

```typescript
// convex/auth.ts
export const { auth, signIn, signOut } = convexAuth({
	providers: [Password],
	callbacks: {
		async afterUserCreatedOrUpdated(ctx, { userId, isNewUser }) {
			if (isNewUser) {
				// Assign default role
				await ctx.db.patch(userId, { role: 'user' });
			}
		},
	},
});

// Usage in queries
export const adminOnlyData = query({
	handler: async (ctx) => {
		const user = await ctx.db.get(ctx.viewer!);
		if (user?.role !== 'admin') {
			throw new Error('Unauthorized');
		}

		return await ctx.db.query('sensitiveData').collect();
	},
});
```

## 🔒 Security Best Practices

### Environment Variables

```bash
# .env.local
# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (for magic links)
RESEND_API_KEY=your_resend_api_key

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
```

### Password Requirements

```typescript
// convex/auth.ts
import { Password } from '@convex-dev/auth/providers/Password';

export const { auth, signIn, signOut } = convexAuth({
	providers: [
		Password({
			validatePassword: (password) => {
				if (password.length < 8) {
					throw new Error('Password must be at least 8 characters');
				}
				if (!/[A-Z]/.test(password)) {
					throw new Error('Password must contain uppercase letter');
				}
				if (!/[a-z]/.test(password)) {
					throw new Error('Password must contain lowercase letter');
				}
				if (!/\d/.test(password)) {
					throw new Error('Password must contain number');
				}
			},
		}),
	],
});
```

### Session Management

```typescript
// middleware.ts - Advanced session handling
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	const isApiRoute = request.nextUrl.pathname.startsWith('/api');

	// Allow API routes to handle their own auth
	if (isApiRoute) {
		return;
	}

	// Check session validity
	const session = await convexAuth.getSession();
	if (session && session.expiresAt < Date.now()) {
		// Session expired, redirect to sign in
		return nextjsMiddlewareRedirect(request, '/signin?expired=true');
	}

	// Continue with normal flow...
});
```

## 🧪 Testing Authentication

### Unit Tests

```typescript
// __tests__/auth.test.ts
import { convexTest } from 'convex-test';
import { api } from '../convex/_generated/api';

const t = convexTest(api);

test('user can sign up', async () => {
	const userId = await t.run(async (ctx) => {
		return await ctx.db.insert('users', {
			email: 'test@example.com',
			name: 'Test User',
		});
	});

	expect(userId).toBeDefined();
});
```

### Integration Tests

```typescript
// __tests__/signin.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../app/signin/page";
import { ConvexProviderWithAuth } from "convex/react";

test("user can sign in", async () => {
  render(
    <ConvexProviderWithAuth client={convex}>
      <SignIn />
    </ConvexProviderWithAuth>
  );

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByText("Sign In"));

  await waitFor(() => {
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
```

## 🚀 Production Deployment

### Environment Setup

```bash
# Production environment variables
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
CONVEX_DEPLOYMENT=prod-deployment-name

# OAuth redirect URLs must match production domain
GITHUB_REDIRECT_URI=https://yourapp.com/api/auth/callback/github
GOOGLE_REDIRECT_URI=https://yourapp.com/api/auth/callback/google
```

### Monitoring

```typescript
// convex/auth.ts - Add logging
export const { auth, signIn, signOut } = convexAuth({
	providers: [Password],
	callbacks: {
		async afterUserCreatedOrUpdated(ctx, { userId, isNewUser }) {
			console.log(`User ${isNewUser ? 'created' : 'updated'}: ${userId}`);

			// Log to external service
			await logToExternalService({
				event: 'user_auth',
				userId,
				isNewUser,
				timestamp: Date.now(),
			});
		},
	},
});
```

## 📚 Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Convex Auth Integration](https://labs.convex.dev/auth)
- [OAuth Setup Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

## 🎯 Best Practices

1. **Use HTTPS** in production
2. **Validate all inputs** server-side
3. **Implement rate limiting** for auth endpoints
4. **Use strong passwords** and validation
5. **Monitor authentication events**
6. **Handle session expiration** gracefully
7. **Test authentication flows** thoroughly
8. **Keep dependencies updated** for security patches
