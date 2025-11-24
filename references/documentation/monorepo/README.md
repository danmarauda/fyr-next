# Monorepo Patterns with pnpm Workspaces

## Overview

Modern admin templates often use monorepo architectures to manage multiple packages efficiently. pnpm workspaces provide excellent performance and disk usage optimization.

## pnpm Workspace Configuration

### Basic Structure

```
monorepo/
├── packages/
│   ├── ui/           # Shared UI components
│   ├── theme/        # Theme configuration
│   ├── auth/         # Authentication logic
│   ├── utils/        # Shared utilities
│   └── charts/       # Chart components
├── apps/
│   ├── admin/        # Admin dashboard app
│   ├── docs/         # Documentation site
│   └── landing/      # Marketing site
├── package.json      # Root package.json
├── pnpm-workspace.yaml # Workspace configuration
└── pnpm-lock.yaml    # Single lockfile
```

### pnpm-workspace.yaml

```yaml
packages:
    - 'apps/*'
    - 'packages/*'
    - 'tools/*'
```

### Root package.json

```json
{
	"name": "admin-monorepo",
	"private": true,
	"packageManager": "pnpm@8.15.0",
	"scripts": {
		"build": "turbo build",
		"dev": "turbo dev",
		"lint": "turbo lint",
		"test": "turbo test",
		"clean": "turbo clean && rm -rf node_modules"
	},
	"devDependencies": {
		"turbo": "^1.10.0",
		"typescript": "^5.0.0",
		"@types/node": "^20.0.0"
	}
}
```

## Package Architecture

### Shared UI Package (@monorepo/ui)

**package.json**

```json
{
	"name": "@monorepo/ui",
	"version": "1.0.0",
	"main": "./dist/index.js",
	"module": "./dist/index.mjs",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.mjs",
			"require": "./dist/index.js"
		},
		"./styles": "./dist/styles.css"
	},
	"scripts": {
		"build": "tsup",
		"dev": "tsup --watch",
		"lint": "eslint src/**/*.{ts,tsx}",
		"typecheck": "tsc --noEmit"
	},
	"dependencies": {
		"react": "^18.0.0",
		"react-dom": "^18.0.0",
		"@radix-ui/react-dialog": "^1.0.0",
		"clsx": "^2.0.0",
		"tailwind-merge": "^2.0.0"
	},
	"devDependencies": {
		"@types/react": "^18.0.0",
		"tsup": "^7.0.0",
		"typescript": "^5.0.0"
	},
	"peerDependencies": {
		"react": "^18.0.0",
		"react-dom": "^18.0.0"
	}
}
```

**Component Structure**

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.test.tsx
│   │   │   └── index.ts
│   │   ├── dialog/
│   │   │   ├── dialog.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts          # Class name utility
│   │   └── index.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── button.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Theme Package (@monorepo/theme)

**package.json**

```json
{
	"name": "@monorepo/theme",
	"version": "1.0.0",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"scripts": {
		"build": "tsup",
		"dev": "tsup --watch"
	},
	"dependencies": {
		"react": "^18.0.0",
		"next-themes": "^0.2.0"
	},
	"devDependencies": {
		"tsup": "^7.0.0",
		"typescript": "^5.0.0"
	}
}
```

**Theme Provider**

```tsx
// packages/theme/src/theme-provider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Auth Package (@monorepo/auth)

**package.json**

```json
{
	"name": "@monorepo/auth",
	"version": "1.0.0",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"scripts": {
		"build": "tsup",
		"dev": "tsup --watch"
	},
	"dependencies": {
		"better-auth": "^0.1.0",
		"@better-auth/convex": "^0.1.0",
		"convex": "^1.0.0"
	},
	"devDependencies": {
		"tsup": "^7.0.0",
		"typescript": "^5.0.0"
	}
}
```

**Auth Configuration**

```ts
// packages/auth/src/auth.ts
import { betterAuth } from 'better-auth';
import { convexAdapter } from 'better-auth/adapters/convex';

export const auth = betterAuth({
	database: convexAdapter(),
	// ... configuration
});
```

## Application Structure

### Admin App (apps/admin)

**package.json**

```json
{
	"name": "@monorepo/admin",
	"version": "1.0.0",
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint",
		"typecheck": "tsc --noEmit"
	},
	"dependencies": {
		"next": "^14.0.0",
		"react": "^18.0.0",
		"react-dom": "^18.0.0",
		"@monorepo/ui": "workspace:*",
		"@monorepo/theme": "workspace:*",
		"@monorepo/auth": "workspace:*",
		"convex": "^1.0.0",
		"tailwindcss": "^3.0.0"
	},
	"devDependencies": {
		"@types/node": "^20.0.0",
		"@types/react": "^18.0.0",
		"typescript": "^5.0.0"
	}
}
```

**App Structure**

```
apps/admin/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── stats-cards.tsx
│   │       └── recent-activity.tsx
│   └── users/
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── ui/          # App-specific UI components
├── lib/
│   ├── auth.ts
│   ├── convex.ts
│   └── utils.ts
├── styles/
│   └── globals.css
└── package.json
```

## Build Orchestration with Turborepo

### turbo.json

```json
{
	"$schema": "https://turbo.build/schema.json",
	"globalDependencies": ["**/.env.*local"],
	"tasks": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**", ".next/**", "!.next/cache/**"]
		},
		"dev": {
			"cache": false,
			"persistent": true
		},
		"lint": {},
		"test": {},
		"typecheck": {},
		"clean": {
			"cache": false
		}
	}
}
```

### Pipeline Configuration

```json
{
	"tasks": {
		"build": {
			"dependsOn": ["^build"],
			"outputs": ["dist/**", ".next/**"]
		},
		"dev": {
			"cache": false
		},
		"lint": {
			"inputs": ["src/**/*.ts", "src/**/*.tsx"]
		},
		"test": {
			"inputs": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.test.ts"]
		}
	}
}
```

## Development Workflow

### Installing Dependencies

```bash
# Install all dependencies
pnpm install

# Install dependency for specific package
pnpm add lodash --filter @monorepo/utils

# Install dev dependency
pnpm add -D @types/lodash --filter @monorepo/utils
```

### Running Commands

```bash
# Run dev server for admin app
pnpm dev --filter @monorepo/admin

# Build all packages
pnpm build

# Run tests for all packages
pnpm test

# Lint specific package
pnpm lint --filter @monorepo/ui
```

### Cross-Package Dependencies

```json
// packages/ui/package.json
{
	"dependencies": {
		"@monorepo/theme": "workspace:*",
		"@monorepo/utils": "workspace:*"
	}
}
```

## Publishing Packages

### Changesets for Version Management

```bash
# Install changesets
pnpm add -D @changesets/cli

# Initialize
pnpm changeset init

# Create changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish
pnpm changeset publish
```

### Changeset Configuration

```js
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@monorepo/admin", "@monorepo/docs"]
}
```

## Best Practices

### 1. Dependency Management

- Use `workspace:*` for internal dependencies
- Keep peer dependencies for React, Next.js
- Minimize external dependencies in shared packages

### 2. Build Optimization

- Use Turborepo for build caching
- Configure proper output directories
- Use tree-shaking friendly exports

### 3. TypeScript Configuration

```json
// packages/ui/tsconfig.json
{
	"extends": "../../tsconfig.json",
	"include": ["src/**/*"],
	"exclude": ["dist", "node_modules"],
	"compilerOptions": {
		"declaration": true,
		"declarationMap": true,
		"outDir": "dist",
		"rootDir": "src"
	}
}
```

### 4. Testing Strategy

```json
// packages/ui/package.json
{
	"scripts": {
		"test": "vitest",
		"test:ui": "vitest --ui",
		"test:coverage": "vitest --coverage"
	}
}
```

### 5. Code Quality

- Shared ESLint configuration
- Prettier for consistent formatting
- Husky for pre-commit hooks
- Commitlint for conventional commits

## Common Patterns

### Internal Package Imports

```tsx
// apps/admin/components/button.tsx
import { Button } from '@monorepo/ui';
// ✅ Correct - uses workspace protocol

// ❌ Wrong - direct relative import
import { Button } from '../../../packages/ui/src/components/button';
```

### Conditional Exports

```json
// packages/ui/package.json
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.mjs",
			"require": "./dist/index.js"
		},
		"./button": {
			"types": "./dist/components/button/index.d.ts",
			"import": "./dist/components/button/index.mjs",
			"require": "./dist/components/button/index.js"
		}
	}
}
```

### Environment Variables

```env
# .env
# Shared across workspace
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# App-specific
NEXT_PUBLIC_API_URL=https://api.example.com
```

This monorepo structure provides excellent developer experience, build performance, and maintainability for complex admin template projects.
