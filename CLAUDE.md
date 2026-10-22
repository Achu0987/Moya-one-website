# CLAUDE.md: Moya One website

You are building the Moya One concept-to-production website. Read this file, then DESIGN.md, then the tracker, before writing code.

## What the project is

Moya One is a centralized, subscription-based drinking-water service for residential towers in India, with plans to expand to the UAE. A tower gets a dedicated water line to every flat. Each kitchen gets a Moya1 control unit and an extra tap. Residents recharge from a phone app, the way they top up a mobile plan. The system is installed during construction, through the builder.

The website has two jobs:
1. **Consumers:** show that the hassle of bottles and filters is gone, and that the water is trustworthy.
2. **Builders and developers:** show a practical reason to install it, with no retrofit and no lost space.

Consumers come first on the page. Builders come after, on the same page and on their own pages.

## Design audit (mandatory, after every change)

This rule applies to every task, every prompt, and every change, including copy, styles, animations and fixes. Do not skip it because a change looks small.

1. Run the **design-taste-frontend** skill on every page or component you changed.
2. Run the **impeccable** skill on the same pages. If it is not installed in this Claude Code, stop and tell Vinayak. Do not continue without it, and use the checklist in DESIGN.md section 12 as the fallback only until it is installed.
3. Check for vibe-coded signs. Fix any that appear:
   - generic purple, blue or grey gradients, or gradient text
   - identical card grids, or every section built the same way
   - mixed icon styles or weights
   - default system fonts, or more than two font families
   - emoji, cartoon shapes, or stock-looking imagery
   - everything centred, or no alignment grid
   - cramped spacing, or uneven corner radii
   - more than one orange action per viewport
   - animation that does not explain anything (motion for its own sake, wobbling, bouncing everything)
   - decorative blobs, shadows or glows with no purpose
   - copy that sounds like a template ("Unlock", "Seamless", "Empower")
4. Fix every finding, then run both checks again. Repeat until both pass.
5. Record the result in the tracker Notes for the task: "Audit: pass" and one line on what was fixed.

A task is not done until the audit passes. Do not report a page as finished without the audit result.

Animations are only acceptable when they make the product clearer, such as the water filling a tank or the pipe rising through a building. Animation that is there only to look busy fails the audit.

## Who we are working for

- **Client:** Omar (also introduced as Khan Mohammed, a company founder). He wants the site to feel luxurious and convenient, interactive, and not like a template.
- **Agency:** Socialsect (Rayansh Singh, founder). Design lead: Vinayak.
- Client contact details are in the tracker, Client Inputs tab. Do not put them in code.

## Non-negotiables

1. **No prices.** No rupee, dirham or dollar figures on the site in phase 1. Recharge demos show litres only.
2. **No patent or technology detail.** Do not explain how the water is treated or how the valves work. Use "patent filed" until the tracker says it is granted.
3. **No false claims.** Check every factual claim against the Claims tab in the tracker. Only publish items marked "OK" or "Verified".
4. **India only for deployments.** Do not name UAE developers or show their logos. Mark deployment details "to confirm" until the client approves.
5. **Sample labels.** Every number in an app screen, a counter or a chart carries a visible "Sample data" or "Illustrative" label.
6. **Placeholder marking.** Placeholder copy, placeholder email and placeholder names get a code comment starting with `PLACEHOLDER:` so they can be found and replaced.
7. **Control room stays basic.** Show a clean, evocative room. No part names, schematics or sensor labels.
8. **Accessibility and mobile first.** No horizontal scroll at 390px. Reduced motion shows the final state.

## Stack

Your choice. Options: Next.js, Nuxt, Astro, SvelteKit, or Vite. Pick the one that best supports the motion and the page count, and state the reason in the README in one line.

Expected libraries: GSAP with ScrollTrigger, Lenis for smooth scroll, Phosphor icons, self-hosted fonts. Keep the bundle lean: target under 100KB of compressed JavaScript for the initial page.

Use SVG for illustrations. No raster bottle images. Lazy-load the MP4 video.

## Structure

- `/` home (consumer first, builder teaser)
- `/b2c/how-it-works`, `/b2c/water-quality`
- `/b2b/builders`, `/b2b/installation`
- `/compare`, `/compare/bottled-water`, `/compare/ro-filters` (and stretch pages from the Sitemap tab)
- `/technology`, `/environment`, `/how-we-work`, `/contact`

Check the Sitemap tab for priorities. Phase 1 Must pages are required. Stretch pages only when Must pages are done and tested.

## Design rules (summary, full detail in DESIGN.md)

- Colours are tokens on `:root`. Use only the tokens in DESIGN.md.
- Yellow is a highlight marker behind dark text. Never yellow text.
- One orange action per viewport.
- Sentence-case headlines, max two lines.
- Icons: one family (Phosphor), one weight.
- Motion: never longer than 3 seconds per step. Reduced motion disables loops.
- Every change goes through the design audit above before it is reported.

## Bottle drawing (fix first)

The 20-litre jug must read as a water jug, not a battery.
- Body height about 1.4 times body width.
- Rounded shoulder, corner radius about 25% of body width.
- Neck 35 to 40% of body width, short, small orange cap.
- Pale water inside a clear body, with a visible water line.
- One soft highlight down the left side.
- Same drawing wherever a bottle appears.

## Working method

1. Read CLAUDE.md, DESIGN.md and the tracker. Ask questions in one list before you start.
2. Build Phase 1 Must pages first. Then stretch pages.
3. After each section, update the tracker: set Status and add a note.
4. Keep commits small. One section per commit.
5. Before you call a page done: check 390px and 1440px, check reduced motion, check no horizontal scroll, check the Claims tab for every claim on the page.

## Definition of done (per page)

- Design audit passes (taste skill and impeccable skill, plus DESIGN.md section 12).
- Matches DESIGN.md (tokens, type scale, icons, spacing).
- No horizontal scroll at 390px or 1440px.
- Every number labelled "Sample data" or "Illustrative".
- Every claim checked against the Claims tab.
- No pricing, no patent detail, no UAE deployment names.
- Reduced-motion version shows final content.
- Placeholders marked with `PLACEHOLDER:` comments.

## What to report back

After each working session, write a short summary to the tracker Notes column for the tasks you touched. Mention blockers. Do not invent client facts. If a fact is missing, leave a placeholder and mark it.

## Contact

Questions about scope and claims go to Rayansh. Questions about design go to Vinayak. Do not change the palette or the type scale without Vinayak's approval.
