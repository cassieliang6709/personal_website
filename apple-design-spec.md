# Cassie Portfolio — Apple HIG–informed Design Specification

> This specification adapts Apple Human Interface Guidelines to a responsive personal website. It does not attempt to imitate an Apple product or reproduce proprietary UI.

## 1. Product and direction

- **Product**: Cassie Liang's bilingual portfolio, helping a visitor understand her work, thinking, and background within two minutes.
- **Primary tasks**: scan selected products, open one case study, understand who Cassie is, and reach her resume or contact details.
- **Structure**: two stable destinations only — `Work` and `Life`.
- **Direction**: quiet, current, compact, content-first, and familiar.
- **Locale**: Chinese first; English remains available as a secondary site.
- **Core principle**: personality comes from the work and selected objects, not from oversized typography or ornamental containers.

## 2. Apple principles translated to the web

1. **Purpose before decoration** — every visible block supports understanding a project, a story, or Cassie herself.
2. **Clear hierarchy** — one page title, one short introduction, then scannable content. Avoid competing display headings.
3. **Content leads the interface** — product screenshots, logos, Travel Passes, and writing titles carry the visual interest.
4. **Familiar interaction** — standard tabs, links, buttons, dialogs, scrolling, Escape-to-close, and browser history.
5. **Comfortable controls** — interactive targets are at least `44 × 44px` on touch layouts.
6. **Legibility** — system typefaces, regular/medium/semibold weights, strong contrast, and no body copy below `13px` on desktop or `15px` on mobile.
7. **Motion follows action** — `160–240ms` transitions; no idle motion, parallax, or bouncing. Respect `prefers-reduced-motion`.
8. **Adaptivity** — the layout compresses before it stacks, then becomes a single column below `760px`.

## 3. Visual system

### Color

- `--color-bg`: `#F5F5F7`
- `--color-surface`: `#FFFFFF`
- `--color-text`: `#1D1D1F`
- `--color-secondary`: `#6E6E73`
- `--color-tertiary`: `#86868B`
- `--color-separator`: `rgba(0, 0, 0, .10)`
- `--color-blue`: `#0066CC`
- `--color-blue-hover`: `#004C99`
- `--color-life`: `#3F6F50`
- Product accent colors are permitted only inside product artwork and marks.

### Typography

- **Interface and headings**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", sans-serif`.
- **No display serif** in navigation, page titles, cards, or dialogs.
- Type scale: `12 / 13 / 15 / 17 / 21 / 28 / 40 / 48px`.
- Desktop hero title: maximum `48px`; mobile: `36px`.
- Body leading: `1.55`; long-form Chinese leading: `1.8`.

### Spacing

- Base unit: `4px`.
- Allowed scale: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64`.
- Main content max width: `1080px`.
- Desktop side padding: `32px`; mobile: `20px`.
- Default section rhythm: `64px`; mobile: `48px`.

### Shape and elevation

- Radius: `10px` small, `16px` medium, `22px` large.
- Prefer grouped backgrounds and dividers over a grid of bordered cards.
- Shadows are reserved for overlays and physical objects such as the Lanyard.
- Never nest a card inside another card.

## 4. Navigation

- A translucent `56px` top bar keeps identity, two tabs, language, and contact visible.
- The active tab uses text weight and a compact filled selection, not a long decorative underline.
- Mobile uses a fixed two-item tab bar above the safe area.
- Switching tabs returns to the top without theatrical scrolling.

## 5. Work surface

- The intro occupies no more than about `420px` vertically on desktop.
- Lanyard is a small, optional identity object. It must not consume half of the first viewport.
- Selected work uses compact two-column rows: visual preview beside name, result, status, and action.
- Secondary experiments use a single grouped list with logos and separators.
- Opening a project presents a right-side inspector on desktop and a full-screen sheet on mobile.

## 6. Life surface

- Intro uses a small editorial image, not a full-bleed hero.
- Travel Passes appear as a horizontally browsable collection; hover may raise a pass by no more than `6px`.
- Reading folders remain tactile but fit within the standard content width and density.
- City and article sheets use the same overlay grammar as project details.

## 7. Component conventions

- Primary actions are blue filled capsules with a `44px` minimum height.
- Secondary actions are plain blue text with a directional chevron.
- Icon-only controls require an accessible label and `44 × 44px` hit area.
- Use a card only when its contents form one selectable object.
- Related repeated items live in one rounded group separated by hairlines.
- Dialogs close on Escape and backdrop click, lock page scrolling, and restore trigger focus.

## 8. Responsive behavior

- `≥ 980px`: compact two-column hero and project rows.
- `760–979px`: reduced type scale and narrower media.
- `< 760px`: single column, full-width sheets, bottom tab bar, horizontal Travel Pass scrolling.
- No horizontal page scroll at any width.
- Meaning and reading order stay identical across breakpoints.

## 9. Accessibility and quality bar

- Visible focus rings on every interactive element.
- Semantic headings follow document order.
- Decorative images use empty alt text; meaningful images describe their content.
- Support `prefers-reduced-motion`.
- Check at `390 × 844`, `768 × 1024`, and `1440 × 900`.
- Initial JavaScript target: under `180KB` gzip.

## 10. Project-specific anti-patterns

- No viewport-height hero sections.
- No headings larger than the product content they introduce.
- No beige editorial newspaper styling.
- No uniform grid of seven nearly identical project cards.
- No glass effect on every surface.
- No decorative numbering unless it helps orientation.
- No animation that runs without a user action.

## 11. Prototype scope

The React prototype in `react-site/` is the visual validation surface for this document. The first implementation includes both Work and Life, project detail sheets, Travel Pass stories, reading folders, and mobile navigation.

## Sources

- Apple Human Interface Guidelines — Design principles
- Apple Human Interface Guidelines — Typography
- Apple Human Interface Guidelines — Accessibility
- Apple UI Design Dos and Don'ts
