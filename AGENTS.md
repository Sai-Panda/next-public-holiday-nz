<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository context and instructions

- Primary coding instructions for GitHub Copilot live in `.github/copilot-instructions.md`.
- Ongoing product context and current focus live in `.github/copilot-context.md`.
- Before making non-trivial changes, read both files and align changes with the "Current focus" and "Constraints" sections.
- Asset rule: AI-generated logos are permitted; AI-generated images and artwork are not. For imagery and artwork, use existing project assets or appropriately licensed, human-created work with clear provenance.

## Design continuity

- Treat the existing holiday countdown page as the design system for every new holiday theme. Preserve the page structure, typography, countdown, date treatment, upcoming-holidays section, and responsive behaviour unless the product direction explicitly changes.
- Limit a new theme to a holiday-specific accent colour and a restrained right-hand hero graphic that follows the established dark-ink/cream, uppercase editorial language. Do not introduce a different page layout, navigation, or a new visual system for an individual holiday.
