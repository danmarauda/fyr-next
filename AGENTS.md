# Fyr React Admin Template - Agent Guidelines

## Development Commands

```bash
pnpm dev          # Start dev server on localhost:3000 with Node.js debugging
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (required before commits)
pnpm lint:fix     # Auto-fix ESLint issues
pnpm prettier:fix # Format code with Prettier
pnpm biome:check  # Alternative linting with Biome
pnpm biome:fix    # Auto-fix Biome issues
pnpm biome:format # Format code with Biome
pnpm icon         # Generate React components from SVG icons
```

## Project Structure & Configuration

### Monorepo Setup

- **pnpm workspaces** with packages in `packages/*`
- Workspace packages: `@alias/ui`, `@alias/theme`, `@alias/navigation`, `@alias/auth`, `@alias/plate`
- Path aliases: `@/*` (src), `@convex/*` (convex), `@alias/*` (packages/\*/src)

### TypeScript Configuration

- **Strict null checks** enabled, but general strict mode disabled
- **ES2022 target** with ESNext modules
- **Bundler resolution** for modern module handling
- **React JSX transform** enabled
- **Incremental compilation** with source maps

### CI/CD Pipeline (GitLab)

- **Multi-stage**: validate → test → build → deploy
- **Environments**: dev → staging → production (Vercel)
- **Quality gates**: ESLint, typecheck, build verification
- **Security**: Dependency scanning and audit

## Code Style Requirements

### Component Patterns

- **Arrow functions only** for component definitions (ESLint enforced)
- Use **forwardRef** for all interactive components
- TypeScript interfaces for all props with descriptive naming
- Consistent prop interfaces: `color`, `colorIntensity`, `rounded`, `borderWidth`, `size`, `variant`
- Classname merging with `classnames` library

### Import Organization

- React imports first: `import React, { forwardRef } from 'react';`
- External libraries second
- Internal imports last with `@/` alias
- Type imports grouped separately when needed

### Formatting Rules

- **Tabs** (not spaces) with 4 tab width
- 100 character line width
- Single quotes for strings
- Trailing commas required
- Semicolons required
- LF line endings

### TypeScript Conventions

- Interface names prefixed with `I` (e.g., `IButtonProps`)
- Type names prefixed with `T` (e.g., `TColors`, `TButtonSize`)
- Use descriptive prop names with camelCase
- Export types that are used externally

### Styling Requirements

- **Tailwind CSS only** - no custom CSS
- Dynamic classes must be in safelist or they'll be purged
- Use theme color types: `zinc`, `red`, `amber`, `lime`, `emerald`, `sky`, `blue`, `violet`
- Support dark mode with `dark:` prefixes
- RTL support with `ltr:` and `rtl:` prefixes

### File Structure Patterns

- Pages: `page.tsx` (server), `_client.tsx` (client), `_partial/` (reusable)
- Components: Default export with displayName set
- Hooks: Custom hooks in `hooks/` directory with `use` prefix
- Types: Centralized in `types/` directory

### Critical Gotchas

- **No testing framework** configured - tests not available
- Use **pnpm** preferentially (multiple lockfiles exist)
- Environment variables validated with Zod schemas
- Never commit secrets to repository
- Icon components auto-generated - don't manually edit `src/components/icon/svg-icons/`
- **React 19** with new JSX transform
- **Convex** for backend with real-time capabilities

### Environment Variables (Zod Validated)

- **Server**: CONVEX_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, GITHUB_CLIENT_ID/SECRET, GOOGLE_CLIENT_ID/SECRET
- **Client**: NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_SITE_URL
- Environment files: `.env.development`, `.env.production`, `.env.staging`

### Workspace Packages

- **@alias/ui**: Radix UI components with Tailwind (40+ components)
- **@alias/theme**: Theme context, dark/light modes, color schemes
- **@alias/navigation**: Router components for layout management
- **@alias/auth**: Better Auth wrapper with Convex integration
- **@alias/plate**: Rich text editor with AI capabilities (Udecode/Plate)

### Additional Tooling

- **Webpack config**: Custom rules for markdown files and radix-ui imports
- **Turbopack**: Enabled with custom rules for markdown processing
- **Tailwind safelist**: Restricted to specific color combinations (zinc, red, amber, lime, emerald, sky, blue, violet)
- **Font**: Poppins as primary font family

### Quality Gates

- Always run `pnpm lint` before committing
- ESLint enforces React Hooks exhaustive deps
- Prettier formatting is enforced via ESLint
- Biome available as alternative linter/formatter
- TypeScript strict null checks enabled
- GitLab CI validates linting and builds before deployment
