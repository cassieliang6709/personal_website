# Design QA — Cassie's Room

## Evidence

- Source visual truth: `assets/room-spec/home.png` (1448 × 1086 px, 4:3, original PDF-embedded raster).
- Desktop implementation: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v2/home-desktop.png` (1280 × 720 px, 1280 × 720 CSS viewport, DPR 1).
- Mobile implementation: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v2/home-mobile.png` (390 × 844 px, 390 × 844 CSS viewport, DPR 1).
- Additional states: `works-desktop.png` and `works-mobile.png` in the same evidence directory.
- Regenerated-room evidence: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v3/works-regenerated.png` and `writing-regenerated.png` (1076 × 963 browser viewport, DPR 1).
- Link-shelf evidence: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v4/works-link-shelf-desktop.png` and `works-link-shelf-mobile.png` (desktop default viewport and 390 × 844 mobile, DPR 1).
- Final catalog evidence: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v5/works-catalog-desktop.png` and `works-catalog-mobile.png` (desktop default viewport and 390 × 844 mobile, DPR 1).
- Semantic-color and resume-entry evidence: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v6/home-resume-semantic.png` (desktop browser viewport, DPR 1).
- Homepage annotation evidence: `/Users/cassie/.codex/visualizations/2026/08/09/019fe4f8-7e08-77d2-9fb8-49a322e35702/personal-website-qa-v7/home-annotated-expanded.png`, `home-annotated-collapsed.png`, and `home-annotated-mobile.png` (729 × 862 desktop and 390 × 844 mobile browser viewports).
- State: Chinese home and Works room; English Works state also checked.

The source raster, desktop render, and mobile render were opened together as one comparison input. The implementation intentionally adds a quiet explanatory card and house-map outside the original room art; the modern room, cool-white canvas, pale wood, Cassie Blue identity, and single yellow interaction cue remain visually aligned. Focused evidence was used for Works because its project labels and text are too small to judge in the home comparison.

## Findings and iteration history

1. **P2 — duplicate hotspot labels on desktop.** The original room image already contains object labels, while the first implementation added a second visible set. Fixed by turning the live hotspots into transparent object hit areas that reveal a single yellow response only on hover/focus. Post-fix evidence: `home-desktop.png`.
2. **P2 — mobile navigation could not rely on invisible object coordinates.** Fixed by converting the same hotspots into a two-column, text-labelled mobile entrance grid, with the Future doorway spanning both columns. Post-fix evidence: `home-mobile.png`; 390 px has no horizontal overflow.
3. **P2 — source project art still said “Fitness Agent.”** The product's verified name is Vance. Fixed with a restrained Vance correction label on the project scene, while the detailed drawer uses the truthful status “个人项目 · 继续整理中.”
4. Final pass: no remaining P0, P1, or P2 findings.
5. **P2 — PDF concept art was not fully aligned with the live content.** The Works image contained outdated baked labels and the Writing image behaved like a proposal mock rather than a real room. Replaced both with newly generated, text-free 1448 × 1086 assets grounded in the same Cassie character, cool-white/pale-wood room system, and verified project taxonomy. The Works scene now contains five physical project objects including Vance; the Writing scene organizes build notes, reflection journals, and life archives as real shelf contents. Post-fix evidence: `personal-website-qa-v3/works-regenerated.png` and `writing-regenerated.png`.
6. **P2 — Works page had a broken left/right rhythm.** The 4:3 scene ended while the right narrative continued, leaving a large inactive blank area. Fixed with a five-link project shelf below the scene and five desktop object hotspots that select the corresponding story. Mobile removes the coordinate-dependent hotspots and exposes the links as a single readable list. Post-fix evidence: `personal-website-qa-v4/works-link-shelf-desktop.png` and `works-link-shelf-mobile.png`.
7. **P2 — Link shelf and persistent story still fragmented the scene.** User review found that the page read as three unrelated layers. Removed the shelf, card grid, and persistent long-form project block. The final Works composition uses one complete 4:3 scene beside a thin five-row project catalog: four rows open real project destinations directly, Vance opens a truthful detail note, and image objects open temporary story dialogs. Mobile stacks the complete scene above the same catalog. Post-fix evidence: `personal-website-qa-v5/works-catalog-desktop.png` and `works-catalog-mobile.png`.
8. **P2 — The filled-blue current navigation state was too visually dominant.** Replaced it with a quiet underline and assigned color by meaning: blush marks personal memory and past movement (About, Timeline), while Cassie Blue/gray-blue marks active building and publishing (Works, Writing). Yellow remains reserved for the immediate hover/focus interaction. Added two compact homepage resume entrances without covering the room artwork. Post-fix evidence: `personal-website-qa-v6/home-resume-semantic.png`.
9. **P1 — Public writing was too thin to support a portfolio review.** Replaced five three-paragraph summaries with complete bilingual articles grounded in the Life Archive and current project evidence. Each reader now renders nine content blocks without horizontal overflow; build, reflection, and life filters all expose the expected articles. Corrected Cassie Capture from an unverified store-availability claim to the truthful state: release package prepared, submission and review pending.
10. **P2 — The homepage card obscured too much of the room and duplicated its story.** Removed the introductory paragraph, added an explicit expand/collapse control, moved the exploration hint to the left, and replaced the two large resume cards with a quiet single-row strip below the complete image. Both card states and the 390 px layout were checked after the change. Post-fix evidence: `personal-website-qa-v7/home-annotated-expanded.png`, `home-annotated-collapsed.png`, and `home-annotated-mobile.png`.
11. **P1 — Full-resolution PNG scenes made the portfolio unnecessarily heavy.** Added visually matched WebP delivery assets for all five live scenes and updated the page references. The combined scene payload fell from about 10 MB to about 680 KB while retaining the 4:3 source dimensions.

## Required fidelity surfaces

- Typography: Noto Serif SC supplies the calm editorial layer; Noto Sans SC and DM Mono keep navigation and metadata compact. Chinese and English wrapping were checked.
- Layout rhythm: desktop uses a stable scene/content split; mobile stacks the 4:3 room above readable content and keeps the room map persistent without overflow.
- Color: cool white and pale wood dominate; mist lavender, gray-blue, sage and blush remain secondary; Cassie Blue identifies navigation; yellow appears only on current interaction/focus.
- Image fidelity: Works and Writing now use project-local generated assets (`projects-v2.png`, `writing-v2.png`) rather than the PDF rasters; the other four scenes retain the original embedded art. Neither replacement contains baked UI text or placeholder labels, and all assets preserve the same character and room direction.
- Copy: public claims were checked against the repository and Life Archive. Vance, product states, 30-person study, -64%, and gaokao rank 175 use conservative verified wording.

## Verification

- Home → Works navigation, project selection, Vance drawer, Writing categories, full-screen reader, language switch, progress counter, and Escape/back behavior checked in the in-app browser.
- Desktop and 390 × 844 mobile have no horizontal overflow.
- Semantic state check passed: `profile` and `timeline` set `data-tone="memory"` with blush accents; `works` and `writing` set `data-tone="build"` with blue accents. The current bottom-nav item remains transparent in all four states.
- Homepage resume links resolve to non-empty canonical Chinese SDE and PM PDFs under `assets/resume/`.
- The welcome control exposes a unique button, updates `aria-expanded`, and collapses the card from 210 px to 48 px tall; the removed paragraph is absent from rendered page text. The resume strip contains two links on one row, and the exploration hint is left-aligned inside the scene.
- The five optimized WebP scene assets return HTTP 200 from the local preview; the original PNGs remain as source-quality masters.
- All five Chinese and English article readers open successfully, each with eight paragraphs plus one emphasized turn; browser console has no warnings or errors.
- Browser console has no application errors.
- `node --check studio.js`, local-reference validation, `git diff --check`, and `/en/` symlink paths passed.

final result: passed
