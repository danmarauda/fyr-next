# Real-Time Data Patterns with Convex

Comprehensive patterns for implementing real-time features using Convex's live queries, optimistic updates, and subscription management.

## ⚡ Core Concepts

### Live Queries

Convex automatically keeps query results up-to-date as data changes:

```typescript
// convex/messages.ts
export const list = query({
	args: { channelId: v.id('channels') },
	handler: async (ctx, { channelId }) => {
		return await ctx.db
			.query('messages')
			.withIndex('channelId', (q) => q.eq('channelId', channelId))
			.order('desc')
			.collect();
	},
});

// Component automatically updates when messages change
function MessageList({ channelId }) {
	const messages = useQuery(api.messages.list, { channelId });
	// No manual subscription management needed!
}
```

### Optimistic Updates

Provide instant UI feedback while mutations complete:

```typescript
function ChatInput({ channelId }) {
  const sendMessage = useMutation(api.messages.create);
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  const handleSend = async (text: string) => {
    const tempId = crypto.randomUUID();
    const optimisticMessage = {
      _id: tempId,
      text,
      userId: currentUser.id,
      createdAt: Date.now(),
      _isOptimistic: true, // Custom flag
    };

    // Show message immediately
    setOptimisticMessages(prev => [...prev, optimisticMessage]);

    try {
      await sendMessage({ channelId, text });
      // Remove optimistic message after success
      setOptimisticMessages(prev =>
        prev.filter(m => m._id !== tempId)
      );
    } catch (error) {
      // Remove optimistic message on error
      setOptimisticMessages(prev =>
        prev.filter(m => m._id !== tempId)
      );
      // Show error to user
    }
  };

  return (
    <div>
      {/* Render both real and optimistic messages */}
      {[...messages, ...optimisticMessages].map(msg => (
        <Message
          key={msg._id}
          message={msg}
          isOptimistic={msg._isOptimistic}
        />
      ))}
    </div>
  );
}
```

## 📊 Pagination Patterns

### Basic Pagination

```typescript
export const list = query({
  args: {
    channelId: v.id("channels"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { channelId, paginationOpts }) => {
    return await ctx.db
      .query("messages")
      .withIndex("channelId", (q) => q.eq("channelId", channelId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

// Component with pagination
function PaginatedMessages({ channelId }) {
  const {
    results: messages,
    status,
    loadMore,
    isDone,
  } = usePaginatedQuery(
    api.messages.list,
    { channelId },
    { initialNumItems: 20 }
  );

  return (
    <div>
      {messages.map(msg => <Message key={msg._id} message={msg} />)}

      {!isDone && (
        <button
          onClick={() => loadMore(20)}
          disabled={status === "LoadingMore"}
        >
          {status === "LoadingMore" ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
```

### Cursor-Based Pagination

```typescript
export const listWithCursor = query({
	args: {
		channelId: v.id('channels'),
		cursor: v.optional(v.string()),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { channelId, cursor, limit = 20 }) => {
		let query = ctx.db
			.query('messages')
			.withIndex('channelId', (q) => q.eq('channelId', channelId))
			.order('desc');

		if (cursor) {
			query = query.paginate({ cursor, numItems: limit });
		} else {
			query = query.take(limit);
		}

		const result = await query;
		return {
			messages: result.page,
			nextCursor: result.hasMore ? result.continueCursor : null,
		};
	},
});
```

## 🔄 Real-Time Subscriptions

### Conditional Subscriptions

```typescript
function ChatRoom({ roomId, userId }) {
  // Only subscribe if user has access
  const room = useQuery(
    api.rooms.get,
    roomId ? { roomId } : "skip"
  );

  // Only subscribe to messages if room exists and user can access
  const messages = useQuery(
    api.messages.list,
    room && room.canAccess ? { roomId } : "skip"
  );

  // Only subscribe to online users if room is active
  const onlineUsers = useQuery(
    api.users.online,
    room?.isActive ? { roomId } : "skip"
  );

  if (!room) return <div>Loading room...</div>;
  if (!room.canAccess) return <div>Access denied</div>;

  return (
    <div>
      <RoomHeader room={room} onlineCount={onlineUsers?.length || 0} />
      <MessageList messages={messages || []} />
    </div>
  );
}
```

### Multiple Subscriptions

```typescript
function Dashboard() {
  const user = useQuery(api.users.current);
  const notifications = useQuery(
    api.notifications.list,
    user ? { userId: user._id } : "skip"
  );
  const stats = useQuery(
    api.analytics.stats,
    user?.role === "admin" ? {} : "skip"
  );
  const recentActivity = useQuery(
    api.activity.recent,
    user ? { userId: user._id } : "skip"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard stats={stats} />
      <NotificationsCard notifications={notifications} />
      <ActivityCard activities={recentActivity} />
    </div>
  );
}
```

## 🔐 Permission-Based Queries

### Protecting Query Results

```typescript
export const list = query({
	args: { teamId: v.id('teams') },
	handler: async (ctx, { teamId }) => {
		// Check permissions before subscribing
		if (ctx.viewer === null || !(await viewerHasPermission(ctx, teamId, 'Read Members'))) {
			return { page: [], isDone: true, continueCursor: '' };
		}

		return await ctx.db.query('teams').getX(teamId).edge('members').order('desc').collect();
	},
});
```

### Dynamic Permissions

```typescript
function TeamDashboard({ teamId }) {
  const userPermissions = useQuery(api.permissions.getUserPermissions, {
    teamId,
  });

  // Conditionally subscribe based on permissions
  const members = useQuery(
    api.members.list,
    userPermissions?.includes("read_members") ? { teamId } : "skip"
  );

  const settings = useQuery(
    api.teams.settings,
    userPermissions?.includes("manage_team") ? { teamId } : "skip"
  );

  return (
    <div>
      {userPermissions?.includes("read_members") && (
        <MembersList members={members} />
      )}
      {userPermissions?.includes("manage_team") && (
        <TeamSettings settings={settings} />
      )}
    </div>
  );
}
```

## 📱 Cross-Platform Real-Time

### Web and Mobile Sync

```typescript
// Shared hook for real-time data
function useRealtimeMessages(channelId: string) {
  const messages = useQuery(api.messages.list, { channelId });
  const sendMessage = useMutation(api.messages.create);

  return {
    messages: messages || [],
    sendMessage: (text: string) =>
      sendMessage({ channelId, text }),
    isLoading: messages === undefined,
  };
}

// Web usage
function WebChat({ channelId }) {
  const { messages, sendMessage, isLoading } = useRealtimeMessages(channelId);

  return (
    <div>
      {isLoading ? (
        <div>Loading messages...</div>
      ) : (
        messages.map(msg => <Message key={msg._id} message={msg} />)
      )}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

// Mobile usage (React Native)
function MobileChat({ channelId }) {
  const { messages, sendMessage, isLoading } = useRealtimeMessages(channelId);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          keyExtractor={item => item._id}
        />
      )}
      <ChatInput onSend={sendMessage} />
    </View>
  );
}
```

## 🔄 State Management Patterns

### Stale Data Handling

```typescript
function useStaleValue<T>(value: T | undefined) {
  const stored = useRef(value);

  if (value !== undefined) {
    stored.current = value;
  }

  return {
    value: stored.current,
    stale: value !== stored.current
  };
}

function DataDisplay() {
  const data = useQuery(api.data.get);
  const { value, stale } = useStaleValue(data);

  return (
    <div className={stale ? "opacity-75" : ""}>
      {value?.content || "Loading..."}
      {stale && <div className="text-sm text-gray-500">Updating...</div>}
    </div>
  );
}
```

### Loading States

```typescript
function SmartQuery({ query, args, children }) {
  const result = useQuery(query, args);
  const [previousResult, setPreviousResult] = useState();

  useEffect(() => {
    if (result !== undefined) {
      setPreviousResult(result);
    }
  }, [result]);

  const displayResult = result !== undefined ? result : previousResult;
  const isLoading = result === undefined;

  return children({
    data: displayResult,
    isLoading,
    error: null, // Convex handles errors differently
  });
}

function MessageList({ channelId }) {
  return (
    <SmartQuery
      query={api.messages.list}
      args={{ channelId }}
    >
      {({ data, isLoading }) => (
        <div>
          {isLoading && <div>Loading...</div>}
          {data?.map(msg => (
            <Message key={msg._id} message={msg} />
          ))}
        </div>
      )}
    </SmartQuery>
  );
}
```

## 🚀 Advanced Patterns

### Real-Time Search

```typescript
export const search = query({
  args: {
    teamId: v.id("teams"),
    query: v.string(),
  },
  handler: async (ctx, { teamId, query }) => {
    if (query.length < 2) return [];

    return await ctx.db
      .query("members")
      .withSearchIndex("searchable", (q) =>
        q.search("searchable", query)
         .eq("teamId", teamId)
      )
      .take(10);
  },
});

function SearchMembers({ teamId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const results = useQuery(
    api.members.search,
    debouncedQuery ? { teamId, query: debouncedQuery } : "skip"
  );

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search members..."
      />
      {results?.map(member => (
        <MemberCard key={member._id} member={member} />
      ))}
    </div>
  );
}
```

### Real-Time Notifications

```typescript
export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .take(50);
  },
});

function NotificationBell() {
  const notifications = useQuery(api.notifications.getNotifications, {
    userId: currentUser.id,
  });

  const unreadCount = notifications?.length || 0;

  return (
    <button className="relative">
      <BellIcon />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}
```

### Collaborative Editing

```typescript
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    version: v.number(),
  },
  handler: async (ctx, { documentId, content, version }) => {
    const document = await ctx.db.get(documentId);

    // Optimistic concurrency control
    if (document.version !== version) {
      throw new Error("Document was modified by another user");
    }

    await ctx.db.patch(documentId, {
      content,
      version: version + 1,
      lastModified: Date.now(),
      lastModifiedBy: ctx.viewer,
    });
  },
});

function CollaborativeEditor({ documentId }) {
  const document = useQuery(api.documents.get, { documentId });
  const updateDocument = useMutation(api.documents.updateDocument);
  const [localContent, setLocalContent] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (document) {
      setLocalContent(document.content);
      setVersion(document.version);
    }
  }, [document]);

  const handleSave = async () => {
    try {
      await updateDocument({
        documentId,
        content: localContent,
        version,
      });
    } catch (error) {
      // Handle conflict - could show merge UI
      console.error("Conflict detected:", error);
    }
  };

  return (
    <textarea
      value={localContent}
      onChange={(e) => setLocalContent(e.target.value)}
      onBlur={handleSave}
      placeholder="Start typing..."
    />
  );
}
```

## 📊 Performance Optimization

### Query Optimization

```typescript
// Use specific indexes
export const getUserPosts = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		return await ctx.db
			.query('posts')
			.withIndex('userId_createdAt', (q) => q.eq('userId', userId))
			.order('desc')
			.take(10);
	},
});

// Avoid N+1 queries with edges
export const getPostsWithAuthors = query({
	handler: async (ctx) => {
		const posts = await ctx.db.query('posts').take(10);

		// Good: Use edges for related data
		return Promise.all(
			posts.map(async (post) => ({
				...post,
				author: await post.edge('author'),
			})),
		);
	},
});
```

### Subscription Management

```typescript
function useOptimizedSubscription(query, args, options = {}) {
	const [isStale, setIsStale] = useState(false);
	const result = useQuery(query, args);

	useEffect(() => {
		if (result !== undefined) {
			setIsStale(false);
			const timeout = setTimeout(() => setIsStale(true), 30000); // 30s
			return () => clearTimeout(timeout);
		}
	}, [result]);

	return {
		data: result,
		isStale,
		isLoading: result === undefined,
	};
}
```

## 🧪 Testing Real-Time Features

### Testing Subscriptions

```typescript
import { convexTest } from 'convex-test';
import { api } from '../convex/_generated/api';

test('messages update in real-time', async () => {
	const t = convexTest(api);

	// Subscribe to messages
	const messages = t.query(api.messages.list, { channelId: 'test' });

	// Initially empty
	expect(await messages.value()).toEqual([]);

	// Add a message
	await t.run(async (ctx) => {
		await ctx.db.insert('messages', {
			channelId: 'test',
			text: 'Hello world',
			userId: 'user1',
		});
	});

	// Subscription should update
	await messages.waitForUpdate();
	expect(await messages.value()).toHaveLength(1);
});
```

### Testing Optimistic Updates

```typescript
test('optimistic updates work correctly', async () => {
	const t = convexTest(api);

	// Mock the mutation
	const createMessage = t.mutation(api.messages.create);

	// Start optimistic update
	const optimisticResult = createMessage({ channelId: 'test', text: 'Hello' });

	// Should return immediately (optimistic)
	expect(optimisticResult).toBeDefined();

	// Wait for actual update
	await optimisticResult;

	// Verify data was persisted
	const messages = await t.query(api.messages.list, { channelId: 'test' });
	expect(await messages.value()).toHaveLength(1);
});
```

## 🎯 Best Practices

### Query Design

1. **Use appropriate indexes** for fast queries
2. **Paginate large result sets**
3. **Filter data server-side** when possible
4. **Use "skip" for conditional queries**

### Real-Time UX

1. **Show loading states** appropriately
2. **Implement optimistic updates** for better UX
3. **Handle stale data** gracefully
4. **Provide feedback** for user actions

### Performance

1. **Limit subscription scope** to necessary data
2. **Use pagination** to reduce payload size
3. **Debounce search queries**
4. **Monitor query performance**

### Error Handling

1. **Handle network disconnections**
2. **Retry failed mutations**
3. **Show user-friendly error messages**
4. **Log errors for debugging**

## 📚 Resources

- [Convex Real-Time Guide](https://docs.convex.dev/client/react)
- [Optimistic Updates](https://docs.convex.dev/client/react#optimistic-updates)
- [Pagination](https://docs.convex.dev/database/pagination)
- [Query Performance](https://docs.convex.dev/performance)

This collection of real-time patterns provides the foundation for building responsive, collaborative applications with Convex.
