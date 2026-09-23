# Cassie Liang Personal Website — Redesign Specification

> Status: implementation-ready IA/UX specification; visual direction baseline pending one real-page mockup review.
> Direction: modern-minimal structure × warm-content atmosphere × Cassie's room-world identity.

## 1. Objective

Rebuild the portfolio around two primary destinations:

1. **WORK / 做的东西** — prove Cassie's ability to find real problems, design products, build them, and ship.
2. **LIFE / 生活与想法** — show where Cassie comes from, what she notices, and how she thinks.

The redesign must reduce navigation effort without deleting Cassie's existing work, city stories, essays, comics, or signature interactions.

### Success criteria

- A first-time visitor understands who Cassie is and what she makes within 5 seconds.
- A recruiter can reach a flagship project case study within one click from the default view.
- A curious visitor can discover cities, essays, and comics without navigating to separate pages.
- Lanyard, Travel Pass, and FolderFloat each appear once and have a clear semantic role.
- Desktop and mobile use the same content model; mobile is not a reduced-content version.

## 2. Audience and priority

| Audience | Primary question | Required outcome |
| --- | --- | --- |
| Hiring manager / recruiter | What has Cassie actually made? | Understand 3 flagship products quickly; access resume/contact |
| Product or engineering peer | How does she think and build? | Open case-study details, demos, repositories, technical decisions |
| Collaborator / friend | Who is she beyond a resume? | Explore city stories, writing, and comics |
| Returning reader | What is new? | Recognize recent work and writing without relearning the site |

Priority order: **work evidence → thinking → personal context → decoration**.

## 3. Information architecture

### Persistent global navigation

```text
Cassie Liang                  WORK    LIFE    EN    CONTACT
```

- `WORK` is the default route and default active tab.
- `LIFE` is the only other primary destination.
- `EN` changes locale without changing the current tab or selected object.
- `CONTACT` opens the user's mail client; it is not a form.
- Resume is a visible utility action in the WORK introduction and global footer, not a third tab.

### Routes

| Route | Content | Shareable state |
| --- | --- | --- |
| `/` or `#work` | WORK | Selected product may use `?project=id` or an equivalent stable URL |
| `#life` | LIFE | Selected city/article may use stable query/hash state |

Back/forward navigation must restore the selected tab and opened item. Do not encode hover or animation state in the URL.

### Removed as top-level navigation

- Home
- About
- Timeline / 走过的路
- Reading corner
- Room scenes

Their content remains, but is recomposed inside WORK and LIFE.

## 4. Page model

## 4.1 WORK — 做的东西

### Section W1 — Identity / current position

Two-column desktop, one-column mobile.

**Content:**

- Name: `Cassie Liang / 梁悦`
- Positioning: `AI 学生，1day的独立开发者。`
- One compact sentence about the current focus.
- Actions: `看作品` (scrolls to flagship work), `下载简历`, `GitHub`.
- Lanyard lives here as a physical identity object.

**Lanyard contract:**

- It is secondary to the identity copy, never the only introduction.
- Dragging is optional delight; clicking opens a compact About panel.
- Release returns the pass to rest position.
- Reduced-motion mode keeps it static and clickable.
- It must not occupy more than 40% of the first viewport on desktop.

### Section W2 — Flagship work

Feature exactly three projects in the first pass:

1. MindBridge
2. 1Day
3. Tabspace

Each flagship entry is a large editorial project band, not an equal small card.

Required fields:

- Product identity: logo + name
- One-sentence problem statement
- Current status
- One primary visual: real screenshot, prototype frame, or product UI
- Role / contribution
- Primary action: `查看案例`
- Secondary action, only when real: `体验 Demo`, `App Store`, `Chrome Web Store`, or `GitHub`

Alternate image/text alignment between projects on desktop. Maintain the same reading order in the DOM.

### Section W3 — More experiments

Compact index for Vance, CorpCheck, Cassie Capture, Locki, and future work.

- Use logo, name, one-line problem, status.
- Two columns maximum on desktop; one column on mobile.
- Cards are allowed because each item is a distinct product object.
- Do not repeat demo/source/download actions as multiple pills. Open detail first; place destinations inside detail.

### Section W4 — How I work

One short visual process strip:

```text
真实问题 → 做出原型 → 找人使用 → 修正并发布
```

Use one concrete example beneath each step. Maximum 80 Chinese characters total outside the examples.

### Product detail surface

Desktop: right-side sheet, 560–680 px wide.

Mobile: full-screen sheet.

Structure:

1. Sticky header: logo, product name, status, close
2. Problem
3. What Cassie made
4. One difficult decision or technical constraint
5. Result / current state
6. Media strip
7. Real destinations

Body is the only scroll container. Closing returns focus and scroll position to the originating product.

## 4.2 LIFE — 生活与想法

LIFE is a single continuous page with three chapters. It is not a blog index.

### Section L1 — Introduction

- Headline: `我走过的地方，也塑造了我做东西的方式。`
- One supporting line only.
- Reuse the room illustration as an atmospheric opening image, not a hotspot map.
- No instructional copy such as “click around the room.”

### Section L2 — Travel Pass / 走过的路

Retain the four overlapping passes:

- 哈密
- 上海
- 杭州
- San Jose

Interaction:

- Hover/focus separates and lifts the active card.
- Click opens the complete existing city story in a reading sheet.
- Do not show abbreviated story paragraphs under the cards.
- Only one city can be open.
- Mobile uses a horizontally scrollable snap row or controlled fan; no off-screen inaccessible overlap.

Travel Pass means **lived experience**. Do not reuse the same component for products or articles.

### Section L3 — Reading folders / 收下来的想法

Retain three FolderFloat groups:

- 做东西
- 想事情
- 生活记录

Interaction:

- Click a folder to reveal up to four article titles.
- Opening one folder closes the previous one.
- Pagination stays inside the active folder group.
- Article title opens the complete existing article in a reading sheet.
- `待机小蘑菇` preserves all five comic episodes and original text.
- Physics collision and draggable titles are optional desktop enhancements, disabled on mobile and reduced-motion mode.

FolderFloat means **private archive / collected thoughts**. It must not become a general-purpose navigation component.

### Section L4 — Compact about / now

End the page with:

- Current city / program / focus
- Three short “现在” items
- Resume, email, GitHub
- One portrait or illustrated identity image

Do not repeat a full chronological resume here.

## 5. Content strategy

### Homepage copy limits

- Hero supporting copy: maximum 60 Chinese characters.
- Product summary: maximum 36 Chinese characters.
- Project band body: maximum 120 Chinese characters before detail.
- LIFE introduction: maximum 50 Chinese characters.
- No section may begin with two consecutive explanatory paragraphs.

### Voice

- Direct, specific, first-person where appropriate.
- Prefer concrete situations over capability claims.
- Avoid: `赋能`, `探索无限可能`, `热爱创新`, `打造极致体验`, and generic AI language.
- Product status must be factual: shipped, beta, demo available, package ready, or archived.

### Bilingual behavior

- Primary locale: Simplified Chinese.
- Secondary locale: English.
- Switching locale preserves tab, opened project/city/article, and scroll context where feasible.
- English copy is authored, not mechanically mirrored inside the Chinese interface.

## 6. Visual direction

### Character

`clear / warm / crafted`

- Clear like Paco Coursey's information hierarchy.
- Crafted like Rauno Freiberg's interaction details.
- Personal and growing like Maggie Appleton's content world.
- The visual identity remains Cassie's warm room, not a monochrome clone of those references.

### Color baseline

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F6F2E9` | Main warm canvas |
| `--surface` | `#FFFDF7` | Sheets and true object surfaces |
| `--surface-blue` | `#E8EEF0` | WORK highlight, restrained |
| `--surface-green` | `#E7ECE2` | LIFE highlight, restrained |
| `--ink` | `#29302B` | Primary text |
| `--ink-secondary` | `#626B63` | Supporting text |
| `--ink-muted` | `#8A9087` | Metadata only |
| `--line` | `#D8D9CF` | Dividers and object borders |
| `--work` | `#416C82` | WORK active state and links |
| `--life` | `#667A58` | LIFE active state and links |
| `--warm-accent` | `#B56F45` | Rare emphasis, not primary CTA fill |
| `--error` | `#A94F45` | Errors only |

No dark mode in v1. The illustrations and comic reading experience are designed for a warm light canvas.

### Typography baseline

| Role | Font | Weight |
| --- | --- | --- |
| Display / editorial heading | `Noto Serif SC`, system serif fallback | 500–600 |
| UI / body | `DM Sans`, `Noto Sans SC`, system sans | 400–600 |
| Metadata | same sans, uppercase English only | 500 |

- Display sizes: `64 / 48 / 36 / 28 / 22 px`.
- Body sizes: `18 / 16 / 14 / 12 px`.
- Long-form Chinese measure: `32–38em`; line-height `1.9`.
- UI body line-height: `1.55–1.7`.
- Metadata letter spacing: max `0.10em`; never apply tracking to Chinese paragraphs.

### Spacing

- Base unit: `4px`.
- Allowed scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`.
- Desktop content width: max `1240px`; minimum page gutter `48px`.
- Mobile gutter: `20px`.
- Major section spacing: `96–128px` desktop; `64–80px` mobile.

### Radius

- `--radius-sm: 6px` — images, small controls.
- `--radius-md: 10px` — sheets and contained objects.
- `--radius-lg: 16px` — modal/sheet outer surface only.
- Full pills only for tabs, status chips, and scene-like physical labels.

### Containers

- Default strategy: **divider + whitespace**.
- Use bordered surfaces only for actual objects: product card, pass, folder, sheet.
- Do not wrap entire sections in white rounded rectangles.
- Do not nest cards.

### Elevation

- Default content: flat.
- Interactive physical objects: `0 10px 30px rgba(45,42,38,.08)`.
- Overlay: `0 24px 80px rgba(35,39,34,.18)`.
- Never combine strong border, large radius, and strong shadow on one surface.

### Icons

- Use one outlined icon set: Phosphor regular.
- Sizes: 16 / 20 / 24 px.
- Product logos remain custom brand assets and are not converted to icons.
- Arrows are directional cues, not decoration on every card.

## 7. Motion system

Motion is expressive only for the three signature objects; everything else is restrained.

| Context | Duration | Pattern |
| --- | --- | --- |
| Hover / press | 120–160 ms | color, 1–3 px translate |
| Tab and local state | 180–240 ms | fade + small translate |
| Sheet open/close | 220–280 ms | opacity + translate; exit no slower |
| Folder/Pass reveal | 420–560 ms | component-specific, interruptible |

Default easing: `cubic-bezier(.22,1,.36,1)`.

Allowed expressive interactions:

- Lanyard drag and return
- Travel Pass fan separation
- FolderFloat title reveal

Forbidden:

- Continuous decorative floating outside FolderFloat
- Scroll hijacking
- Parallax on long-form text
- Page-wide blur transitions
- Staggering every list or card
- Multiple spring systems controlling the same element

All signature motion must provide an equivalent static interaction under `prefers-reduced-motion`.

## 8. Responsive behavior

### Breakpoints

- Compact: `< 700px`
- Medium: `700–1023px`
- Wide: `≥ 1024px`

### Mobile navigation

Fixed bottom two-tab control:

```text
作品                                      生活
```

- Respect safe-area inset.
- Utilities move to a compact top row or overflow menu.
- The control cannot cover final content; reserve bottom space.

### Mobile sheets

- Full-screen, `100dvh`.
- Sticky header, single scrolling body.
- Close action is at least 44 × 44 px.
- Browser back closes the sheet before changing the primary tab.

### Media

- Provide width/height or aspect ratio before load.
- Product screenshots use natural UI ratio; do not crop essential controls.
- Comic pages remain full-width and vertically readable.

## 9. Interaction and accessibility contracts

- Every clickable object uses a native link or button.
- Visible focus uses a 2 px ring with 4 px offset, colored by current tab.
- Hover is never the only way to reveal an action.
- Escape closes the topmost sheet.
- Opening a sheet locks body scroll; the sheet body owns scrolling.
- Closing restores focus to the initiating object.
- Background clicks may close reading/detail sheets; internal clicks never do.
- Status colors always have text labels.
- Images require meaningful alt text; decorative room fragments use empty alt.
- Minimum text/background contrast target: WCAG AA.

## 10. Component inventory

| Component | Responsibility | Reuse limit |
| --- | --- | --- |
| `SiteHeader` | Identity, WORK/LIFE tabs, utilities | Global |
| `MobileTabBar` | WORK/LIFE mobile switching | Global mobile |
| `LanyardIdentity` | Personal identity and About entry | WORK hero only |
| `FlagshipProject` | Large product story preview | Three flagship projects |
| `ProductIndexItem` | Compact additional product | WORK secondary index |
| `DetailSheet` | Shared accessible sheet shell | Product/city/article variants |
| `TravelPassDeck` | Four city stories | LIFE only |
| `FolderFloat` | Three writing collections | LIFE only |
| `ArticleReader` | Long-form and comic reader | Article detail |
| `SiteFooter` | Resume, GitHub, email, locale | Global |

`DetailSheet` shares overlay behavior, focus handling, viewport sizing, and header/body structure. Product, city, and article content stay separate domain components.
## 11. Data model

Content is data-driven and independent of presentation:

- `Project`: identity, localized problem/summary/status/role, sections, media, destinations, featured state.
- `CityStory`: stable city ID, localized title/period/body/quote, artwork.
- `Article`: stable ID, `build | reflection | life` category, localized title/deck/body, optional comic episodes.
- `Destination`: label, URL, destination type, availability.

Do not copy article or city content into component files. Existing `articles.js` and `cityStories` content must migrate without truncation.

## 12. Performance budget

- Initial WORK route JS: target `< 180 KB gzip` excluding lazy detail media.
- LIFE interaction bundle loads when LIFE is first requested.
- Comic images lazy-load only after opening the comic article.
- Large workbench/city atlas images must be converted to responsive WebP/AVIF variants before production.
- Avoid importing all comic files eagerly into the initial bundle.
- Font strategy: subset/self-host Chinese display font if practical; avoid blocking multiple remote families.
- No animation loop runs when its component is closed or outside the active tab.

## 13. Implementation sequence

### Phase 1 — Shell and content model

- Build two-tab React shell and stable route state.
- Consolidate color/type/spacing tokens.
- Migrate project, city, and article data.
- Build shared `DetailSheet` behavior.

Acceptance: both tabs work with text-only real content; back/forward and focus restoration pass.

### Phase 2 — WORK

- Identity hero and Lanyard.
- Three flagship project bands.
- Secondary project index.
- Product detail sheet.

Acceptance: recruiter path from load to project evidence is one click; all real destinations work.

### Phase 3 — LIFE

- Room atmosphere hero.
- Travel Pass and complete city stories.
- FolderFloat, pagination, all original articles, full comic reader.
- Compact About/Now ending.

Acceptance: no existing city/article/comic content is lost; mobile reading is usable.

### Phase 4 — Polish and release

- Motion/reduced-motion pass.
- Responsive and keyboard QA.
- Asset optimization and bundle split.
- Chinese/English parity check.
- Replace production only after explicit visual approval.

## 14. Anti-patterns

- Five room scenes functioning as five separate navigation destinations.
- Equal cards for every product regardless of importance.
- A white rounded container around each section.
- Multiple action pills repeated on every card.
- Decorative motion with no content meaning.
- Generic AI gradients, glass panels, glowing borders, or floating particles.
- Placeholder metrics or claims unsupported by real usage.
- Hiding original long-form writing behind excerpts only.
- Treating mobile as a scaled-down desktop fan layout.

## 15. Verification checklist

- [ ] WORK/LIFE meaning is understandable without onboarding copy.
- [ ] First viewport identifies Cassie and exposes real work.
- [ ] Three flagship products are visually distinct.
- [ ] Every detail surface closes by button, Escape, backdrop, and browser back where applicable.
- [ ] Focus and scroll position restore after close.
- [ ] Travel Pass contains all four complete stories.
- [ ] FolderFloat exposes every existing article through pagination.
- [ ] All five mushroom comic episodes render in order.
- [ ] Chinese and English preserve the same information architecture.
- [ ] Keyboard, touch, reduced-motion, and 390 px mobile flows pass.
- [ ] Production bundle does not eagerly load all comic media.
- [ ] Existing production site remains unchanged until approval.

## 16. Open visual decisions

These require a real WORK-page mockup before becoming final design-system decisions:

1. Whether the display serif appears only in LIFE/editorial headings or across both tabs.
2. Whether the WORK accent stays dusty blue or moves closer to the current moss green.
3. Whether the room illustration appears as a wide crop or a smaller printed-photo object.
4. Exact flagship project media treatment: full screenshot, device frame, or annotated crop.

The implementation must not invent additional visual systems before these four are resolved.
