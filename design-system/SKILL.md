---
name: cassie-design-system
description: Cassie Liang's design and editorial system for portfolio pages, product landing pages, case studies, and focused utility interfaces.
---

# Cassie Design System Workflow

Use this system whenever changing a public-facing page in this repository or creating a new public surface for one of Cassie's products.

## 1. Establish what is true

Before styling, identify the page's audience, one desired takeaway, project status, and one proof point. Read the actual project repository when facts could have changed. Do not turn a roadmap item into a shipped claim.

## 2. Select a mode

Read `brand-dna.md`, then choose one dominant mode:

- **Evidence / Data:** systems, architecture, technical process — `--cassie-data`.
- **Agency / Signal:** review-before-apply, focus boundaries, decisions — `--cassie-signal`.
- **Care / Memory:** journaling, archive, reflection — `--cassie-memory`.
- **Friction / Caution:** capture, risk, problem framing — `--cassie-caution`.

## 3. Pick a page recipe

Read `references/page-recipes.md`. Use the recipe closest to the user outcome; do not stack every component into every page.

## 4. Compose from contracts

Read `references/component-contracts.md`. Reuse the role, hierarchy, and states of existing components. Add a new component only if it solves a recurring information problem; document it when you do.

## 5. Implement tokens, then details

Load `tokens.css` before page-specific CSS. Keep page-specific colors as aliases to system tokens. Use fluid type and spacing. Build the narrow layout as a distinct composition rather than a squeezed desktop view.

## 6. Verify the rendered page

Check desktop and mobile. Confirm keyboard focus, readable contrast, valid links, `prefers-reduced-motion`, and that English and Chinese receive the same information—not merely the same DOM placeholder.

## 7. Run the review gate

Use `references/review-checklist.md`. Any P0 failure means the page is not ready to share.
