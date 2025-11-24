# Next.js 16 + App Router Documentation

## Overview

Next.js is a React framework for building full-stack web applications. Version 16 includes significant improvements to the App Router with React 19 features.

## Key Features for Admin Templates

### App Router Architecture

- **Server Components** - Default component type for better performance
- **Client Components** - Use `'use client'` directive when needed
- **Server Actions** - Handle form submissions and mutations securely
- **Route Groups** - Organize routes without affecting URL structure
- **Parallel Routes** - Render multiple pages simultaneously
- **Intercepting Routes** - Modal-like experiences

### Server Components Benefits

```tsx
// Server Component (default in app/)
export default function Dashboard() {
	// Direct database access
	const data = await db.query();
	// No client-side JavaScript for this component
	return <div>{data}</div>;
}
```

### Server Actions

```tsx
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
	const name = formData.get('name');
	// Server-side validation and database operations
	await db.user.create({ name });
	revalidatePath('/users');
}
```

### File-based Routing

```
app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── dashboard/
│   ├── layout.tsx     # Dashboard layout
│   ├── page.tsx       # Dashboard page
│   └── users/
│       ├── page.tsx   # Users list
│       └── [id]/
│           └── page.tsx # User detail
```

## Performance Optimizations

### Image Optimization

```tsx
import Image from 'next/image';

export default function Avatar({ src, alt }) {
	return <Image src={src} alt={alt} width={40} height={40} className='rounded-full' />;
}
```

### Font Optimization

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
	return (
		<html lang='en' className={inter.className}>
			<body>{children}</body>
		</html>
	);
}
```

### Caching Strategies

- **Request Memoization** - Automatic deduplication of requests
- **Data Cache** - Persistent storage for expensive operations
- **Full Route Cache** - Static HTML generation
- **Router Cache** - Client-side navigation caching

## Configuration

### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
		serverComponentsExternalPackages: ['@prisma/client'],
	},
	images: {
		domains: ['example.com'],
	},
};

module.exports = nextConfig;
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
```

## Best Practices for Admin Templates

### 1. Server-First Approach

- Use Server Components by default
- Move client logic to separate client components
- Leverage Server Actions for data mutations

### 2. Route Organization

- Use route groups for organization: `(dashboard)`, `(auth)`, `(admin)`
- Implement proper loading and error states
- Use parallel routes for complex layouts

### 3. Data Fetching Patterns

```tsx
// Pattern 1: Server Component with direct data access
export default async function UsersPage() {
	const users = await getUsers();
	return <UsersList users={users} />;
}

// Pattern 2: Client Component with SWR/tanstack-query
('use client');
export function UsersList({ initialUsers }) {
	const { data: users } = useSWR('/api/users', { initialData: initialUsers });
	return <div>{/* render users */}</div>;
}
```

### 4. Authentication Integration

```tsx
// middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
	if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
		return Response.redirect(new URL('/login', req.url));
	}
});
```

## Migration from Pages Router

### Key Differences

- **File Structure**: `pages/` → `app/`
- **Data Fetching**: `getServerSideProps` → Server Components
- **API Routes**: `pages/api/` → `app/api/` (Route Handlers)
- **Styling**: `_app.tsx` → `layout.tsx`
- **Routing**: `useRouter` → `useRouter` (similar but enhanced)

### Migration Steps

1. Create `app/` directory alongside `pages/`
2. Move pages to `app/` with new conventions
3. Update imports and component structure
4. Migrate API routes to Route Handlers
5. Update `_app.tsx` to `layout.tsx`
6. Test thoroughly and remove `pages/` directory

## Advanced Features

### Streaming and Suspense

```tsx
import { Suspense } from 'react';

export default function Dashboard() {
	return (
		<div>
			<Suspense fallback={<Skeleton />}>
				<UserStats />
			</Suspense>
			<Suspense fallback={<Skeleton />}>
				<RecentActivity />
			</Suspense>
		</div>
	);
}
```

### Metadata API

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard | Admin Panel',
	description: 'Manage your application settings',
};

export default function DashboardPage() {
	return <div>Dashboard Content</div>;
}
```

### Internationalization

```tsx
// app/[locale]/layout.tsx
export default function LocaleLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	return (
		<html lang={locale}>
			<body>{children}</body>
		</html>
	);
}
```

This documentation covers the essential Next.js 16 features most relevant to building admin templates with the App Router.
