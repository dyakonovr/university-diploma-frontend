# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Work Rules
- Don't needed verify result, i will do it. I don't need dianostic after end
- Don't run any commands like `npm run build`, `npm run dev` etc.
- Write jsdoc, if it needed (with example of usage and return values)
- For complex tasks or modules with hard logic (or i promise it to you) we can create instruction. Place it into @/docs/specs/ `name-of-module.md`. If feature spec already exists and you fix/improve this module, need to update the spec

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Preview production build**: `npm run preview`
- **Format & lint**: `npm run format` (runs Prettier then ESLint with --fix)
- **Clean Nuxt cache**: `npm run clean`
- **Restart dev**: `npm run restart` (clean + dev)
- **Prepare Nuxt**: `npm run postinstall` (runs `nuxt prepare`)

Pre-commit hooks (Husky + lint-staged) auto-run Prettier and ESLint on staged files.

No test framework is configured.

## Architecture

**Framework**: Nuxt 4 (Vue 3) with TypeScript. SSR enabled globally, disabled for `/account/**` routes.

**Auto-imports disabled**: `imports.scan` and `components.dirs` are turned off in nuxt.config.ts — all imports must be explicit.

### Domain-Driven Structure

The app follows a feature-first architecture under `app/domain/`. Each domain (artifact, flow, model, news, social-account, social-post, user, etc.) is self-contained with a consistent internal structure:

```
domain/[feature]/
├── api/           # API client functions using the shared request utility
├── models/        # TypeScript types/interfaces
├── constants/     # Domain-specific constants
├── services/      # Business logic and validation
├── mappers/       # Data transformation between API and domain models
├── usecases/      # High-level operations composing API + business logic
├── composables/   # Vue composables for this domain
├── stores/        # Pinia stores (when needed)
├── ui/            # Vue components for this domain
└── view-models/   # Data structures for UI consumption
```

### Shared Layer (`app/shared/`)

Cross-cutting utilities, composables, types, stores, and error classes. Key files:
- `utils/core/request.client.ts` — Central HTTP client wrapping `$fetch` with auto 401 token refresh, request queue, abort signal support, and cookie-based auth
- `stores/` — Global Pinia stores (theme, sidebar-menu, requests-queue)
- `composables/` — Reusable composables (useCustomToast, useDeleteItem, useDialogControl, useCacheRequest, etc.)

### API Layer

All API calls go through `request()` from `shared/utils/core/request.client.ts`. It requires a `baseUrl` key (AUTH, MODEL_PROVIDER, FLOW, SUBSCRIPTION, NEWS, SOCIAL_ACCOUNT, SOCIAL_POST) mapped to env vars. URL prefix is always `/api/v1`.

### Other Key Directories

- `app/components/ui/` — Reusable UI component library (Dialog, Tabs, Table, Tooltip, etc.)
- `app/components/pages/` — Page-specific component compositions
- `app/middleware/` — Route middleware (auth, admin)
- `app/layouts/` — Nuxt layouts (account, auth)
- `app/plugins/` — Theme and toast initialization
- `i18n/locales/` — Translations (ru.json, en.json); default locale is Russian, strategy is `no_prefix`

## Code Conventions

- **Vue SFC block order**: `<template>`, `<script>`, `<style>` (enforced by ESLint)
- **Component names in templates**: kebab-case (enforced: `vue/component-name-in-template-casing`)
- **One attribute per line** in templates (enforced: `vue/max-attributes-per-line`)
- **Import sorting**: `simple-import-sort` plugin (auto-sorted by ESLint)
- **Styling**: SCSS with BEM-like conventions; global styles in `app/assets/styles/`
- **Semicolons**: required; **Quotes**: single
- **No console.log in production** (`no-console` rule is `error` in production)
