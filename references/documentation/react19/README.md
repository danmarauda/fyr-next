# React 19 Patterns for Next.js Admin Templates

## Overview

React 19 introduces several new features that are particularly valuable for admin dashboard applications. These features improve performance, developer experience, and user experience.

## Key New Features

### 1. Actions and useActionState

**Purpose**: Simplify form handling with automatic pending states, error handling, and optimistic updates.

**Admin Template Use Case**: Perfect for CRUD operations, user management, settings forms.

```tsx
'use client';
import { useActionState } from 'react';
import { createUser } from '@/app/actions';

export function CreateUserForm() {
	const [state, formAction, isPending] = useActionState(createUser, null);

	return (
		<form action={formAction}>
			<input name='name' required />
			<input name='email' type='email' required />
			<button type='submit' disabled={isPending}>
				{isPending ? 'Creating...' : 'Create User'}
			</button>
			{state?.error && <p className='error'>{state.error}</p>}
		</form>
	);
}
```

**Server Action**:

```tsx
// app/actions.ts
'use server';

export async function createUser(prevState: any, formData: FormData) {
	try {
		const name = formData.get('name');
		const email = formData.get('email');

		// Validation
		if (!name || !email) {
			return { error: 'Name and email are required' };
		}

		// Database operation
		await db.user.create({ name, email });

		// Revalidate cache
		revalidatePath('/users');

		return { success: true };
	} catch (error) {
		return { error: 'Failed to create user' };
	}
}
```

### 2. useOptimistic Hook

**Purpose**: Provide immediate UI feedback for mutations before server response.

**Admin Template Use Case**: Instant feedback for actions like toggling user status, updating settings.

```tsx
'use client';
import { useOptimistic, useTransition } from 'react';

export function UserList({ users }) {
	return (
		<div>
			{users.map((user) => (
				<UserItem key={user.id} user={user} />
			))}
		</div>
	);
}

function UserItem({ user }) {
	const [optimisticUser, setOptimisticUser] = useOptimistic(user);
	const [isPending, startTransition] = useTransition();

	const toggleStatus = () => {
		startTransition(async () => {
			// Optimistic update
			setOptimisticUser((prev) => ({
				...prev,
				active: !prev.active,
			}));

			// Server action
			await updateUserStatus(user.id, !user.active);
		});
	};

	return (
		<div>
			<span>{optimisticUser.name}</span>
			<button
				onClick={toggleStatus}
				disabled={isPending}
				className={optimisticUser.active ? 'active' : 'inactive'}>
				{optimisticUser.active ? 'Active' : 'Inactive'}
			</button>
		</div>
	);
}
```

### 3. The use Hook

**Purpose**: Read promises and resources in components, enabling better data fetching patterns.

**Admin Template Use Case**: Reading server data in client components, handling async operations.

```tsx
'use client';
import { use } from 'react';
import { getUserData } from '@/lib/data';

export function UserDashboard({ userId }: { userId: string }) {
	// Read promise in component
	const userData = use(getUserData(userId));

	return (
		<div>
			<h1>{userData.name}</h1>
			<Stats data={userData.stats} />
		</div>
	);
}

// Server Component
export default function Dashboard({ params }) {
	return (
		<Suspense fallback={<Loading />}>
			<UserDashboard userId={params.id} />
		</Suspense>
	);
}
```

### 4. Server Components with Async Operations

**Purpose**: Direct async operations in components without useEffect.

**Admin Template Use Case**: Data fetching, authentication checks, permission validation.

```tsx
// Server Component
export default async function AdminPage() {
	// Check authentication server-side
	const session = await getServerSession();

	if (!session?.user?.role === 'admin') {
		return <AccessDenied />;
	}

	// Fetch data directly
	const [users, stats, recentActivity] = await Promise.all([
		getUsers(),
		getDashboardStats(),
		getRecentActivity(),
	]);

	return (
		<div>
			<StatsCards stats={stats} />
			<UsersTable users={users} />
			<ActivityFeed activities={recentActivity} />
		</div>
	);
}
```

## Progressive Enhancement with Suspense

### Streaming UI Components

```tsx
import { Suspense } from 'react';

export default function DashboardLayout({ children }) {
	return (
		<div className='dashboard'>
			<Sidebar />
			<main>
				<Suspense fallback={<PageSkeleton />}>{children}</Suspense>
			</main>
		</div>
	);
}

export default async function DashboardPage() {
	return (
		<div>
			<Suspense fallback={<StatsSkeleton />}>
				<DashboardStats />
			</Suspense>

			<Suspense fallback={<TableSkeleton />}>
				<DataTable />
			</Suspense>

			<Suspense fallback={<ChartSkeleton />}>
				<AnalyticsChart />
			</Suspense>
		</div>
	);
}
```

### Error Boundaries with React 19

```tsx
'use client';
import { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='error-boundary'>
					<h2>Something went wrong</h2>
					<button onClick={() => this.setState({ hasError: false, error: null })}>
						Try again
					</button>
					{process.env.NODE_ENV === 'development' && (
						<details>
							<summary>Error details</summary>
							<pre>{this.state.error?.stack}</pre>
						</details>
					)}
				</div>
			);
		}

		return this.props.children;
	}
}
```

## Form Handling Patterns

### Enhanced Form Component

```tsx
'use client';
import { useActionState } from 'react';

export function Form({ action, children, ...props }) {
	const [state, formAction, isPending] = useActionState(action, null);

	return (
		<form
			action={formAction}
			{...props}
			className={`${props.className || ''} ${isPending ? 'submitting' : ''}`}>
			{children}

			{state?.error && <div className='form-error'>{state.error}</div>}

			{state?.success && <div className='form-success'>Operation completed successfully</div>}
		</form>
	);
}
```

### Optimistic Form Updates

```tsx
'use client';
import { useOptimistic, useTransition } from 'react';

export function EditableField({ value, onSave }) {
	const [optimisticValue, setOptimisticValue] = useOptimistic(value);
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);

	const handleSubmit = (newValue) => {
		startTransition(async () => {
			setOptimisticValue(newValue);
			setIsEditing(false);
			await onSave(newValue);
		});
	};

	if (isEditing) {
		return (
			<input
				value={optimisticValue}
				onChange={(e) => setOptimisticValue(e.target.value)}
				onBlur={() => handleSubmit(optimisticValue)}
				disabled={isPending}
				autoFocus
			/>
		);
	}

	return (
		<span onClick={() => setIsEditing(true)}>
			{optimisticValue}
			{isPending && <span>(saving...)</span>}
		</span>
	);
}
```

## Performance Patterns

### Resource Preloading

```tsx
'use client';
import { use } from 'react';

// Preload data for better UX
function usePreloadedData() {
	const cache = useMemo(() => new Map(), []);

	const preload = (key, promise) => {
		if (!cache.has(key)) {
			cache.set(key, promise);
		}
	};

	const read = (key) => {
		if (cache.has(key)) {
			return use(cache.get(key));
		}
		throw new Error(`Data not preloaded: ${key}`);
	};

	return { preload, read };
}
```

### Selective Hydration

```tsx
// Server Component
export default function Dashboard() {
	return (
		<div>
			{/* Static content - no hydration needed */}
			<StaticHeader />

			{/* Interactive content - hydrates on interaction */}
			<ClientOnly>
				<InteractiveChart />
			</ClientOnly>
		</div>
	);
}

// Client Component
('use client');
export function ClientOnly({ children }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className='skeleton' />; // Placeholder
	}

	return children;
}
```

## Migration Guide

### From useState + useEffect Patterns

**Before (React 18)**:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
	fetchData()
		.then(setData)
		.finally(() => setLoading(false));
}, []);
```

**After (React 19)**:

```tsx
// Server Component - direct async
const data = await fetchData();

// Or Client Component with use
const data = use(fetchData());
```

### From Manual Form Handling

**Before**:

```tsx
const [formState, setFormState] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
	e.preventDefault();
	setIsSubmitting(true);
	try {
		await submitForm(formState);
	} finally {
		setIsSubmitting(false);
	}
};
```

**After**:

```tsx
const [state, formAction, isPending] = useActionState(submitForm, null);

return (
	<form action={formAction}>
		{/* inputs */}
		<button disabled={isPending}>Submit</button>
	</form>
);
```

These React 19 patterns significantly improve the developer experience and performance of admin templates by reducing boilerplate code and providing better user experiences through optimistic updates and progressive enhancement.
