# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Add shadcn component:** `pnpm dlx shadcn@latest add <component-name>`

## Architecture

This is a Next.js 16 app using the App Router with React 19 and TypeScript (strict mode).

**Package manager:** pnpm

**Styling:** Tailwind CSS 4 with CSS variables for theming, configured via `app/globals.css` (not a separate tailwind.config). Dark mode uses a `.dark` class variant via next-themes.

**Component library:** shadcn/ui (new-york style, RSC enabled) with Radix UI primitives. Components live in `components/ui/`. Configuration is in `components.json`. The `cn()` utility in `lib/utils.ts` merges Tailwind classes using clsx + tailwind-merge.

**Path alias:** `@/*` maps to the project root.

**Linting:** ESLint 9 flat config (`eslint.config.mjs`) extending next/core-web-vitals, next/typescript, and prettier.

**No testing framework is configured yet.**

## Project Structure

- `app/layout.tsx` — Root layout with theme provider (next-themes), tooltip provider, and theme toggle
- `app/page.tsx` — Home page rendering the `MapGame` component
- `components/map-game.tsx` — Main game component with all game state and logic (start, guess, skip, timer)
- `components/us-map.tsx` — Interactive SVG map of US states with click handling, color coding, and tooltips
- `components/results-dialog.tsx` — End-of-game dialog showing per-state attempt counts
- `components/theme-provider.tsx` — next-themes wrapper
- `components/theme-toggle.tsx` — Light/dark/system theme switcher
- `lib/us-states.ts` — US state data (id, name, abbreviation, SVG path)
- `lib/game-colors.ts` — Maps attempt counts to color classes (green/yellow/orange/red)

## Game Logic

All game state lives in `components/map-game.tsx` as a single `GameState` object:
- States are presented in random order; the player clicks the map to find each target state
- Correct guesses color the state on the map (green for 1st try, escalating to red for many attempts)
- Wrong guesses flash the clicked state red briefly
- A skip button moves the current target to the back of the queue
- A results dialog shows all 50 states with attempt counts when the game ends
