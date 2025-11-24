# Convex Admin Templates

Production-ready admin dashboard implementations using Convex backend with modern React/Next.js stacks.

## 📊 Featured Templates

### get-convex/convex-saas

**Complete SaaS starter with billing integration**

**Features:**

- Stripe subscription management
- User onboarding flow
- Admin dashboard with analytics
- Multi-tenant architecture
- Email notifications

**Tech Stack:**

- Next.js 14 + TypeScript
- Convex backend
- Stripe for payments
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod

**Key Patterns:**

```typescript
// Subscription management
const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
const { mutateAsync: createCheckout } = useMutation({
	mutationFn: useConvexAction(api.stripe.createSubscriptionCheckout),
});

// Real-time user stats
const { data: stats } = useQuery(convexQuery(api.app.getUserStats, {}));
```

### get-convex/ents-saas-starter

**Enterprise SaaS with teams and permissions**

**Features:**

- Team management system
- Role-based permissions
- Member invitations
- Real-time collaboration
- Audit logging

**Architecture:**

- Ents schema for complex relationships
- Permission-based queries
- Soft deletion for data integrity
- Paginated data loading

**Permission Pattern:**

```typescript
export const list = query({
	args: { teamId: v.id('teams') },
	handler: async (ctx, { teamId }) => {
		if (!(await viewerHasPermission(ctx, teamId, 'Read Members'))) {
			return emptyPage();
		}
		return await ctx.table('teams').getX(teamId).edge('members').collect();
	},
});
```

### acelords/nextjs-starter-kit-convex

**Feature-rich admin with analytics dashboard**

**Features:**

- Comprehensive dashboard
- User management
- Subscription tiers
- Analytics and reporting
- Mobile-responsive design

**Dashboard Components:**

```tsx
// Stats cards with real-time updates
function DashboardStats() {
	const stats = useQuery(api.analytics.getStats);
	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
			{stats?.map((stat) => (
				<Card key={stat.id}>
					<CardContent>
						<div className='text-2xl font-bold'>{stat.value}</div>
						<p className='text-muted-foreground'>{stat.label}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
```

## 🏗️ Layout Patterns

### Sticky Header Navigation

```tsx
function DashboardLayout({ children }) {
	return (
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
	);
}
```

### Sidebar Navigation

```tsx
const navItems = [
	{ label: 'Overview', href: '/dashboard', icon: HomeIcon },
	{ label: 'Users', href: '/dashboard/users', icon: UsersIcon },
	{ label: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];

function Sidebar() {
	const pathname = usePathname();
	return (
		<aside className='w-64 border-r'>
			{navItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={clsx(
						'flex items-center gap-3 px-4 py-2',
						pathname === item.href && 'bg-accent',
					)}>
					<item.icon />
					{item.label}
				</Link>
			))}
		</aside>
	);
}
```

## 🔐 Authentication Integration

### Protected Routes

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

### User Context

```tsx
function UserProvider({ children }) {
	const { data: user } = useQuery(convexQuery(api.users.current));
	const { data: subscription } = useQuery(
		convexQuery(api.subscriptions.get, { userId: user?._id }),
	);

	return <UserContext.Provider value={{ user, subscription }}>{children}</UserContext.Provider>;
}
```

## 💳 Subscription Management

### Stripe Integration

```typescript
// convex/stripe.ts
export const createSubscriptionCheckout = action({
	args: {
		userId: v.id('users'),
		planId: v.string(),
		currency: v.string(),
	},
	handler: async (ctx, { userId, planId, currency }) => {
		const user = await ctx.runQuery(api.users.get, { id: userId });

		const session = await stripe.checkout.sessions.create({
			customer_email: user.email,
			line_items: [{ price: planId, quantity: 1 }],
			mode: 'subscription',
			success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
			cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
		});

		return session.url;
	},
});
```

### Subscription Guards

```tsx
function SubscriptionGuard({ children, requiredPlan }) {
	const { data: subscription } = useQuery(api.subscriptions.current);

	if (!subscription || subscription.plan !== requiredPlan) {
		return <UpgradePrompt />;
	}

	return <>{children}</>;
}
```

## 📈 Analytics & Reporting

### Real-time Metrics

```typescript
// convex/analytics.ts
export const getDashboardMetrics = query({
	handler: async (ctx) => {
		const [totalUsers, activeUsers, totalRevenue, monthlyRevenue] = await Promise.all([
			ctx.db
				.query('users')
				.collect()
				.then((users) => users.length),
			ctx.db
				.query('users')
				.filter((q) => q.eq(q.field('lastActive'), 'today'))
				.collect(),
			ctx.db.query('subscriptions').collect().then(/* calculate revenue */),
			ctx.db.query('subscriptions').filter(/* this month */).collect(),
		]);

		return {
			totalUsers,
			activeUsers: activeUsers.length,
			totalRevenue,
			monthlyRevenue,
			growth: calculateGrowth(totalUsers, activeUsers.length),
		};
	},
});
```

### Charts Integration

```tsx
function RevenueChart() {
	const { data: revenue } = useQuery(api.analytics.monthlyRevenue);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Revenue Trends</CardTitle>
			</CardHeader>
			<CardContent>
				<LineChart data={revenue}>
					<Line type='monotone' dataKey='amount' stroke='#8884d8' />
				</LineChart>
			</CardContent>
		</Card>
	);
}
```

## 🎯 Best Practices

### Performance Optimization

1. **Use pagination** for large datasets
2. **Implement optimistic updates** for mutations
3. **Cache frequently accessed data**
4. **Use proper loading states**

### Security

1. **Validate permissions** on all operations
2. **Use soft deletion** for data integrity
3. **Implement audit logging** for sensitive operations
4. **Rate limit API calls**

### User Experience

1. **Show loading states** during data fetching
2. **Provide feedback** for all user actions
3. **Handle errors gracefully**
4. **Implement progressive enhancement**

## 🚀 Getting Started

```bash
# Clone a template
npx degit get-convex/convex-saas my-admin-app
cd my-admin-app

# Install dependencies
npm install

# Set up Convex
npx convex dev

# Configure environment
cp .env.example .env.local
# Add your Convex URL and other secrets

# Start development
npm run dev
```

## 📚 Related Resources

- [Convex SaaS Template Docs](https://github.com/get-convex/convex-saas)
- [Ents SaaS Starter](https://github.com/get-convex/ents-saas-starter)
- [Next.js Starter Kit](https://github.com/acelords/nextjs-starter-kit-convex)
