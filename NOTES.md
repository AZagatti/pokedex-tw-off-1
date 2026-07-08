# Build Journal — Pokédex

## 2026-07-08

### Session start

- Read SPEC.md — building full Pokédex app with SvelteKit, Tailwind v4, oxlint/oxfmt, lefthook, Playwright
- Target: GitHub Pages at https://azagatti.github.io/pokedex-tw-off-1/
- Must achieve Lighthouse ≥90 on all metrics
- Will follow verify-as-you-go loop with screenshots and subagent reviews

### Scaffold complete (14:59)

- Initialized git repo + set remote
- Created SvelteKit 2 + Svelte 5 project manually (sv CLI was interactive)
- Installed ultracite 7.9.3, configured oxlint/oxfmt via `ultracite init`
- Set up lefthook with pre-commit (lint/format/typecheck) and pre-push (test) hooks
- Configured Playwright for e2e tests, vitest for unit tests
- Build succeeds, generates static output
- Note: lucide-svelte deprecated, but will use @lucide/svelte when installing icons
