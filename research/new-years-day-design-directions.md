# New Year's Day design research

**Status:** research only; no product code or assets were changed.  
**Reviewed:** 4 September 2026  
**Scope:** New Year's Day for the Aotearoa New Zealand public-holiday countdown. The existing issue asks for an Aotearoa-specific, warm-gold **first light** treatment in place of a generic midnight-party theme. [Issue #24](https://github.com/Sai-Panda/next-public-holiday-nz/issues/24)

## Evidence to design from

- The Chatham Islands are 45 minutes ahead of mainland New Zealand time; because New Zealand lies just west of the International Date Line, Chatham Islanders are the first people to see the sun rise each day. [Te Ara: *Chatham Islands*](https://teara.govt.nz/en/chatham-islands/page-1) and [Te Ara: *Climate*](https://teara.govt.nz/en/natural-environment/page-3)
- Tourism New Zealand describes Tairāwhiti Gisborne as welcoming the new day before the rest of the world. This is a useful regional expression of the first-light idea, but the Chathams source above is the more precise nationwide claim. [Tourism New Zealand: *First Light Marathon*](https://www.newzealand.com/nz/event/first-light-marathon/)
- December to February is meteorological summer in New Zealand, and January and February are generally the warmest months. [NIWA: *When does summer begin?*](https://niwa.co.nz/news/great-debate-when-does-summer-begin) and [NIWA: *Overview of New Zealand's climate*](https://niwa.co.nz/climate-and-weather/overview-new-zealands-climate)
- New Year's Day is fixed to 1 January; the following 2 January is also a public holiday. When either falls on a weekend, the observed day may move to Monday or Tuesday. [Employment New Zealand: *When a public holiday falls on a weekend*](https://www.employment.govt.nz/leave-and-holidays/public-holidays/when-a-public-holiday-falls-on-a-weekend)
- Matariki, which signals the Māori New Year, is a distinct midwinter observance and public holiday in June or July. It must not be folded into a Gregorian 1 January treatment. [Te Ara: *Matariki – Te Tau Hou Māori*](https://teara.govt.nz/en/matariki-maori-new-year) and [Te Kāhui o Matariki Public Holiday Act 2022](https://www.legislation.govt.nz/act/public/2022/0014/latest/whole.html)
- IPONZ advises sensitivity and respect when using Māori visual elements, and recommends consultation or commissioning a Māori creative familiar with tikanga. [IPONZ: *Concepts to understand*](https://www.iponz.govt.nz/get-ip/maori-ip/concepts-to-understand/)

## Design directions

### 1. First light — recommended

Make the hero a calm eastern horizon rather than a party: a low, cropped sun-disc, one or two translucent halo rings, and a fine horizon rule. Use existing iconography only as a small sparkle accent; the sun and rings should be CSS/SVG geometry rather than an illustration.

Suggested palette: deep harbour navy `#11233c` at the top, dawn amber `#fbbf24` for the signature accent, softened apricot `#f6b450`, and a pale warm-sky neutral `#f3e6cd`. Keep the countdown panel dark enough for strong white-text contrast. The first-sunrise evidence above makes dawn a specific Aotearoa reference without claiming that the whole country is literally first in the world.

### 2. Date-line lead

Turn the date change into an abstract data graphic: a short broken vertical or horizontal line crosses from `23:59` to `00:00`, then resolves into a small `+45 min` marker. The display is an allusion to the Chatham Islands' time offset, not a literal map or an unqualified “first country” claim.

This route is ideal if the visual system should feel editorial and clock-like. It makes a countdown site itself the illustration, works with no artwork, and is readily legible at mobile size. Use supporting copy such as “The new day starts early in Aotearoa” only if it links to the authoritative source above; avoid a broad factual superlative.

### 3. 01 / 02 — the summer break pair

Use two oversized, adjacent calendar numerals: `01` is the active New Year's Day card and `02` appears as a lighter next-day tab. A thin connecting rule makes the two public holidays feel like one short summer interval, while preserving the product's existing actual-versus-observed-date treatment.

This is distinctively useful for New Zealand because the official holiday schedule treats both 1 and 2 January as public holidays, with special observed-date rules. It improves clarity when the holiday is Mondayised and requires no scenic or cultural motifs.

### 4. High-summer daylight

Use a broad field of pale sky, a sun-yellow focal point, and a restrained red micro-accent. The intentional absence of black night, snow, fir branches, champagne flutes, and dense fireworks keeps the page in an Aotearoa summer register. January's warm-season context supports the daylight palette; it should remain an abstract colour-and-light composition, not a stock-photo substitute.

If a botanical accent is wanted, a tiny flat red stamen-like burst may nod to pōhutukawa's summer/Christmas association, but it should remain optional and generic rather than portraying a specific tree or narrating Māori tradition. DOC notes both pōhutukawa's Christmas flowering association and its place in Māori mythology. [Department of Conservation: *Pōhutukawa*](https://www.doc.govt.nz/pohutukawa)

### 5. Quiet calendar reset

Make `01 JAN` the visual centre, framed by a single rising semicircle and a graduated 0–24-hour tick line. At midnight the ticks shift from muted navy to warm gold; after the date, the card settles into a clean daylight state. This is the most minimal and accessible route: it visually explains a countdown becoming a public holiday without relying on a location image.

The date is Gregorian New Year's Day, not a proxy for the Māori New Year. Consequently, do not use a Pleiades/Matariki star cluster, maramataka, Māori motifs, te reo greetings, karakia, or “Māori-inspired” pattern language unless an appropriate Māori creative has been commissioned or consulted.

## Production guardrails

- Prefer the existing `SparklesIcon` and code-native CSS/SVG primitives (disc, line, halo, tick marks). Do not add AI-generated images or artwork; the project permits AI-generated logos only.
- Do not use generic midnight, Northern Hemisphere winter, or retail-sale imagery.
- Do not make unqualified “first country/place to greet the new year” claims. If using the idea in copy, distinguish the Chatham Islands' documented first sunrise from the more qualified Gisborne tourism phrasing.
- Do not borrow Matariki symbols or Māori visual language for a 1 January design. Commission or consult an appropriate Māori creative before any explicitly Māori reference.
- Keep the first implementation narrow: the issue's requested `#fbbf24` accent plus **First light** is the best fit for the current, image-light card system. Check rendered contrast once the hero/card treatment exists, as Issue #24 already requires.

## Contrast check

The implemented hero was reviewed at desktop and 360px mobile widths. Its text sits on a controlled deep-harbour gradient (`#11233c` → `#193855` → `#0c2439`), rather than the sunrise artwork. Measured against the lightest, worst-case hero stop (`#193855`), the primary display text (`#faf4e8`) is **11.03:1**, the date (`#ffe7b2`) is **9.97:1**, and the gold support text (`#ffe09a`) is **9.42:1**. The right-side caption has its own fixed `#11233c` surface, with `#fff8e9` at **14.93:1** and `#ffe09a` at **12.32:1**. All exceed WCAG AA's 4.5:1 threshold for normal text.

## Recommendation

Choose **First light**: a dawn-gold accent, horizon/sun geometry, sparse sparkles, and an editorial caption such as “New Year's Day · 1 January”. It directly fulfils Issue #24, is genuinely rooted in Aotearoa's position at the start of a new day, stays correct about Matariki, and fits the project's no-AI-artwork policy.
