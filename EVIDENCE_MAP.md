# EVIDENCE_MAP.md

## File Inventory & Evidence Sources

### Core Configuration Files
- [package.json](package.json) - Project dependencies and scripts
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - Monorepo package structure
- [next.config.ts](next.config.ts) - Next.js configuration with webpack aliases
- [tailwind.config.ts](tailwind.config.ts) - Tailwind CSS theme and safelist
- [convex.json](convex.json) - Convex backend configuration
- [i18nConfig.ts](i18nConfig.ts) - Internationalization settings
- [src/env.ts](src/env.ts) - Environment variable validation schema

### Application Structure
- [src/config/theme.config.ts](src/config/theme.config.ts) - Theme system defaults
- [src/config/pages.config.ts](src/config/pages.config.ts) - Route definitions and navigation
- [src/lib/auth.ts](src/lib/auth.ts) - BetterAuth configuration
- [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) - Root layout structure
- [src/app/[locale]/_providers.tsx](src/app/[locale]/_providers.tsx) - Context provider hierarchy

### Workspace Packages
- [packages/ui/package.json](packages/ui/package.json) - Radix UI component dependencies
- [packages/auth/src/lib/auth.ts](packages/auth/src/lib/auth.ts) - Auth package implementation
- [packages/navigation/src/react/](packages/navigation/src/react/) - Layout router components

## Dependency Graph Summary

### Frontend Stack
```
Next.js 16 + TypeScript
├── React 19.2.0
├── Tailwind CSS 3.4.17
├── Radix UI (components/ui)
├── Formik + Yup (forms)
├── react-i18next (i18n)
└── BetterAuth + Convex (auth/backend)
```

### Integrations
- **Calendar**: @fullcalendar/* (multiple packages)
- **Charts**: apexcharts, @tremor/react, reaviz
- **Maps**: react-simple-maps, d3-geo, d3-scale
- **Media**: wavesurfer.js, react-syntax-highlighter
- **Rich Text**: slate ecosystem (plate.disabled)

## API/Endpoint Index

### Authentication Routes [ref: src/app/api/auth/[...better-auth]/route.ts]
```
GET/POST /api/auth/* - BetterAuth endpoints
- Social provider callbacks (Google, GitHub)
- Email/password authentication
- Session management
```

### Page Structure [ref: src/config/pages.config.ts:22-50]
```
/ai - AI Dashboard and chat features
  /ai/dashboard - Main AI interface
  /ai/chat/* - Multimedia chat (photo, video, audio, code)
/crm - Customer relationship management
/project - Project management with kanban
/mail - Email interface
/ui - Component library documentation
/form - Form component examples
/integrated - Third-party integration examples
```

### Layout Router Components [ref: packages/navigation/src/react/]
```
AsideRouter -> Sidebar component per route
HeaderRouter -> Header component per route  
FooterRouter -> Footer component per route
```

## Configuration Matrix

| Key | Default | Source File | Lines |
|-----|---------|-------------|-------|
| Project Title | "Fyr" | theme.config.ts | 41 |
| Project Name | "React TypeScript Tailwind Admin & AI Chat Template" | theme.config.ts | 42 |
| Default Language | "en" | theme.config.ts | 43 |
| Theme Mode | "system" | theme.config.ts | 45 |
| Theme Color | "blue" | theme.config.ts | 46 |
| Color Palette | 8 colors (zinc, red, amber, lime, emerald, sky, blue, violet) | tailwind.config.ts | 49 |
| Session Duration | 604800 seconds (7 days) | src/lib/auth.ts | 16 |
| Rate Limit | 100 requests/10s | src/lib/auth.ts | 19-22 |
| Development Port | 3000 | package.json scripts | 6 |
| Convex Port | 3001 | env.ts validation | 6-7 |

## CI/CD Workflow Summary

**Current State**: No CI/CD workflows detected in repository.
- No .github/workflows/ directory found
- No GitHub Actions, GitLab CI, or similar configurations
- Manual deployment process currently required

**Dependencies for CI** (based on package.json):
- ESLint with TypeScript and React rules
- Prettier with Tailwind plugin
- Build optimization via Next.js

## Environment Variable Requirements

### Server Variables [ref: src/env.ts:5-13]
```bash
CONVEX_URL              # Convex backend URL (required, URL format)
BETTER_AUTH_SECRET      # Auth secret key (required, min 1 char)
BETTER_AUTH_URL         # Auth service URL (required, URL format)
GOOGLE_CLIENT_ID        # Google OAuth client ID (required)
GOOGLE_CLIENT_SECRET    # Google OAuth client secret (required)
GITHUB_CLIENT_ID        # GitHub OAuth client ID (required)
GITHUB_CLIENT_SECRET    # GitHub OAuth client secret (required)
```

### Client Variables [ref: src/env.ts:14-16]
```bash
NEXT_PUBLIC_CONVEX_URL  # Public Convex URL (required, URL format)
NEXT_PUBLIC_SITE_URL    # Public site URL (required, URL format)
```

## Hypotheses & Evidence Gaps

### High Confidence Evidence
- **Architecture**: Monorepo with pnpm workspaces confirmed
- **Tech Stack**: Next.js 16 + TypeScript + Tailwind CSS verified
- **Authentication**: BetterAuth with Convex integration implemented
- **Theme System**: Dynamic theming with 8 colors operational
- **Internationalization**: 4 locales (en, es, ar, tr) configured

### Medium Confidence Hypotheses  
- **Testing**: No test framework present but patterns suggest Jest + RTL would fit
- **Performance**: Build optimization present but no performance data
- **Monitoring**: No observability/configured monitoring detected
- **CI/CD**: Manual deployment currently, would benefit from automation

### Low Confidence Speculation
- **Production Usage**: Evidence suggests template/demo status vs production deployment
- **Development Workflow**: Multi-lockfile presence suggests tooling migration in progress
- **Plate Editor**: Disabled package suggests incomplete or experimental feature

## Component Architecture Evidence

### Modern Component Pattern [ref: packages/ui/src/react/]
```typescript
// Radix UI based with CVA
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
```

### Legacy Component Pattern [ref: src/components/ui/]
```typescript
// Custom implementations (being phased out)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariants;
  size?: TButtonSize;
}
```

### Page Structure Pattern [ref: src/app/[locale]/ui/button/]
```
/page.tsx          # Server component (SEO, data fetching)
/_client.tsx       # Client component (interactivity)  
/_md/             # Documentation/markdown files
```

## Security Posture Analysis

### Implemented Security
- ✅ Environment variable validation via Zod schemas
- ✅ Rate limiting on authentication endpoints (100/10s)
- ✅ Secure session configuration (7-day expiry, 1-day refresh)
- ✅ CORS and security headers via Next.js defaults
- ✅ TypeScript strict mode preventing runtime errors

### Security Gaps
- ❌ No CSP (Content Security Policy) configuration detected
- ❌ No CSRF protection beyond BetterAuth defaults
- ❌ No input validation schemas evidence beyond forms
- ❌ No security headers customization observed
- ❌ No dependency vulnerability scanning configured

## Performance Characteristics Evidence

### Build Optimizations [ref: next.config.ts]
```typescript
typedRoutes: true,                    // Type-safe routing
turbopack: {},                        // Turbopack configuration
webpack: { ... }                      // Custom aliasing and exclusions
```

### Bundle Analysis
- **Radix UI**: Tree-shakable component imports
- **Tailwind CSS**: Safelist for dynamic classes, PurgeCSS optimization
- **Icons**: SVG-to-React conversion pipeline
- **Internationalization**: Static locale generation

### Performance Indicators
- 🔄 Dynamic theme system (runtime color switching)
- 🔄 Real-time Convex data synchronization
- 📊 Heavy chart/calendar libraries (potential bundle size impact)
- 🖼 Rich media processing (AI chat features)