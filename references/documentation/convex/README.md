# Convex Backend Documentation

## Overview

Convex is a real-time backend-as-a-service that provides database, authentication, and real-time subscriptions. Perfect for admin templates requiring live data updates and complex queries.

## Key Features for Admin Templates

### Real-time Database

- **Live Queries** - Automatic UI updates when data changes
- **Optimistic Updates** - Instant feedback with automatic reconciliation
- **Type Safety** - End-to-end TypeScript support
- **ACID Transactions** - Reliable data consistency

### Authentication Integration

- **Better Auth Support** - Seamless integration with Better Auth
- **Role-based Access** - Built-in permission system
- **Session Management** - Automatic session handling

### Serverless Functions

- **Query Functions** - Read data with complex filtering
- **Mutation Functions** - Modify data with validation
- **Action Functions** - Handle complex operations
- **HTTP Actions** - REST API endpoints

## Quick Start with Next.js

### Installation

```bash
npm install convex
npx convex dev --once  # Initialize project
```

### Project Structure

```
convex/
├── _generated/         # Auto-generated types and clients
├── auth.config.ts     # Authentication configuration
├── schema.ts          # Database schema
├── users.ts           # User-related functions
├── posts.ts           # Post-related functions
└── index.ts           # Main entry point
```

### Schema Definition

```ts
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@better-auth/convex';

const users = defineTable({
	email: v.string(),
	name: v.string(),
	role: v.union(v.literal('admin'), v.literal('user'), v.literal('moderator')),
	createdAt: v.number(),
	updatedAt: v.number(),
}).index('by_email', ['email']);

const posts = defineTable({
	title: v.string(),
	content: v.string(),
	authorId: v.id('users'),
	published: v.boolean(),
	createdAt: v.number(),
	updatedAt: v.number(),
}).index('by_author', ['authorId']);

export default defineSchema({
	...authTables,
	users,
	posts,
});
```

### Authentication Setup

```ts
// convex/auth.config.ts
import { convexAuth } from '@convex-dev/auth/server';

const auth = convexAuth({
	providers: [
		/* Better Auth providers */
	],
});

export default auth;
```

## Query Functions

### Basic Queries

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
	args: {
		limit: v.optional(v.number()),
		offset: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx);
		const user = await ctx.db.get(userId);

		// Only admins can see all users
		if (user?.role !== 'admin') {
			throw new Error('Unauthorized');
		}

		const users = await ctx.db.query('users').collect();
		return users.slice(args.offset || 0, (args.offset || 0) + (args.limit || 10));
	},
});
```

### Complex Queries with Filtering

```ts
export const getPosts = query({
	args: {
		authorId: v.optional(v.id('users')),
		published: v.optional(v.boolean()),
		search: v.optional(v.string()),
		sortBy: v.optional(v.union(v.literal('createdAt'), v.literal('updatedAt'))),
		sortOrder: v.optional(v.union(v.literal('asc'), v.literal('desc'))),
	},
	handler: async (ctx, args) => {
		let query = ctx.db.query('posts');

		// Apply filters
		if (args.authorId) {
			query = query.withIndex('by_author', (q) => q.eq('authorId', args.authorId));
		}

		if (args.published !== undefined) {
			query = query.filter((q) => q.eq(q.field('published'), args.published));
		}

		if (args.search) {
			query = query.filter((q) =>
				q.or(q.eq(q.field('title'), args.search), q.eq(q.field('content'), args.search)),
			);
		}

		// Apply sorting
		const sortField = args.sortBy || 'createdAt';
		const sortOrder = args.sortOrder || 'desc';

		query = query.order(sortOrder === 'desc' ? 'desc' : 'asc');

		return await query.collect();
	},
});
```

## Mutation Functions

### Create Operations

```ts
// convex/posts.ts
import { mutation } from './_generated/server';
import { auth } from './auth';

export const createPost = mutation({
	args: {
		title: v.string(),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx);
		if (!userId) throw new Error('Unauthorized');

		const postId = await ctx.db.insert('posts', {
			title: args.title,
			content: args.content,
			authorId: userId,
			published: false,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return postId;
	},
});
```

### Update Operations

```ts
export const updatePost = mutation({
	args: {
		id: v.id('posts'),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
		published: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx);
		if (!userId) throw new Error('Unauthorized');

		const post = await ctx.db.get(args.id);
		if (!post) throw new Error('Post not found');

		// Check permissions
		if (post.authorId !== userId) {
			const user = await ctx.db.get(userId);
			if (user?.role !== 'admin') {
				throw new Error('Unauthorized');
			}
		}

		await ctx.db.patch(args.id, {
			...(args.title !== undefined && { title: args.title }),
			...(args.content !== undefined && { content: args.content }),
			...(args.published !== undefined && { published: args.published }),
			updatedAt: Date.now(),
		});

		return args.id;
	},
});
```

### Delete Operations

```ts
export const deletePost = mutation({
	args: { id: v.id('posts') },
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx);
		if (!userId) throw new Error('Unauthorized');

		const post = await ctx.db.get(args.id);
		if (!post) throw new Error('Post not found');

		// Check permissions
		if (post.authorId !== userId) {
			const user = await ctx.db.get(userId);
			if (user?.role !== 'admin') {
				throw new Error('Unauthorized');
			}
		}

		await ctx.db.delete(args.id);
		return args.id;
	},
});
```

## Real-time Subscriptions

### Client-side Usage

```tsx
'use client';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function PostsList() {
	// Real-time query - updates automatically
	const posts = useQuery(api.posts.getPosts, {
		published: true,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	});

	const createPost = useMutation(api.posts.createPost);

	const handleCreatePost = () => {
		createPost({
			title: 'New Post',
			content: 'Post content...',
		});
	};

	if (!posts) return <div>Loading...</div>;

	return (
		<div>
			<button onClick={handleCreatePost}>Create Post</button>
			{posts.map((post) => (
				<div key={post._id}>
					<h3>{post.title}</h3>
					<p>{post.content}</p>
				</div>
			))}
		</div>
	);
}
```

## File Storage

### Upload Files

```ts
// convex/files.ts
import { action } from './_generated/server';

export const uploadFile = action({
	args: { file: v.bytes() },
	handler: async (ctx, args) => {
		// Upload to Convex storage
		const storageId = await ctx.storage.store(args.file);

		// Get file URL
		const fileUrl = await ctx.storage.getUrl(storageId);

		return { storageId, fileUrl };
	},
});
```

### Generate Upload URLs

```ts
export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});
```

## Advanced Patterns

### Pagination

```ts
export const getPostsPaginated = query({
	args: {
		limit: v.number(),
		cursor: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const results = await ctx.db.query('posts').paginate({
			numItems: args.limit,
			cursor: args.cursor,
		});

		return {
			posts: results.page,
			hasMore: results.hasMore,
			nextCursor: results.nextCursor,
		};
	},
});
```

### Aggregations

```ts
export const getUserStats = query({
	args: { userId: v.id('users') },
	handler: async (ctx, args) => {
		const posts = await ctx.db
			.query('posts')
			.withIndex('by_author', (q) => q.eq('authorId', args.userId))
			.collect();

		return {
			totalPosts: posts.length,
			publishedPosts: posts.filter((p) => p.published).length,
			draftPosts: posts.filter((p) => !p.published).length,
		};
	},
});
```

### Vector Search (with additional setup)

```ts
export const searchPosts = query({
	args: { query: v.string(), limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		// Requires vector search setup
		const results = await ctx.vectorSearch('posts', 'embedding', {
			vector: await generateEmbedding(args.query),
			limit: args.limit || 10,
		});

		return results;
	},
});
```

## HTTP Actions (REST API)

### REST Endpoints

```ts
// convex/http.ts
import { httpAction } from './_generated/server';

export const getPostsAPI = httpAction(async (ctx, request) => {
	const posts = await ctx.runQuery(api.posts.getPosts, {
		published: true,
	});

	return new Response(JSON.stringify(posts), {
		headers: { 'Content-Type': 'application/json' },
	});
});

export const createPostAPI = httpAction(async (ctx, request) => {
	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	const { title, content } = await request.json();

	const postId = await ctx.runMutation(api.posts.createPost, {
		title,
		content,
	});

	return new Response(JSON.stringify({ id: postId }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' },
	});
});
```

## Deployment and Production

### Environment Variables

```env
# .env.local
CONVEX_URL=your-convex-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url
```

### Deployment

```bash
npx convex deploy  # Deploy functions and schema
```

### Monitoring

```ts
// convex/index.ts
import { httpRouter } from 'convex/server';

const http = httpRouter();

// Health check endpoint
http.route({
	path: '/health',
	method: 'GET',
	handler: httpAction(async () => {
		return new Response('OK', { status: 200 });
	}),
});

export default http;
```

## Best Practices

### 1. Schema Design

- Use appropriate indexes for query performance
- Keep schemas simple and focused
- Use unions for enums instead of strings
- Validate data at the schema level

### 2. Security

- Always check authentication in mutations
- Implement proper authorization checks
- Use Convex's built-in validation
- Sanitize user inputs

### 3. Performance

- Use indexes for frequently queried fields
- Implement pagination for large datasets
- Use selective queries to fetch only needed data
- Consider caching strategies

### 4. Real-time Updates

- Leverage Convex's real-time capabilities
- Use optimistic updates in the UI
- Handle connection states gracefully
- Implement proper error boundaries

### 5. File Management

- Use Convex storage for user-uploaded files
- Generate appropriate URLs for file access
- Implement file type validation
- Handle large file uploads appropriately

Convex provides an excellent backend foundation for admin templates, offering real-time capabilities, type safety, and seamless integration with modern React applications.
