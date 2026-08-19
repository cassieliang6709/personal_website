# Design QA — Musical Stage Home

Date: 2026-08-18

## Reference

- User-selected direction: option 3, a warm miniature musical stage with bottom capsule navigation.
- Locked visual target: `output/design-targets/home-musical-stage-v1.png`
- Combined comparison: `output/qa/home-reference-vs-build-stage2.png`

## Blocking pass

- [x] The page uses the selected cream, coral, apricot, and light-wood palette; the old blue favicon is gone.
- [x] The top of the page carries a fuller bilingual introduction and real project proof.
- [x] The house now reads as a theatrical set, with footlights, spotlights, a glowing path, music notes, and a walking Cassie pose.
- [x] The large capsule navigation stays at the bottom and exposes Home, About, Timeline, Projects, and Writing.
- [x] Object hotspots, stage zoom/pan, scene navigation, readers, project dialogs, resume links, and external links remain real controls.
- [x] Scene changes use a gentle set-change transition and respect `prefers-reduced-motion`.
- [x] `/` stays Chinese and `/en/` stays English; the language control navigates between canonical routes.
- [x] Cassie's generated portrait is used for the favicon, Apple touch icon, and header identity.
- [x] Desktop check completed at 1440 × 1024; mobile check completed at 390 × 844 with no horizontal overflow.
- [x] JavaScript syntax, HTML parsing, generated English markup, and `git diff --check` pass.
- [x] Browser console has no errors or warnings.

## Visual comparison notes

- P0: none.
- P1: none after replacing the former flat room image with the UI-free theatrical stage asset.
- P2: the implementation keeps the intro in a cleaner editorial grid instead of baking it into the illustration; this preserves readable, localizable HTML and lets the project proof remain real content.

## Evidence

- Desktop: `output/qa/home-desktop-1440x1024-stage2.png`
- Mobile: `output/qa/home-mobile-390x844-stage2.png`
- Before/after comparison: `output/qa/home-reference-vs-build-stage2.png`
- Interaction: capsule Projects navigation, stage transition, Chinese/English route switching, and favicon resolution exercised in the in-app browser.

final result: passed
