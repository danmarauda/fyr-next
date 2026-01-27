# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ALIAS is a Next.js 16 admin template with AI chat capabilities, Convex real-time backend, and BetterAuth authentication. Uses pnpm workspaces with packages for auth, navigation, and theme. Supports i18n (en, es, ar, tr) with RTL.

## Development Commands

```bash
# Core development
pnpm dev              # Start dev server with Node.js debugging (localhost:3000)
pnpm build            # Production build (TypeScript errors ignored)
pnpm start            # Start production server

# Code quality
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm prettier:fix     # Format with Prettier
pnpm biome:check      # Biome linting and formatting check
pnpm biome:fix        # Biome auto-fix
pnpm biome:format     # Biome format only

# Utilities
pnpm icon             # Generate React components from SVGs in SvgIcons/

# Backend (run in separate terminal)
npx convex dev        # Start Convex development server
```

## Architecture

### Monorepo Structure

```
packages/
├── auth/             # BetterAuth configuration
├── navigation/       # Route-based layout routers (AsideRouter, HeaderRouter, FooterRouter)
└── theme/            # Theme context system

src/
├── app/[locale]/     # Next.js App Router pages with i18n
├── components/
│   ├── ui/           # Base UI components (Button, Card, Modal, etc.)
│   ├── form/         # Formik/Yup form components
│   ├── layouts/      # Layout components (Header, Footer, Sidebar)
│   └── router/       # Route-specific component renderers
├── config/
│   ├── pages.config.ts    # Page definitions driving navigation
│   └── theme.config.ts    # Theme defaults
├── routes/           # AsideRoutes, HeaderRoutes, FooterRoutes definitions
├── context/          # ThemeContext provider
├── mocks/            # Mock data for development
└── locales/          # Translation JSON files per locale

convex/
├── schema.ts         # Database schema (convex-ents)
├── auth.ts           # BetterAuth + Convex integration
└── http.ts           # HTTP endpoint handlers
```

### Page Pattern

Pages use server/client component separation:

- `page.tsx` - Server component for data fetching, SEO, static params
- `_client.tsx` - Client component with `'use client'` directive for interactivity

### Layout Router System

Three routers control per-route layout rendering:

- **AsideRouter**: Renders sidebar based on current path from `routes/asideRoutes.ts`
- **HeaderRouter**: Renders header based on path from `routes/headerRoutes.ts`
- **FooterRouter**: Renders footer based on path from `routes/footerRoutes.ts`

Routes return `null` for pages that don't need that layout component.

### Current Authentication State

**Note:** The codebase currently has mock auth implementations for local development:

- `src/lib/auth.ts` - Mock Session/Auth types
- `src/lib/auth-client.ts` - Mock authClient with stubbed methods (useSession, signIn, signUp, signOut)

Real BetterAuth implementation exists in `convex/auth.ts` with:
- Social providers: Google (configured)
- Session: 30-day expiration, 15-day update age
- Database adapter uses convex-ents schema

### Database Schema (Convex)

Key tables in `convex/schema.ts`:

**Auth tables:** user, session, account, verification, organization, member, invitation, jwks

**Project management tables (North East Link domain):**
- projects - Construction projects with location, budget, status
- tasks - Task tracking with dependencies and time estimates
- resources - Materials, equipment, labor tracking
- equipment - Equipment management with rates and status
- siteActivities - Site activity logs with photos and weather
- safetyIncidents - Safety incident tracking and resolution
- documents - File/document management

**System tables:** notifications, analytics, auditLog, subscriptions, plans, jobs, rateLimits

Uses `convex-ents` for relational edges between tables.

## Key Configuration

### Environment Variables

Required in `.env.local`:

```bash
CONVEX_URL=http://localhost:3001
NEXT_PUBLIC_CONVEX_URL=http://localhost:3001
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://localhost:3000
SITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Theme System

8 color themes: zinc, red, amber, lime, emerald, sky, blue, violet. Dark/Light/System modes. Dynamic font sizing (12-18px). Theme settings stored in localStorage.

### i18n

Locales configured in `i18nConfig.ts`: en, es, ar, tr. Translation files in `src/locales/[locale]/translation.json`. RTL support automatic via `dir()` from i18next.

## Adding Features

### New Page

1. Create `src/app/[locale]/[feature]/page.tsx` (server component)
2. Create `src/app/[locale]/[feature]/_client.tsx` (client component)
3. Add to `src/config/pages.config.ts` for navigation
4. Add route entry in `src/routes/` if custom layout needed
5. Add translations to all locale files

### New Convex Function

1. Add schema in `convex/schema.ts` using `defineEnt`
2. Create query/mutation in `convex/[feature].ts`
3. Functions auto-generate types via `npx convex dev`

## Known Issues

- `typescript: { ignoreBuildErrors: true }` in next.config.ts - type errors don't fail builds
- `packages/plate` and `packages/ui` excluded via webpack ignore-loader
- React Compiler disabled for stability
- Mock auth in `src/lib/` needs to be replaced with real Convex auth client for production
