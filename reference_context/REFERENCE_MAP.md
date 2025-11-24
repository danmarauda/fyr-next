# Contextual Expansion Reference Map

## Overview

This document maps the Fyr Next.js admin template (construction project management) to external reference implementations and best practices collected during the contextual expansion operation.

## Curation Strategy: Mutate

Prioritizing resources that solve similar problems but use newer libraries, different patterns, or alternative architectures to enhance the current template.

## Core Technology Stack Mapping

### Framework & Architecture

| Local Implementation               | External References                                                                                             | Innovation Opportunities                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Next.js 16 + React 19 + App Router | `victot0121/construction-dashboard` (Next.js 14), `hamed-hasan/build-project-management-dashboard` (Next.js 14) | Upgrade to Next.js 15 App Router patterns, explore React Server Components for data fetching |
| Convex (real-time database)        | `evanch98/miro-clone-nextjs` (Convex + Liveblocks), Convex documentation                                        | Advanced ents patterns, optimistic updates, TanStack Query integration                       |
| Better Auth integration            | Convex Better Auth docs, `evanch98/miro-clone-nextjs`                                                           | Multi-organization patterns, advanced session management                                     |

### UI & Styling

| Local Implementation               | External References                                                                                                      | Innovation Opportunities                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Custom Radix UI components         | `hamed-hasan/build-project-management-dashboard` (Ant Design), `victot0121/construction-dashboard` (Chart.js + Recharts) | Material UI Toolpad Core for advanced dashboard components, shadcn/ui patterns |
| Tailwind CSS + custom theme system | All references use Tailwind                                                                                              | Advanced theme patterns, CSS-in-JS alternatives (styled-components, emotion)   |

### State Management & Data

| Local Implementation           | External References                                               | Innovation Opportunities                                                 |
| ------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Convex ents with relationships | `evanch98/miro-clone-nextjs` (simple schema), Convex schema docs  | Advanced relationship patterns, indexing strategies, search optimization |
| React Query patterns           | `hamed-hasan/build-project-management-dashboard` (React Query v3) | TanStack Query v5 with Convex integration, advanced caching strategies   |

## Domain-Specific Feature Mapping

### Construction Project Management

| Local Feature                               | External Reference                                               | Enhancement Opportunities                                          |
| ------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Project tracking (status, progress, budget) | `victot0121/construction-dashboard` ProjectOverview component    | Real-time progress updates, advanced budget tracking with charts   |
| Task management with dependencies           | `hamed-hasan/build-project-management-dashboard` task management | Drag-and-drop kanban boards, Gantt chart integration               |
| Resource management (equipment, labor)      | `victot0121/construction-dashboard` ResourceManagement           | Equipment tracking with GPS, resource allocation algorithms        |
| Safety incident reporting                   | Local implementation unique                                      | Add photo upload, location tracking, automated reporting workflows |

### Real-Time Features

| Local Feature                  | External Reference                                 | Enhancement Opportunities                                         |
| ------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------- |
| Convex real-time subscriptions | `evanch98/miro-clone-nextjs` (Liveblocks + Convex) | Liveblocks for advanced collaborative features, real-time cursors |
| Dashboard updates              | Convex optimistic updates docs                     | Advanced optimistic UI patterns, conflict resolution              |

### Authentication & Organization

| Local Feature                    | External Reference                          | Enhancement Opportunities                                    |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Better Auth + Convex integration | `evanch98/miro-clone-nextjs` org management | Advanced role-based permissions, team collaboration features |
| Multi-organization support       | Local implementation advanced               | Invitation workflows, organization switching UX              |

## Architecture Pattern Mapping

### Component Architecture

```
Local: Custom component library (@fyr/ui, @fyr/theme, @fyr/navigation)
References:
- victot0121/construction-dashboard: Simple functional components
- hamed-hasan/build-project-management-dashboard: Ant Design integration
- evanch98/miro-clone-nextjs: shadcn/ui patterns

Opportunities:
- Adopt shadcn/ui for consistency
- Implement design system tokens
- Add component composition patterns
```

### Data Layer Architecture

```
Local: Convex ents with complex relationships
References:
- Convex schema docs: Advanced indexing and search
- evanch98/miro-clone-nextjs: Simple but effective schema design

Opportunities:
- Implement advanced search indexes
- Add vector search for documents
- Optimize query performance with better indexing
```

### Real-Time Patterns

```
Local: Basic Convex subscriptions
References:
- evanch98/miro-clone-nextjs: Liveblocks integration
- Convex optimistic updates docs

Opportunities:
- Add collaborative editing features
- Implement real-time presence indicators
- Advanced conflict resolution strategies
```

## File-to-Reference Mapping

### Core Application Files

| Local File                    | Reference Implementation                               | Key Insights                                  |
| ----------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `convex/schema.ts`            | `reference_context/miro-clone-nextjs/convex/schema.ts` | Simpler schema design with effective indexing |
| `src/app/[locale]/layout.tsx` | `reference_context/miro-clone-nextjs/app/layout.tsx`   | Provider patterns, middleware integration     |
| `src/components/layouts/`     | `reference_context/construction-dashboard/Components/` | Component organization patterns               |

### Feature-Specific Files

| Local Feature           | Reference Implementation                                                   | Enhancement Ideas                                |
| ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| Project management      | `reference_context/build-project-management-dashboard/src/pages/projects/` | Drag-and-drop task management, project filtering |
| Dashboard components    | `reference_context/construction-dashboard/Components/`                     | Chart integrations, progress visualizations      |
| Real-time collaboration | `reference_context/miro-clone-nextjs/app/board/`                           | Liveblocks patterns, collaborative editing       |

## Innovation Opportunities Identified

### 1. Advanced Real-Time Features

- **Liveblocks Integration**: Add collaborative editing for project plans and task assignments
- **Real-Time Presence**: Show who's currently viewing/editing projects
- **Optimistic Updates**: Improve UX with instant UI feedback

### 2. Enhanced UI/UX Patterns

- **Advanced Charts**: Integrate more sophisticated data visualizations
- **Drag-and-Drop Interfaces**: Implement kanban boards for task management
- **Mobile-First Responsive Design**: Improve mobile experience for field workers

### 3. Data Architecture Improvements

- **Advanced Search**: Implement full-text search across projects and documents
- **Analytics Integration**: Add real-time project analytics and reporting
- **File Management**: Enhanced document upload and management with preview

### 4. Developer Experience

- **Component Library**: Standardize on shadcn/ui for better consistency
- **Type Safety**: Enhance TypeScript usage with stricter configurations
- **Testing Patterns**: Add comprehensive testing strategies

## Recommended Implementation Priority

1. **High Priority**: Real-time collaboration features (Liveblocks integration)
2. **High Priority**: Advanced dashboard visualizations (charts, analytics)
3. **Medium Priority**: Enhanced search and filtering capabilities
4. **Medium Priority**: Mobile responsiveness improvements
5. **Low Priority**: Component library standardization

## External Resources Summary

### Cloned Repositories

- `reference_context/construction-dashboard/`: Basic construction dashboard with charts
- `reference_context/build-project-management-dashboard/`: Project management with drag-and-drop
- `reference_context/miro-clone-nextjs/`: Real-time collaborative whiteboard

### Indexed Documentation

- Convex schema patterns and philosophy
- Convex React client documentation
- Advanced dashboard implementation guides

### Key Patterns to Adopt

1. Liveblocks for real-time collaboration
2. Advanced Convex schema design patterns
3. Optimistic update implementations
4. TanStack Query integration patterns
5. Advanced component composition patterns

This reference map provides a comprehensive guide for enhancing the Fyr admin template with modern patterns and best practices from the broader React/Next.js ecosystem.
