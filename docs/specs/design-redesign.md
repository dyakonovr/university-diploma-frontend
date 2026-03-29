# Design Redesign — Business Dashboard

> Status: Phase 1–2 implemented
> Date: 2026-03-29

## Problem

The current UI was borrowed from a content-generation SaaS. It uses indigo gradients, playful accents, and a sidebar that feels empty outside workspace context. The app is used by **executives and managers** — it needs to feel like a professional business tool (Linear, Notion, Jira), not a consumer product.

Key pain points:
1. **Empty sidebar** — outside a workspace, only 3–4 items visible; feels unfinished
2. **Consumer-app aesthetics** — gradient backgrounds, bright indigo, amber accents look flashy, not serious
3. **No visual hierarchy** — all pages use the same flat layout with no density or information priority

---

## Design Direction

**Reference:** Linear (clean, dense, keyboard-friendly), Notion (neutral, content-focused), Jira (enterprise-grade, functional).

**Principles:**
- **Content density** — more information per screen, less whitespace
- **Neutral palette** — slate/gray tones for chrome, color only for semantics (status, actions)
- **Two layouts** — different structures for "workspace selector" and "inside workspace"
- **Theme system** — new "Professional" theme as default, keep old "Classic" theme as option

---

## Phase 1: Theme System + Color Palette

### 1.1 New color palette ("Professional" theme)

Replace bright indigo/amber with a neutral-accented palette:

| Token | Current (Classic) | New (Professional) | Usage |
|-------|------------------|--------------------|-------|
| `$primary` | `#6366f1` (indigo) | `#2563eb` (blue-600) | Primary actions, active states |
| `$primary-dark` | `#4f46e5` | `#1d4ed8` (blue-700) | Hover states |
| `$primary-light` | `#818cf8` | `#3b82f6` (blue-500) | Light accents |
| `$primary-disabled` | `#aeaff5` | `#93c5fd` (blue-300) | Disabled state |
| `$accent` | `#f59e0b` (amber) | `#0ea5e9` (sky-500) | Secondary actions |
| `$accent-dark` | `#e09009` | `#0284c7` (sky-600) | Secondary hover |
| `$background` | `#f8f9fa` | `#f8fafc` (slate-50) | Page background |
| `$text` | `#1f2937` | `#0f172a` (slate-900) | Primary text |
| `$text-light` | `#6b7280` | `#64748b` (slate-500) | Secondary text |
| `$border` | `#e5e7eb` | `#e2e8f0` (slate-200) | Borders |
| sidebar bg | `$text` (#1f2937) | `#0f172a` (slate-900) | Sidebar background |

### 1.2 Implementation approach

**Option: CSS custom properties per theme.**

Currently colors are SCSS variables used at build time. To support switchable themes:

1. Define CSS custom properties in `:root` and `[data-theme='professional']`
2. Gradually migrate components from `colors.$primary` to `var(--color-primary)`
3. The existing `[data-theme='dark']` stays as a third option
4. Theme store already exists — extend it with: `'light'` (classic), `'professional'`, `'dark'`

**Migration strategy:** Don't rewrite all files at once. Start with the layout chrome (sidebar, header, backgrounds), then pages as we touch them.

### 1.3 Remove gradient background

Replace `linear-gradient(135deg, $background 0%, #eef2ff 100%)` with flat `var(--color-background)`. Gradients are visual noise in a business tool.

---

## Phase 2: Layout Restructure

### 2.1 Two-layout architecture

**Layout A: "Hub" — workspace selector, admin, profile/settings**
- **No sidebar**
- Top navigation bar: logo (left), nav links (center/right), user avatar + dropdown (right)
- Full-width content area
- Used for: `/workspaces`, `/admin/*`, `/profile`, `/settings`
- Clean, spacious — user spends seconds here, not hours

**Layout B: "Workspace" — inside a workspace**
- Sidebar (current behavior, but always full)
- Sidebar shows: workspace name + switcher at top, then all workspace sections
- Bottom: back to hub, settings, profile, logout
- Used for: `/workspaces/:id/*`
- Dense, functional — user spends hours here

### 2.2 Hub top bar

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]    Воркспейсы   Админ▾    ···    [User Avatar ▾] │
│                                          Name            │
└──────────────────────────────────────────────────────────┘
```

- Admin links only visible if `isAdmin`
- User dropdown: Profile, Settings, Theme toggle, Logout
- Responsive: collapses to burger on mobile

### 2.3 Workspace sidebar refinement

Current sidebar is already good. Refinements:
- Add workspace name/switcher at the very top (below logo)
- "Назад к воркспейсам" link at bottom (instead of relying on logo click)
- Slightly increase density: reduce menu item height from 40px to 36px
- Add subtle section dividers

### 2.4 Files to create/modify

| File | Action |
|------|--------|
| `layouts/hub.vue` | **Create** — new layout for hub pages |
| `layouts/default.vue` | **Modify** — becomes workspace-only layout |
| `components/layouts/hub/HubTopBar.vue` | **Create** — top navigation component |
| `components/layouts/hub/HubUserMenu.vue` | **Create** — user avatar + dropdown |
| Pages: workspaces, admin/*, profile, settings | **Modify** — switch to `layout: 'hub'` |

---

## Phase 3: Workspaces Landing Page

### 3.1 Current state

Plain cards list with a "Create" button. Minimal information. Feels like a placeholder.

### 3.2 New design

Full-width page with:

```
┌─────────────────────────────────────────────────┐
│  Ваши воркспейсы                    [+ Создать] │
├─────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │ WS Name   │ │ WS Name   │ │ WS Name   │     │
│  │ 12 задач  │ │ 5 задач   │ │ 0 задач   │     │
│  │ 3 чел.    │ │ 1 чел.    │ │ 2 чел.    │     │
│  │ Owner     │ │ Manager   │ │ Owner     │     │
│  │ ·········─│ │ ·········─│ │ ·········─│     │
│  │ [Open]    │ │ [Open]    │ │ [Open]    │     │
│  └───────────┘ └───────────┘ └───────────┘     │
└─────────────────────────────────────────────────┘
```

- Cards show: name, task count, member count, user's role badge
- Click card → enter workspace
- Hover → subtle elevation
- No dropdown menu on cards (edit/delete moves to workspace settings page)

---

## Phase 4: Component Refinements

### 4.1 Tables

Current tables work well. Minor tweaks:
- Tighter row padding (reduce from current to 10px 16px)
- Header row: slightly darker background (`slate-100`)
- Hover row: `slate-50` background

### 4.2 Cards

- Remove border-radius from 12px to 8px (more business-like)
- Border: `1px solid var(--color-border)`
- Hover: `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- No gradient backgrounds

### 4.3 Buttons

- Primary: solid blue, not indigo
- Outlined: gray border, dark text (not primary-colored border)
- Smaller default size: 36px height (from 40px)
- Font-weight: 500 (not 600)

### 4.4 Tags/Badges

Keep current tag system but adjust colors for professional palette.

---

## Phase 5: Page-Specific Improvements (Ideas)

### 5.1 Workspace Dashboard
- Add recent activity feed (last 5 task changes)
- Add quick command input inline (not just a link to commands page)
- Stats cards: use icons instead of just numbers

### 5.2 Admin pages
- Already using TableView — fits the business dashboard pattern well
- Consider adding search/filter inputs

### 5.3 Auth pages
- Remove decorative gradient blobs
- Cleaner card: more padding, centered logo above form
- Professional feel: "Войти в систему" instead of just "Вход"

---

## Implementation Order

| # | Phase | Scope | Effort |
|---|-------|-------|--------|
| 1 | Theme system + new palette | SCSS variables → CSS properties, new color tokens | Medium |
| 2 | Hub layout + top bar | New layout, restructure pages | Medium |
| 3 | Workspaces landing | Redesign cards, add density | Small |
| 4 | Component refinements | Tables, buttons, cards tweaks | Small |
| 5 | Page improvements | Dashboard, auth, admin polish | Small |

Phases 1–2 are the structural changes. Phases 3–5 are polish that can happen incrementally.

---

## Open Questions

1. **Font:** Montserrat is slightly "friendly." Consider switching to Inter or keeping Montserrat? Inter is more neutral/professional and widely used in business tools. (Can be changed easily.)
2. **Workspace switcher in sidebar:** Quick-switch dropdown at top of sidebar, or just "Back to workspaces" link?
3. **Dark theme priority:** Keep it working, or can it be temporarily broken during migration and fixed later?
