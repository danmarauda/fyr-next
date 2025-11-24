# Convex Reference Collection

A comprehensive collection of production-ready Convex patterns and implementations, focusing on authentication, real-time data, admin dashboards, monorepo architectures, and role-based permissions.

## 📚 Indexed Repositories

### Admin Templates & SaaS Starters

- **[get-convex/convex-saas](https://github.com/get-convex/convex-saas)** - Complete SaaS starter with Stripe billing, user management, and admin dashboard
- **[get-convex/ents-saas-starter](https://github.com/get-convex/ents-saas-starter)** - Enterprise SaaS starter with teams, roles, and permissions
- **[acelords/nextjs-starter-kit-convex](https://github.com/acelords/nextjs-starter-kit-convex)** - Feature-rich starter with dashboard, subscriptions, and analytics
- **[vukrosic/nextjs-convex-shadcn-template](https://github.com/vukrosic/nextjs-convex-shadcn-template)** - Modern template with shadcn/ui components

### Authentication Templates

- **[get-convex/template-nextjs-convexauth](https://github.com/get-convex/template-nextjs-convexauth)** - Convex Auth implementation with password/email authentication
- **[get-convex/template-nextjs-clerk-shadcn](https://github.com/get-convex/template-nextjs-clerk-shadcn)** - Clerk integration with shadcn/ui
- **[get-convex/template-nextjs-shadcn](https://github.com/get-convex/template-nextjs-shadcn)** - Basic shadcn/ui template with Convex
- **[kivilaid/convex-next-clerk-template](https://github.com/kivilaid/convex-next-clerk-template)** - Clerk authentication template
- **[get-convex/convex-auth-with-role-based-permissions](https://github.com/get-convex/convex-auth-with-role-based-permissions)** - Role-based permissions with Convex Auth

### Monorepo Architectures

- **[syntaxlexx/turbo-expo-tanstack-convex-monorepo](https://github.com/syntaxlexx/turbo-expo-tanstack-convex-monorepo)** - Turbo monorepo with Expo, TanStack, and Convex
- **[get-convex/turbo-expo-nextjs-clerk-convex-monorepo](https://github.com/get-convex/turbo-expo-nextjs-clerk-convex-monorepo)** - Cross-platform monorepo with Next.js, Expo, and Clerk
- **[vintuvishAl/convex-react-keycloak-monorepo](https://github.com/vintuvishAl/convex-react-keycloak-monorepo)** - Keycloak authentication in monorepo setup

## 🔐 Authentication Patterns

### Better Auth Integration

Better Auth provides flexible authentication with Convex adapter support. Key features:

- Multiple OAuth providers (GitHub, Google, Apple)
- Magic links and OTP authentication
- Password-based authentication with reset flows
- Custom authentication providers

**Setup Example:**

```typescript
// convex/auth.ts
import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import GitHub from '@auth/core/providers/github';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [Password, GitHub],
});
```

### Convex Auth (Native)

Convex's built-in authentication system with comprehensive features:

- Email/password authentication
- OAuth providers (GitHub, Google, Apple)
- Magic links and OTP
- Session management
- Middleware protection

**Key Benefits:**

- No additional authentication service needed
- Works with SPAs hosted on CDNs
- Native Convex integration
- Type-safe authentication flows

## ⚡ Real-Time Data Patterns

### Basic Subscriptions

```typescript
// convex/messages.ts
export const list = query({
	args: { teamId: v.id('teams') },
	handler: async (ctx, { teamId }) => {
		return await ctx.db
			.query('messages')
			.withIndex('teamId', (q) => q.eq('teamId', teamId))
			.order('desc')
			.collect();
	},
});

// Component
function MessageList({ teamId }) {
	const messages = useQuery(api.messages.list, { teamId });
	// Automatically updates in real-time
}
```

### Paginated Real-Time Data

```typescript
export const list = query({
	args: {
		teamId: v.id('teams'),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, { teamId, paginationOpts }) => {
		return await ctx
			.table('teams')
			.getX(teamId)
			.edge('messages')
			.order('desc')
			.paginate(paginationOpts);
	},
});

// Component with pagination
function MessageBoard() {
	const { results, status, loadMore } = usePaginatedQuery(
		api.messages.list,
		{ teamId },
		{ initialNumItems: 20 },
	);
}
```

### Optimistic Updates

```typescript
function MessageForm({ teamId }) {
	const sendMessage = useMutation(api.messages.create);
	const [optimisticMessages, setOptimisticMessages] = useState([]);

	const handleSend = async (text: string) => {
		const tempId = crypto.randomUUID();
		setOptimisticMessages((prev) => [
			...prev,
			{
				_id: tempId,
				text,
				_creationTime: Date.now(),
			},
		]);

		try {
			await sendMessage({ teamId, text });
			setOptimisticMessages((prev) => prev.filter((m) => m._id !== tempId));
		} catch (error) {
			setOptimisticMessages((prev) => prev.filter((m) => m._id !== tempId));
		}
	};
}
```

## 🏗️ Admin Dashboard Patterns

### Layout Structure

```tsx
// Sticky header with navigation
<StickyHeader
	left={<TeamSwitcher />}
	center={<TeamMenu />}
	right={
		<>
			<Notifications />
			<ProfileButton />
		</>
	}>
	<AcceptInviteDialog />
	{children}
</StickyHeader>
```

### Protected Routes with Middleware

```typescript
// middleware.ts
import { convexAuthNextjsMiddleware } from '@convex-dev/auth/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
	if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
		return nextjsMiddlewareRedirect(request, '/signin');
	}
});
```

### Subscription Management

```typescript
// Stripe integration
const { mutateAsync: createSubscriptionCheckout } = useMutation({
	mutationFn: useConvexAction(api.stripe.createSubscriptionCheckout),
});

const handleCreateSubscriptionCheckout = async () => {
	const checkoutUrl = await createSubscriptionCheckout({
		userId: user._id,
		planId: selectedPlanId,
	});
	window.location.href = checkoutUrl;
};
```

## 🏢 Monorepo Architectures

### Centralized Backend Package

```
monorepo/
├── apps/
│   ├── web/          # Next.js application
│   └── native/       # Expo application
└── packages/
    └── backend/      # Shared Convex backend
        └── convex/
            ├── auth.ts
            ├── schema.ts
            └── _generated/
```

### Platform-Specific Providers

```typescript
// apps/web/src/ConvexClientProvider.tsx
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Web provider
<ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
  <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    {children}
  </ConvexProviderWithClerk>
</ClerkProvider>
```

```typescript
// apps/native/ConvexClientProvider.tsx
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

// Native provider
<ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
  <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    {children}
  </ConvexProviderWithClerk>
</ClerkProvider>
```

### Deployment Strategy

```bash
# Deploy backend first, then frontend
cd packages/backend && \
npx convex deploy --cmd 'cd ../../apps/web && turbo run build' \
--cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL
```

## 🔒 Role-Based Permissions

### Schema Design

```typescript
// convex/schema.ts
const schema = defineEntSchema({
	roles: defineEnt({
		isDefault: v.boolean(),
	})
		.field('name', vRole, { unique: true })
		.edges('permissions')
		.edges('members', { ref: true }),

	permissions: defineEnt({}).field('name', vPermission, { unique: true }).edges('roles'),

	members: defineEnt({})
		.edge('team')
		.edge('user')
		.edge('role')
		.index('teamUser', ['teamId', 'userId']),
});
```

### Permission Checking

```typescript
// convex/permissions.ts
export async function viewerHasPermission(
	ctx: QueryCtx,
	teamId: Id<'teams'>,
	name: Permission,
): Promise<boolean> {
	const member = await ctx
		.table('members', 'teamUser', (q) => q.eq('teamId', teamId).eq('userId', ctx.viewerX()._id))
		.unique();

	if (member === null) return false;

	return await member
		.edge('role')
		.edge('permissions')
		.has(await getPermission(ctx, name));
}
```

### Protecting Queries and Mutations

```typescript
// Protected query
export const list = query({
	args: { teamId: v.id('teams') },
	handler: async (ctx, { teamId }) => {
		if (!(await viewerHasPermission(ctx, teamId, 'Read Members'))) {
			return { page: [], isDone: true, continueCursor: '' };
		}
		// Return data...
	},
});

// Protected mutation
export const update = mutation({
	args: { memberId: v.id('members'), roleId: v.id('roles') },
	handler: async (ctx, { memberId, roleId }) => {
		const member = await ctx.table('members').getX(memberId);
		await viewerHasPermissionX(ctx, member.teamId, 'Manage Members');
		// Update logic...
	},
});
```

## 🚀 Quick Start Examples

### 1. Basic Authentication Setup

```bash
npx create-convex@latest my-app
cd my-app
npx @convex-dev/auth
```

### 2. SaaS Template

```bash
npx degit get-convex/convex-saas my-saas-app
cd my-saas-app
npm install
```

### 3. Monorepo Setup

```bash
npx degit syntaxlexx/turbo-expo-tanstack-convex-monorepo my-monorepo
cd my-monorepo
pnpm install
```

## 📖 Documentation Links

- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Better Auth Convex Adapter](https://www.better-auth-kit.com/docs/adapters/convex)
- [Convex Database Guide](https://docs.convex.dev/database/schemas)
- [Convex React Client](https://docs.convex.dev/client/react)

## 🎯 Best Practices

1. **Use Type-Safe APIs**: Leverage Convex's generated types for full type safety
2. **Implement Optimistic Updates**: Provide immediate UI feedback for better UX
3. **Handle Loading States**: Always account for loading and error states
4. **Use Pagination**: Implement `usePaginatedQuery` for large datasets
5. **Check Permissions Early**: Validate permissions before business logic
6. **Environment Separation**: Maintain separate env files per application
7. **Real-time First**: Design with real-time updates as the default
8. **Secure by Default**: Implement proper authentication and authorization

## 🤝 Contributing

This collection is maintained to provide production-ready patterns for Convex development. Each pattern includes:

- Working code examples
- Best practices
- Security considerations
- Performance optimizations

For questions or contributions, please refer to the individual repository documentation or create an issue in the relevant repository.
