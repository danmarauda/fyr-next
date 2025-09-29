# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` using Next.js App Router.
    - Pages/layouts: `src/app/` (localized under `src/app/[locale]`).
    - UI: `src/components/` (PascalCase components), `src/components/ui` for primitives.
    - State/utils: `src/hooks/`, `src/utils/`, `src/context/`.
    - Data & config: `src/constants/`, `src/config/`, `src/routes/`.
    - Styling: `src/app/styles`, Tailwind config in `tailwind.config.ts` and `src/tailwindcss/`.
    - i18n: `src/locales/*`, `i18n.ts`, `middleware.ts`.
    - Assets: `public/`, `src/assets/`.

## Build, Test, and Development Commands

- `npm run dev`: Start Next.js dev server with inspector.
- `npm run build`: Production build (`.next/`).
- `npm start`: Serve production build.
- `npm run lint`: Lint with ESLint; `npm run lint:fix` to autofix.
- `npm run prettier:fix`: Format with Prettier (+ Tailwind plugin).
- `npm run icon`: Convert `SvgIcons/` into React icons at `src/components/icon/svg-icons`.

Note: Use one package manager consistently. This repo includes multiple lockfiles; prefer `npm` or `pnpm` and remove others in your branch.

## Coding Style & Naming Conventions

- TypeScript, 2‑space indent, semicolons via Prettier.
- Components: PascalCase file and export names (e.g., `UserCard.tsx`).
- Hooks: camelCase starting with `use` (e.g., `useStickyHeader.ts`).
- Types/interfaces: PascalCase in `src/types/`.
- Tailwind classes in `className`; avoid ad‑hoc CSS.
- Run `npm run lint` and `npm run prettier:fix` before PRs.

## Testing Guidelines

- No test runner is bundled. For unit tests, add Jest + React Testing Library.
- Suggested layout: `src/**/__tests__/*.(test|spec).tsx`.
- Aim for critical path coverage (routing, forms, auth, i18n switches).

## Commit & Pull Request Guidelines

- Commits: follow Conventional Commits (e.g., `feat: add Kanban drag‑drop`).
- PRs: include summary, screenshots for UI, linked issues, and notes on i18n/RTL impact.
- CI expectations: build passes, lint/format clean, no unused lockfiles, no secrets.

## Security & Configuration Tips

- Environment: `.env.local` for dev, `.env.production` for deploy. Never commit secrets.
- Review `next.config.js` and `eslint.config.mjs` when adding dependencies.
- i18n: update `src/locales/*` and `i18nConfig.ts` when adding keys.
