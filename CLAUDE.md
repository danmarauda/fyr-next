# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ALIAS is a React TypeScript Tailwind admin template with AI chat capabilities built on Next.js 16. It features internationalization (i18n), theme management, comprehensive UI components, and a flexible routing system with customizable layouts.

## Development Commands

### Core Development

```bash
npm run dev          # Start development server with Node.js debugging on localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run prettier:fix # Format code with Prettier
npm run icon         # Generate React components from SVG icons in SvgIcons folder
```

### Testing & Quality

The project uses ESLint with TypeScript, React, and Prettier configurations. Key rules include:

- React Hooks exhaustive deps enforcement
- Arrow function component definitions required
- Prettier formatting enforced
- TypeScript strict mode with custom ESLint rules

## Architecture

### High-Level Structure

The project follows Next.js 14 App Router architecture with internationalization support:

```
src/
├── app/[locale]/           # Internationalized pages and layouts
│   ├── layout.tsx         # Root layout with providers and routing components
│   ├── _app.tsx          # App wrapper with dynamic font sizing
│   ├── _providers.tsx    # Context providers (Theme, NextAuth)
│   └── [pages]/          # Feature pages organized by domain
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, Modal, etc.)
│   ├── form/             # Form components (Input, Select, Validation, etc.)
│   ├── layouts/          # Layout components (Header, Footer, Sidebar, etc.)
│   └── router/           # Routing components
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
└── locales/              # i18n translation files
```

### Key Architectural Patterns

#### Layout System

The application uses a flexible layout system with three main routers:

- **AsideRouter**: Controls sidebar/aside component rendering per route
- **HeaderRouter**: Manages header component per route
- **FooterRouter**: Controls footer component per route

Each router can render different components based on the current path, or render `null` for routes that don't need that layout component.

#### Context Architecture

```tsx
// Provider hierarchy in layout.tsx
<Providers>
	<ThemeContextProvider>
		<NextAuthProvider>{children}</NextAuthProvider>
	</ThemeContextProvider>
</Providers>
```

#### Page Structure Pattern

Pages follow a consistent client/server component pattern:

- `page.tsx`: Server component for data fetching and SEO
- `_client.tsx`: Client component for interactivity
- Optional i18n wrapper with `TranslationsProvider`

### Theme System

The theme system supports:

- **Dark/Light/System modes** via context
- **Dynamic color themes** (8 predefined color schemes: zinc, red, amber, lime, emerald, sky, blue, violet)
- **Customizable UI properties**: rounded corners, border widths, transitions
- **Dynamic font sizing** (12-18px range)
- **Tailwind CSS safelist** for dynamic color generation

Theme configuration is centralized in `src/config/theme.config.ts`.

### Component Architecture

#### UI Components

Base components in `src/components/ui/` follow consistent patterns:

- TypeScript interfaces for all props
- Tailwind CSS for styling with theme integration
- Support for custom colors via TColors type system
- Responsive design considerations

#### Form Components

Form system includes:

- Validation with Yup integration
- Formik form management
- Consistent field wrapper patterns
- Rich text editing with Slate.js

#### Integrated Components

Third-party integrations include:

- **FullCalendar** for calendar functionality
- **ApexCharts** for data visualization
- **React Simple Maps** for geographical data
- **WaveSurfer** for audio visualization
- **React Select** for advanced select inputs
- **React Date Range** for date selection

### Internationalization (i18n)

The project uses next-i18n-router with:

- **Locale-based routing**: `/[locale]/path`
- **Static generation** for all locales via `generateStaticParams`
- **Dynamic imports** for translation resources
- **RTL support** with automatic text direction detection

### Icon System

Two icon systems are available:

- **Heroicons**: Standard icon library
- **Duotone Icons**: Custom dual-color icons
- **SVG-to-React**: Automated conversion via `npm run icon` script

Icons are typed with TypeScript for autocomplete support.

## Configuration Files

### ESLint Configuration (`eslint.config.mjs`)

- Flat config format with TypeScript support
- React, React Hooks, and accessibility rules
- Prettier integration with error enforcement
- Custom rules for component patterns

### Tailwind Configuration (`tailwind.config.ts`)

- Custom color palette limited to 8 theme colors
- Safelist patterns for dynamic class generation
- Typography plugin integration
- Dark mode class-based switching
- Custom font family (Poppins) integration

### Next.js Configuration (`next.config.js`)

- Raw loader for Markdown files
- ESLint ignored during builds (handled separately)
- Webpack customization for file processing

## Page Configuration System

Pages are defined in `src/config/pages.config.ts` with a hierarchical structure:

```typescript
export const appPages = {
	aiAppPages: {
		id: 'aiApp',
		to: '/ai',
		text: 'AI',
		icon: 'HeroRocketLaunch',
		subPages: {
			aiDashboardPage: {
				/* ... */
			},
			chatPages: {
				/* ... */
			},
		},
	},
};
```

This configuration drives navigation menus, breadcrumbs, and routing throughout the application.

## Development Guidelines

### Adding New Pages

1. Create page structure in `src/app/[locale]/[page-name]/`
2. Implement server component in `page.tsx`
3. Create client component in `_client.tsx`
4. Add page configuration to `pages.config.ts`
5. Update routing components if custom layout needed

### Theme Customization

1. Add new colors to `tailwind.config.ts` safelist
2. Update `TColors` type in `src/types/colors.type.ts`
3. Test dynamic color generation
4. Update theme config defaults if needed

### Component Development

1. Follow existing component patterns in `src/components/ui/`
2. Use TypeScript interfaces for all props
3. Integrate with theme system via color types
4. Include responsive design considerations
5. Test with multiple themes and color schemes

### Icon Management

1. Add SVG files to `SvgIcons/` directory
2. Run `npm run icon` to generate React components
3. Icons are automatically typed and available for import
4. Use PascalCase naming convention

## Important Notes

- **Node.js Version**: Requires Node.js 16+ for Next.js 14 compatibility
- **Package Manager**: Supports npm, yarn, or pnpm
- **Environment**: Uses multiple `.env` files for different environments
- **Authentication**: NextAuth.js integration requires NEXTAUTH_SECRET
- **Fonts**: Poppins font family with multiple weights and styles
- **Build**: Production builds are optimized for performance with Next.js
- **Deployment**: Designed for Vercel deployment (see README for details)

The template prioritizes developer experience with comprehensive TypeScript support, consistent patterns, and flexible customization options.
