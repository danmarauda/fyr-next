# Repository Guidelines

## Project Overview

Fyr is a React TypeScript Next.js 14 admin template with AI chat capabilities. It features internationalization (i18n), theme management, comprehensive UI components, a flexible routing system, and uses a monorepo workspace architecture with Convex for backend functionality.

## Architecture & Monorepo Structure

### Workspace Packages (`packages/`)

- **@fyr/ui**: Radix UI-based component library with Tailwind styling
- **@fyr/theme**: Theme context and configuration (dark/light/system modes, dynamic color themes)
- **@fyr/navigation**: Router components (AsideRouter, HeaderRouter, FooterRouter) for layout management
- **@fyr/auth**: Authentication wrapper using Better Auth with Convex integration
- **@fyr/plate**: Rich text editor using Udecode/Plate with AI capabilities
- **@fyr/charts**: Chart components (package exists but content pending)
- **@fyr/forms**: Form components (package exists but content pending)

### Core Application Structure (`src/`)

```
src/
├── app/[locale]/           # Internationalized Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers and routing components
│   ├── _app.tsx          # App wrapper with dynamic font sizing
│   ├── _providers.tsx    # Context providers (Theme, Convex, Better Auth)
│   └── [pages]/          # Feature pages organized by domain
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, Modal, etc.)
│   ├── form/             # Form components (Input, Select, Validation, etc.)
│   ├── layouts/          # Layout components (Header, Footer, Sidebar, etc.)
│   ├── router/           # Routing components
│   └── icon/             # Icon components (Heroicons, Duotone, SVG)
├── config/               # Configuration files
│   ├── pages.config.ts   # Page definitions and navigation structure
│   └── theme.config.ts   # Theme settings and customization
├── routes/               # Route configuration components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── utils/                # Utility functions
├── mocks/                # Mock data and API responses
├── lib/                  # Core library files (auth, convex client)
├── templates/            # Template components for layouts and pages
└── locales/              # i18n translation files (en, es, ar, tr)
```

## Technology Stack

- **Framework**: Next.js 16 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom safelist for dynamic colors
- **Backend**: Convex (real-time database, functions, auth)
- **Authentication**: Better Auth with Convex integration, GitHub/Google OAuth
- **UI Components**: Radix UI primitives with custom theming
- **Rich Text**: Udecode/Plate editor with AI capabilities
- **Charts**: ApexCharts, Recharts, Tremor React
- **Form Management**: React Hook Form, Formik, Yup/Zod validation
- **Internationalization**: next-i18n-router with i18next
- **Icons**: Heroicons, Custom Duotone icons, SVG-to-React conversion
- **Package Manager**: pnpm with workspace support

## Build, Test, and Development Commands

### Core Development

```bash
pnpm dev          # Start development server with Node.js debugging on localhost:3000
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm prettier:fix # Format code with Prettier
pnpm icon         # Generate React components from SVG icons in SvgIcons folder
```

### Package-Specific Commands

```bash
# Workspace packages can be developed individually
cd packages/ui && pnpm dev
cd packages/theme && pnpm dev
# etc.
```

### Testing & Quality

The project uses ESLint with comprehensive TypeScript, React, and accessibility rules. Key configurations:

- Flat config format with TypeScript support
- React Hooks exhaustive deps enforcement
- Arrow function component definitions required
- Prettier formatting enforced (tabs, 100 char width)
- Custom rules for component patterns and prop spreading

### Environment Setup

Environment variables are managed with `@t3-oss/env-nextjs` and Zod validation:

- `.env.development`, `.env.production`, `.env.staging` for different environments
- `CONVEX_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` for backend
- `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET` for OAuth
- `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_SITE_URL` for client-side

## Code Patterns & Conventions

### Component Architecture

#### UI Components

- TypeScript interfaces for all props with descriptive naming
- Tailwind CSS for styling with theme integration
- Support for custom colors via TColors type system (zinc, red, amber, lime, emerald, sky, blue, violet)
- Consistent prop interfaces: `color`, `colorIntensity`, `rounded`, `borderWidth`, `size`, `variant`
- Forward ref support for all interactive components
- Classname merging with `clsx` or `classnames`

#### Layout System

Dynamic layout routing based on path:
- **AsideRouter**: Controls sidebar rendering per route
- **HeaderRouter**: Manages header component per route  
- **FooterRouter**: Controls footer component per route
- Each router can render different components or `null` for routes that don't need that layout element

#### Page Structure Pattern

Pages follow consistent server/client component patterns:
- `page.tsx`: Server component for data fetching and SEO
- `_client.tsx`: Client component for interactivity
- `_partial/`: Reusable page-specific components
- `_common/`: Shared components across similar pages
- Optional i18n wrapper with `TranslationsProvider`

### Theme System

Dynamic theming with multiple dimensions:
- **Color modes**: Dark/Light/System via context
- **Color themes**: 8 predefined schemes (zinc, red, amber, lime, emerald, sky, blue, violet)
- **Customizable properties**: Rounded corners, border widths, transitions
- **Dynamic font sizing**: 12-18px range
- **Tailwind safelist**: Ensures dynamic classes aren't purged

Theme configuration centralized in `src/config/theme.config.ts` and `packages/theme/src/lib/theme.config.ts`.

### Internationalization

- **Locale-based routing**: `/[locale]/path` with static generation
- **Supported locales**: en, es, ar, tr (with RTL support)
- **Dynamic imports** for translation resources
- **Translation files**: JSON format in `src/locales/[locale]/translation.json`
- **Automatic text direction detection** for RTL languages

### Icons

Three icon systems available:
- **Heroicons**: Standard icon library (React components)
- **Duotone Icons**: Custom dual-color icons with enhanced visual appeal
- **SVG-to-React**: Custom SVG conversion via `pnpm icon` script

Icons are fully typed with TypeScript for autocomplete support.

## Development Guidelines

### Adding New Pages

1. Create page structure in `src/app/[locale]/[page-name]/`
2. Implement server component in `page.tsx`
3. Create client component in `_client.tsx` (if interactivity needed)
4. Add page configuration to `src/config/pages.config.ts`
5. Update routing components if custom layout needed
6. Add translation keys to `src/locales/*/translation.json`

### Component Development

1. Follow existing component patterns in `src/components/ui/`
2. Use TypeScript interfaces for all props with descriptive names
3. Integrate with theme system via color types and utility hooks
4. Include responsive design considerations
5. Test with multiple themes and color schemes
6. Use forwardRef for interactive components
7. Prefer Radix UI primitives for complex interactions

### Form Development

- Use React Hook Form for new forms, Formik for legacy
- Validation with Yup or Zod schemas
- Consistent field wrapper patterns via `FieldWrap` component
- Rich text editing with Plate editor for complex inputs

### Theme Customization

1. Add new colors to `tailwind.config.ts` safelist (patterns are restrictive)
2. Update `TColors` type in `src/types/colors.type.ts`
3. Test dynamic color generation across all variants
4. Update theme config defaults if needed

### Package Development

1. Each workspace package has its own `package.json` with `workspace:*` dependencies
2. Use relative imports between packages (`@fyr/ui`, `@fyr/theme`, etc.)
3. Maintain consistent TypeScript and ESLint configuration across packages
4. Test package integration in main application

## Important Gotchas

### Build System

- **Multiple lockfiles exist** (package-lock.json, pnpm-lock.yaml, bun.lock) - use pnpm preferentially
- **ESLint ignored during builds** - handle separately with `pnpm lint`
- **Custom webpack config** in `next.config.ts` for markdown files and radix-ui imports
- **Turbopack disabled** due to stability issues in current config

### Styling Constraints

- **Tailwind safelist is restrictive** - only allows specific color combinations
- **Dynamic classes must be in safelist** or they'll be purged
- **Custom CSS should be avoided** - use Tailwind utilities
- **Dark mode uses class strategy** - not `prefers-color-scheme`

### Convex Integration

- **Environment variables required** for Convex URL and auth secrets
- **Schema-driven development** - all data operations must match `convex/schema.ts`
- **Real-time updates** - components automatically re-render with data changes
- **Authentication integration** - Better Auth connects with Convex user system

### Internationalization

- **Static generation required** - all locales must be pre-built
- **RTL layout considerations** - test with Arabic locale
- **Translation keys must exist** in all locale files
- **Middleware handles routing** - see `middleware.ts`

### Component Gotchas

- **Arrow functions required** for component definitions (ESLint rule)
- **ForwardRef needed** for proper DOM element access
- **Specific prop spreading exceptions** defined in ESLint config
- **Icon components auto-generated** - don't manually edit files in `src/components/icon/svg-icons/`

## Security & Configuration

- **Environment variables validated** at runtime with Zod schemas
- **Authentication secrets** required in production
- **OAuth configuration** needed for GitHub/Google login
- **CORS considerations** for Convex API calls
- ** never commit secrets** to repository

## Package Management

- **Use pnpm** for consistency with workspace setup
- **Workspace dependencies** use `workspace:*` notation
- **Peer dependencies** managed by Next.js for React and related packages
- **Security overrides** in package.json for vulnerable dependencies
- **Custom resolutions** for d3-color, postcss, nth-check, punycode

This documentation covers the essential patterns and conventions needed for effective development in this complex, feature-rich admin template with AI capabilities.