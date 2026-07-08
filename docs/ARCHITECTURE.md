# Architecture

## Overview

This Pokédex is a **static single-page application (SPA)** built with SvelteKit 2 and Svelte 5. It fetches data from the public PokeAPI, validates responses with Zod, and caches them in-memory for the session duration.

## Core Principles

1. **Type Safety** — TypeScript strict mode + Zod runtime validation
2. **Progressive Enhancement** — Static prerendering + client-side hydration
3. **Performance** — In-memory caching, code splitting, lazy loading
4. **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation
5. **User Experience** — Smooth animations, responsive design, dark mode

## Route Structure

### Prerendered Routes (Static)
- `/` — Pokémon list (initial 30)
- `/berries` — Berry list (initial 30)

### Client-Rendered Routes (Dynamic)
- `/pokemon/[name]` — Pokémon detail
- `/berries/[name]` — Berry detail
- `/favorites` — User favorites (localStorage)

Static routes are prerendered at build time. Dynamic routes use the `404.html` fallback and hydrate client-side.

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Client (client.ts)
    ↓
Cache Check (cache.ts)
    ├─ Hit → Return cached data
    └─ Miss → Fetch from PokeAPI
         ↓
      Zod Validation (schemas.ts)
         ↓
      Cache & Return
         ↓
Component State Update
    ↓
UI Re-render
```

## State Management

### Reactive State (Svelte 5 Runes)
- `$state` — Component-local reactive variables
- `$props` — Component properties
- `$derived` — Computed values
- `$effect` — Side effects (DOM updates, localStorage sync)

### Global Stores (Writable)
- `themeStore` — Light/dark mode preference
- `favoritesStore` — Set of favorited Pokémon names

Both stores sync to localStorage on change.

## Caching Strategy

### In-Memory Cache
- **Key:** Full URL (`https://pokeapi.co/api/v2/pokemon/25`)
- **Value:** Parsed, validated response object
- **Lifetime:** Session (cleared on page refresh)
- **Size:** Unbounded (acceptable for this use case)

### Why In-Memory?
- **Simple** — No IndexedDB complexity
- **Fast** — O(1) lookups
- **Sufficient** — PokeAPI is stable; data rarely changes
- **No Storage Limits** — Browser memory limits are high

## Styling Architecture

### Tailwind CSS v4
- Utility classes for layout, spacing, typography
- Responsive design with breakpoint prefixes
- Dark mode via `[data-theme="dark"]` attribute

### Custom CSS
- Animations and transitions (respects `prefers-reduced-motion`)
- Type-based color gradients
- Component-specific styles in `<style>` blocks

### CSS Custom Properties
```css
--color-bg: #ffffff | #0a0a0a
--color-text: #171717 | #ededed
--color-border: #e5e5e5 | #262626
--color-card: #fafafa | #171717
```

## Type System

### Type Hierarchy
```
PokeAPI Response (unknown)
    ↓ (zod parse)
Validated Type (e.g., Pokemon)
    ↓ (component props)
Component (type-safe)
```

Every API response passes through Zod validation. Invalid data throws an error, preventing runtime type bugs.

## Performance Optimizations

1. **Code Splitting** — Route-based chunks
2. **Image Optimization** — Lazy loading with `loading="lazy"`
3. **Debounced Search** — 250ms debounce on search input
4. **Infinite Scroll** — Load 30 Pokémon at a time
5. **Static Prerendering** — Initial HTML served instantly
6. **In-Memory Caching** — Eliminates redundant API calls

## Build Process

```
Source Code (TypeScript + Svelte)
    ↓ (vite + svelte compiler)
Compiled JS + CSS
    ↓ (adapter-static)
Static HTML + Assets
    ↓ (GitHub Actions)
Deployed to GitHub Pages
```

### Build Output
- `build/` — Static files
- `build/_app/` — Hashed chunks (JS, CSS)
- `build/404.html` — SPA fallback

## Deployment

### GitHub Actions Workflow
1. **Lint** — Ultracite (oxlint)
2. **Type Check** — svelte-check + tsc
3. **Test** — Vitest (unit) + Playwright (e2e)
4. **Build** — `GITHUB_PAGES=true npm run build`
5. **Deploy** — Upload artifact → GitHub Pages

### Environment Variables
- `GITHUB_PAGES=true` — Sets `base` path to `/pokedex-tw-off-1`

## Error Handling

### Network Errors
- Fetch errors caught and logged
- User sees empty state or error message
- No app crash

### Validation Errors
- Zod parse failures caught
- Logged to console
- Filtered from results (e.g., `filter(Boolean)`)

### 404 Routes
- SvelteKit error pages
- Back navigation provided

## Accessibility

- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<section>`
- **ARIA Labels** — `aria-label` on icon buttons
- **Keyboard Navigation** — All interactive elements focusable
- **Alt Text** — All images have descriptive alt text
- **Color Contrast** — WCAG AA compliant
- **Reduced Motion** — Respects `prefers-reduced-motion`

## Testing Strategy

### Unit Tests (Vitest)
- Utility functions (format, type colors, cache)
- Pure functions, no DOM dependencies
- Fast, isolated

### E2E Tests (Playwright)
- Critical user flows
- Real browser, full integration
- Slower, but comprehensive

### No Component Tests
- Component behavior tested via e2e
- Svelte compiler catches template errors
- TypeScript catches prop type errors

## Future Improvements

- **Service Worker** — Offline support
- **IndexedDB** — Persistent cache
- **Image CDN** — Optimize sprite delivery
- **Skeleton Screens** — Better loading states
- **Error Boundaries** — Graceful error handling
- **Analytics** — User behavior tracking
