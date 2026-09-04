# Copilot instructions for this repository

## Purpose
Build and maintain a beautiful Next.js app that shows countdowns for the next New Zealand public holidays.

## Tech stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Working agreement
- Read `.github/copilot-context.md` before making product decisions.
- Keep changes small and focused; avoid unrelated refactors.
- Reuse existing patterns and helpers before introducing new abstractions.
- Preserve type safety; avoid `any` unless there is no safer alternative.
- Prefer server-first/data-fetching patterns that fit modern Next.js guidance.
- Keep UX mobile-first, simple, fast, and polished on larger screens too.
- Do not generate, create, add, or use AI-generated images or artwork in this project, except AI-generated logos. For imagery and artwork, use only existing project assets or appropriately licensed, human-created work with clear provenance. If suitable imagery is unavailable, ask before proposing an alternative.

## Code style
- Use clear names over clever shortcuts.
- Keep components single-purpose.
- Add comments only when the intent is not obvious from code.

## Validation
- For code changes, run:
  - `npm run lint`
  - `npm run build`
  - `npm test`
- Before every `git push`, run all three of the above and confirm they pass. Never push on a failing test, lint, or build.

## Source of truth files
- Project context: `.github/copilot-context.md`
- Agent bootstrap instructions: `AGENTS.md`
