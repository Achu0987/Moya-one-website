# Paste this into Claude Code

Open an empty folder for the project. Put these four files in it: CLAUDE.md, DESIGN.md, Moya_One_Project_Tracker.xlsx and this file. Then paste the prompt below.

---

Read CLAUDE.md, then DESIGN.md, in full. Both contain a mandatory design audit. Run it after every change you make, including every change I ask for in this conversation. Then open Moya_One_Project_Tracker.xlsx and read the Sitemap, Claims, Decisions and Risks tabs. Do not write any code yet.

Before you start, send me one list of questions. Cover anything the files do not answer, including:
- which framework you will use and why
- which DESIGN.md open decisions (DD1 to DD5) you need answered first
- any Claims item you need confirmed before a page can go live
- anything you need from the client that is not yet in the Client Inputs tab

After I answer, proceed as follows.

1. Set up the project. Use the framework you chose. Add GSAP with ScrollTrigger, Lenis and Phosphor icons. Self-host the fonts. Create tokens for every colour and type size from DESIGN.md. Write a README with the run command and a one-line reason for the stack.

2. Fix the 20-litre jug illustration first, using the proportions in CLAUDE.md. Show it to me as a standalone SVG before using it anywhere.

3. Build Phase 1 Must pages from the Sitemap tab, in this order: home, /b2c/how-it-works, /b2b/builders, /compare and its two Must pages, /environment, /contact. Then the other Must pages. Stretch pages come last, and only after I approve the Must pages.

4. After each page, update the Status and Notes columns in the Tracker tab for the tasks you finished. Set a task to "Blocked" and say why in Notes if you cannot finish it.

5. The hero is a stick figure throwing jugs into a branded dustbin. Build it in SVG with GSAP. Keep the cap generic and the dustbin branded with Moya One. Keep the stick figure minimal (thin line, no face). Reduced motion shows the final state with jugs already in the bin.

6. The basement control room is basic and evocative. No part names, no schematics. Follow DESIGN.md section 6.

7. Use the luxury-and-convenience direction in DESIGN.md. Headlines are short and sentence-case. Use generous space. One orange action per viewport. Dark ink for the builders section.

Rules that apply to every page:
- No prices in any currency.
- No patent or technology detail. Use "patent filed", not "patented".
- Every number is labelled "Sample data" or "Illustrative".
- Deployments: India only, marked "to confirm". No UAE developer names or logos.
- Any placeholder gets a comment starting with `PLACEHOLDER:`.
- The contact email is a placeholder until I tell you the real one.

Verification before you call a page done:
- Design audit passes: run the design-taste-frontend skill and the impeccable skill on the page, fix every finding, and run both again. If the impeccable skill is missing, tell me and stop.
- No horizontal scroll at 390px or 1440px.
- Reduced motion shows the final content.
- Every claim on the page is in the Claims tab as OK or Verified.
- Lighthouse mobile performance 85 or higher.

When Phase 1 Must pages are finished, send me a summary: pages done, pages blocked, claims still unverified, and any scope you think is at risk.

---

Notes for the person sending this:
- Replace the placeholder contact email and company details once the client sends them.
- Share the client's logo variations and colour preference with the developer as soon as they arrive. Update DESIGN.md (sections 2 and 11) if the client changes anything.
