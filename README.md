# US States Map Game

An interactive geography game that tests your knowledge of US state locations. Click the correct state on the map as quickly as you can.

## How to Play

1. Click **Start Game** to begin
2. A target state name appears — click it on the map
3. Correct guesses color the state (green on first try, warmer colors for more attempts)
4. Wrong guesses flash red briefly
5. Use **Skip** to move a tricky state to the back of the queue
6. Find all 50 states to finish — a results dialog shows your time and per-state attempt counts

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
