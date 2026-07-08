# Technology Decisions

This document explains the rationale behind key technology choices in this project.

## SvelteKit 2 + Svelte 5

**Chosen over:** Next.js, Nuxt, Remix

**Why:**
- **Svelte 5 runes** — Modern reactivity without boilerplate
- **Compiler advantage** — No virtual DOM overhead
- **Simplicity** — Less framework code in production bundle
- **adapter-static** — Perfect for static hosting (GitHub Pages)
- **TypeScript integration** — First-class support

**Trade-offs:**
- Smaller ecosystem than React/Next.js
- Fewer third-party component libraries
- Less community content/tutorials

## Tailwind CSS v4

**Chosen over:** Tailwind v3, vanilla CSS, CSS modules

**Why:**
- **Modern syntax** — `@import 'tailwindcss'` instead of directives
- **Better performance** — Faster build times
- **Utility-first** — Rapid prototyping without context switching
- **Responsive design** — Mobile-first by default
- **Dark mode** — Built-in support

**Trade-offs:**
- Large HTML class lists (mitigated by component structure)
- Learning curve for non-Tailwind developers
- v4 is newer, less ecosystem maturity

## TypeScript (Strict Mode)

**Chosen over:** JavaScript

**Why:**
- **Type safety** — Catch errors at compile time
- **IntelliSense** — Better DX with autocomplete
- **Refactoring** — Safe, confident code changes
- **Documentation** — Types serve as inline docs
- **Strict mode** — Maximum type safety

**Trade-offs:**
- Slower initial development
- Type definitions overhead
- Build step required

## Zod

**Chosen over:** Yup, io-ts, JSON Schema

**Why:**
- **TypeScript-first** — Inferred types from schemas
- **Runtime validation** — API response validation
- **Small bundle** — ~8KB minified
- **Developer experience** — Excellent error messages
- **Composability** — Schema reuse and extension

**Trade-offs:**
- Learning curve for schema syntax
- Runtime overhead (negligible for this use case)

## Ultracite (oxlint + oxfmt)

**Chosen over:** ESLint + Prettier, Biome

**Why:**
- **Zero config** — No setup required
- **Fast** — Rust-based, much faster than ESLint
- **Opinionated** — No bikeshedding config options
- **All-in-one** — Linting + formatting

**Trade-offs:**
- Less customizable than ESLint
- Smaller rule set than ESLint ecosystem
- Newer tool, less battle-tested

## Lefthook

**Chosen over:** Husky, pre-commit, lint-staged

**Why:**
- **Fast** — Written in Go
- **Parallel execution** — Multiple hooks run concurrently
- **Cross-platform** — Works on Windows/Mac/Linux
- **Simple config** — YAML-based
- **No dependencies** — Single binary

**Trade-offs:**
- Less popular than Husky
- Fewer integrations

## Vitest

**Chosen over:** Jest, Mocha

**Why:**
- **Vite-native** — Same config as build tool
- **Fast** — ES modules, no transpilation
- **Jest-compatible API** — Familiar for Jest users
- **TypeScript support** — Built-in, no setup
- **Watch mode** — Instant feedback

**Trade-offs:**
- Newer than Jest
- Smaller plugin ecosystem

## Playwright

**Chosen over:** Cypress, Puppeteer, Selenium

**Why:**
- **Modern API** — Promise-based, no flake
- **Multiple browsers** — Chromium, Firefox, WebKit
- **Auto-wait** — Smart waiting, no sleep() hacks
- **Debugging** — Great dev tools
- **TypeScript** — First-class support

**Trade-offs:**
- Slower than Vitest for simple tests
- Requires browser binaries (~100MB each)

## In-Memory Cache

**Chosen over:** IndexedDB, localStorage, Service Worker cache

**Why:**
- **Simplicity** — Just a Map
- **Speed** — O(1) lookups
- **Sufficient** — PokeAPI data is stable
- **No quota limits** — Memory limits are high
- **No async complexity** — Synchronous access

**Trade-offs:**
- Cleared on page refresh
- No persistence across sessions
- No size limit enforcement

## GitHub Actions + GitHub Pages

**Chosen over:** Vercel, Netlify, Cloudflare Pages

**Why:**
- **Free** — Unlimited public repos
- **Integrated** — Same platform as code
- **Simple** — Minimal config
- **Standard** — Well-documented
- **CI/CD** — Built-in workflow engine

**Trade-offs:**
- No edge functions (not needed for static site)
- No automatic preview deployments for PRs
- Slower deploys than Vercel/Netlify

## @sveltejs/adapter-static

**Chosen over:** adapter-auto, adapter-node, adapter-vercel

**Why:**
- **Static hosting** — Perfect for GitHub Pages
- **Prerendering** — Fast initial loads
- **SPA mode** — Fallback to 404.html
- **No server** — Deploy anywhere

**Trade-offs:**
- No server-side rendering for dynamic routes
- No API routes (use external API instead)
- Larger client bundle (includes routing)

## localStorage

**Chosen over:** Cookies, sessionStorage, IndexedDB

**Why:**
- **Simple API** — `getItem`, `setItem`
- **Persistent** — Survives page refresh
- **Synchronous** — No async complexity
- **Sufficient storage** — 5-10MB (enough for favorites)
- **Widely supported** — All modern browsers

**Trade-offs:**
- Not accessible from server
- Synchronous (blocks main thread)
- No structured data support (JSON stringify required)

## PokeAPI

**Chosen over:** GraphQL PokeAPI, other Pokémon APIs

**Why:**
- **Free** — No API key required
- **Stable** — Well-maintained, years old
- **Complete** — All Pokémon data
- **Fast** — Good performance
- **CORS enabled** — Works from browser

**Trade-offs:**
- REST instead of GraphQL (more requests)
- No real-time updates (not needed)
- Rate limits (generous, not hit in practice)

## Summary

Most decisions prioritized:
1. **Simplicity** — Fewer moving parts
2. **Performance** — Fast builds, fast runtime
3. **Developer Experience** — Good DX = faster development
4. **Type Safety** — Catch errors early
5. **Modern Tools** — Rust/Go over JavaScript where possible

The stack is optimized for a **static, client-rendered SPA** with **excellent DX** and **great performance**.
