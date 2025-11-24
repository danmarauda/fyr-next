# Convex Monorepo Architectures

Production-ready monorepo patterns for building cross-platform applications with Convex backend, supporting web, mobile, and shared packages.

## 🏗️ Architecture Overview

### Centralized Backend Pattern

```
monorepo/
├── apps/
│   ├── web/              # Next.js application
│   ├── native/           # Expo/React Native app
│   └── docs/             # Documentation site
├── packages/
│   ├── backend/          # Shared Convex backend
│   ├── ui/               # Shared UI components
│   ├── theme/            # Design system
│   ├── auth/             # Authentication logic
│   └── utils/            # Shared utilities
└── tools/
    ├── scripts/          # Build/deployment scripts
    └── configs/          # Shared configurations
```

### Benefits

- **Single source of truth** for backend logic
- **Shared types** across all applications
- **Consistent authentication** across platforms
- **Unified deployment** strategy
- **Code reuse** and maintainability

## 📦 Package Structure

### Backend Package (`packages/backend/`)

```
packages/backend/
├── convex/
│   ├── _generated/        # Auto-generated types
│   ├── auth.ts           # Authentication config
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User operations
│   ├── messages.ts       # Message operations
│   └── http.ts           # HTTP routes
├── src/
│   └── lib/              # Backend utilities
├── package.json
└── tsconfig.json
```

### Shared UI Package (`packages/ui/`)

```
packages/ui/
├── src/
│   ├── components/       # Reusable components
│   ├── hooks/           # Shared hooks
│   └── types/           # Component types
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### pnpm Workspace Setup

```json
// pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tools/*"
```

### Turbo Configuration

```json
// turbo.json
{
	"$schema": "https://turbo.build/schema.json",
	"globalDependencies": ["**/.env.*local"],
	"tasks": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": [".next/**", "!.next/cache/**", "dist/**"]
		},
		"lint": {},
		"dev": {
			"cache": false,
			"persistent": true
		},
		"test": {},
		"typecheck": {}
	}
}
```

### TypeScript Configuration

```json
// packages/backend/tsconfig.json
{
	"extends": "../../tsconfig.json",
	"include": ["convex/**/*", "src/**/*"],
	"exclude": ["node_modules", "convex/_generated"]
}
```

## 🚀 Platform-Specific Setup

### Next.js Web Application

```typescript
// apps/web/src/ConvexClientProvider.tsx
"use client";
import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Expo/React Native Application

```typescript
// apps/native/ConvexClientProvider.tsx
"use client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

## 🔐 Authentication Integration

### Shared Auth Configuration

```typescript
// packages/backend/convex/auth.ts
import { convexAuth } from '@convex-dev/auth/server';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { ResendOTP } from './resend.otp';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		ResendOTP({
			apiKey: process.env.RESEND_API_KEY!,
			from: 'auth@yourapp.com',
		}),
	],
	callbacks: {
		async afterUserCreatedOrUpdated(ctx, { userId, isNewUser }) {
			if (isNewUser) {
				await ctx.db.patch(userId, {
					role: 'user',
					createdAt: Date.now(),
				});
			}
		},
	},
});
```

### HTTP Routes Setup

```typescript
// packages/backend/convex/http.ts
import { httpRouter } from 'convex/server';
import { auth } from './auth';

const http = httpRouter();
auth.addHttpRoutes(http);

export default http;
```

## 📊 Shared Schema & Types

### Database Schema

```typescript
// packages/backend/convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		email: v.string(),
		name: v.string(),
		role: v.string(),
		avatar: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index('email', ['email'])
		.index('role', ['role']),

	messages: defineTable({
		userId: v.id('users'),
		content: v.string(),
		channelId: v.id('channels'),
		createdAt: v.number(),
	})
		.index('channelId', ['channelId'])
		.index('userId', ['userId']),
});
```

### Generated Types Usage

```typescript
// apps/web/src/hooks/useMessages.ts
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';

export function useMessages(channelId: string) {
	return useQuery(api.messages.list, { channelId });
}

// apps/native/src/hooks/useMessages.ts
import { useQuery } from 'convex/react';
import { api } from '@packages/backend/convex/_generated/api';

export function useMessages(channelId: string) {
	return useQuery(api.messages.list, { channelId });
}
```

## 🚀 Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start all applications
pnpm dev

# Start specific app
pnpm dev --filter=web

# Start backend only
pnpm dev --filter=backend
```

### Building Applications

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=web

# Build backend
pnpm build --filter=backend
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=backend

# Run type checking
pnpm typecheck
```

## 🚢 Deployment Strategy

### Coordinated Deployment

```bash
# Deploy backend first, then applications
cd packages/backend && \
npx convex deploy --cmd 'cd ../../apps/web && pnpm build' \
--cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL

# Deploy mobile app
cd apps/native && \
eas build --platform ios
```

### Environment Management

```bash
# apps/web/.env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# apps/native/.env.local
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# packages/backend/.env.local
CONVEX_DEPLOYMENT=your-deployment
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
RESEND_API_KEY=your_resend_api_key
```

## 🔄 Cross-Platform Patterns

### Shared Business Logic

```typescript
// packages/utils/src/validation.ts
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePassword(password: string): string[] {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push('Password must be at least 8 characters');
	}
	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain uppercase letter');
	}
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain lowercase letter');
	}
	if (!/\d/.test(password)) {
		errors.push('Password must contain number');
	}

	return errors;
}
```

### Platform-Specific Components

```typescript
// packages/ui/src/Button.tsx
import { ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded font-medium",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-gray-200 text-gray-800 hover:bg-gray-300": variant === "secondary",
          "opacity-50 cursor-not-allowed": disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### Platform-Specific Hooks

```typescript
// packages/ui/src/hooks/usePlatform.ts
import { useEffect, useState } from 'react';

export function usePlatform() {
	const [platform, setPlatform] = useState<'web' | 'native'>('web');

	useEffect(() => {
		// Detect platform
		if (typeof window !== 'undefined' && window.navigator) {
			setPlatform('web');
		} else {
			setPlatform('native');
		}
	}, []);

	return platform;
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
// packages/utils/src/__tests__/validation.test.ts
import { validateEmail, validatePassword } from '../validation';

describe('validation', () => {
	test('validates email correctly', () => {
		expect(validateEmail('user@example.com')).toBe(true);
		expect(validateEmail('invalid-email')).toBe(false);
	});

	test('validates password requirements', () => {
		expect(validatePassword('weak')).toContain('at least 8 characters');
		expect(validatePassword('StrongPass123')).toEqual([]);
	});
});
```

### Integration Tests

```typescript
// apps/web/__tests__/auth.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConvexProviderWithAuth } from "convex/react";
import SignIn from "../app/signin/page";

const convex = new ConvexReactClient("https://test.convex.cloud");

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

## 📈 Performance Optimization

### Code Splitting

```typescript
// apps/web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		optimizePackageImports: ['@packages/ui', '@packages/backend'],
	},
};

module.exports = nextConfig;
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build --filter=web
npx @next/bundle-analyzer apps/web
```

### Caching Strategy

```typescript
// turbo.json - Optimize caching
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", ".expo/**"],
      "env": ["NODE_ENV", "NEXT_PUBLIC_*", "EXPO_PUBLIC_*"]
    }
  }
}
```

## 🎯 Best Practices

### Code Organization

1. **Keep backend logic centralized** in the backend package
2. **Share types** across all applications
3. **Use platform-specific providers** for Convex clients
4. **Maintain consistent authentication** across platforms

### Development Workflow

1. **Use pnpm workspaces** for dependency management
2. **Leverage Turbo** for build orchestration
3. **Implement proper TypeScript** configuration
4. **Use environment variables** for configuration

### Deployment

1. **Deploy backend first** before applications
2. **Use coordinated deployments** with proper sequencing
3. **Maintain separate environments** for staging/production
4. **Monitor performance** across all platforms

### Testing

1. **Write unit tests** for utilities and business logic
2. **Implement integration tests** for critical flows
3. **Test authentication** thoroughly across platforms
4. **Use consistent testing patterns**

## 📚 Featured Examples

### syntaxlexx/turbo-expo-tanstack-convex-monorepo

- **Turbo + Expo + TanStack Query** integration
- **Cross-platform authentication** with Clerk
- **Shared Convex backend** with generated types
- **Optimized build pipeline**

### get-convex/turbo-expo-nextjs-clerk-convex-monorepo

- **Next.js + Expo** with shared backend
- **Clerk authentication** integration
- **Real-time data synchronization**
- **Type-safe API consumption**

### vintuvishAl/convex-react-keycloak-monorepo

- **Keycloak authentication** with Convex
- **Monorepo structure** for scalability
- **Role-based access control**
- **Multi-environment support**

## 🚀 Getting Started

```bash
# Clone a template
npx degit syntaxlexx/turbo-expo-tanstack-convex-monorepo my-monorepo
cd my-monorepo

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local
cp apps/native/.env.example apps/native/.env.local
cp packages/backend/.env.example packages/backend/.env.local

# Start development
pnpm dev
```

This monorepo architecture provides a solid foundation for building scalable, cross-platform applications with Convex backend and shared authentication.
