# Project context

## Product
`next-public-holiday-nz` is a beautiful website that shows countdowns for the next New Zealand public holidays.

## Current state
- Repository is currently close to a fresh Next.js starter.
- Tailwind CSS 4 is configured and used in `app/` components.

## Current focus
1. Build a polished countdown experience for upcoming NZ public holidays.
2. Make the experience mobile-first while still looking beautiful on desktop and web views.
3. Keep implementation lightweight and readable.
4. Prioritize correctness of holiday dates and display clarity.

## Constraints
- Use App Router conventions.
- Keep TypeScript strict and avoid unsafe shortcuts.
- Keep dependencies minimal unless they provide clear value.

## Decisions log
- Added Copilot instruction and context files to preserve shared development direction.
- Product direction set by user: beautiful countdown website for NZ public holidays.
- Labour Day direction: an editorial 8/8/8 system rooted in the New Zealand eight-hour-day story.
- Labour Day uses an intentionally image-free graphic system for a lightweight page; AI-generated photography is not a production asset.
- Keep the experience single-purpose: no navigation bar and no add-to-calendar control.
- Keep historical context terse on-page; link to the authoritative holiday source instead of adding explanatory sections.
- Christmas Day uses pōhutukawa crimson, high-summer coastal colour, and a
  replaceable hero-image placeholder; avoid Northern Hemisphere winter motifs.
- Christmas uses the Coast & Canopy direction as the single production design.
- Use verified te reo Māori such as “Meri Kirihimete”, but do not invent culturally
  specific decorative patterns without review.

## Update rule
When project direction changes, update this file in the same PR so future Copilot sessions inherit the latest context.
