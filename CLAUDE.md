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
