# Cassie's Room

[liangyue.site](https://liangyue.site) · [GitHub Pages](https://cassieliang6709.github.io/personal_website/) · [English route](https://liangyue.site/en/)

A bilingual, room-shaped personal portfolio for Cassie Liang. Visitors move
through five spaces—Home, About, Timeline, Projects, and Writing—rather than
scrolling through a conventional résumé page.

The site is deployed to two hosts:

- **Vercel** — `https://liangyue.site` (primary, custom domain)
- **GitHub Pages** — `https://cassieliang6709.github.io/personal_website/` (mirror)

## What is here

- a warm miniature musical-stage visual system built around cream, coral,
  apricot, pale wood, footlights, and gentle scene-change motion;
- a four-city timeline from Hami to Shanghai, Hangzhou, and San Jose;
- direct, truthful project destinations for Tabspace, 1Day, Cassie Capture,
  MindBridge, and Vance;
- fifteen curated bilingual public articles rendered in a distraction-free
  reader, grouped into building notes, reflections, and life archive;
- current Chinese AI/SDE and AI Product résumé PDFs;
- keyboard navigation, reduced-motion support, responsive layouts, and visible
  focus states.

## Local preview

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The English route is `/en/`.

## Content and publishing

- `index.html` contains the room structure and accessible navigation.
- `studio.css` contains the responsive visual system.
- `studio.js` contains room, project, timeline, and reader behavior.
- `articles.js` is the bilingual public article collection. Public adaptations
  preserve contribution boundaries and omit private vault material.
- `assets/room-spec/` contains the final room artwork.
- `en/index.html` is **generated** — run `node scripts/build-en.mjs` after
  editing the `<head>` of `index.html`. Everything below `<head>` is copied
  verbatim, so the two routes cannot drift; only the metadata differs. The other
  entries in `en/` stay symlinks, which is what keeps relative asset paths
  resolving inside the copied markup.
- `assets/resume/` contains the current public résumé files.

The source material for public writing lives in Cassie's private Life Archive;
only reviewed text is copied into this public repository. Product claims should
remain separated into shipped behavior, prepared releases, and experiments.

## Deployment

### Vercel (primary)

The project is linked to Vercel as `liangyue-site`. Deploy from the repository
root:

```bash
vercel --prod
```

Custom domains `liangyue.site` and `www.liangyue.site` are aliased to the
latest production deployment.

`.vercelignore` excludes internal documentation, source-quality PNG artwork,
and the `assets/scenes/` experiment directory from production uploads.

### GitHub Pages (mirror)

GitHub Pages deploys the repository root from `main` to:

`https://cassieliang6709.github.io/personal_website/`

### Release check

Before pushing `main` or deploying:

1. Run `node --check articles.js` and `node --check studio.js`.
2. Run `git diff --check`.
3. Serve the root locally and verify `/`, `/en/`, both résumé PDFs, each article
   category and representative reader, the project links, and the 390 px layout.
4. Push `main` (triggers GitHub Pages) and/or run `vercel --prod`.
5. Verify the live Chinese and English routes and inspect browser console errors.
