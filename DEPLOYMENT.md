# Deployment

The site is deployed to two hosts from the `main` branch and repository root.

## Vercel (primary)

- Project: `liangyue-site`
- Live URL: `https://liangyue.site`
- WWW alias: `https://www.liangyue.site`
- English route: `https://liangyue.site/en/`

```bash
vercel --prod
```

Custom domains are aliased to the latest production deployment. `.vercelignore`
excludes internal documentation, source-quality PNG artwork, and the
`assets/scenes/` experiment directory.

## GitHub Pages (mirror)

- Repository: `https://github.com/cassieliang6709/personal_website`
- Live URL: `https://cassieliang6709.github.io/personal_website/`
- English route: `https://cassieliang6709.github.io/personal_website/en/`

Pushes to `main` trigger the `pages build and deployment` workflow automatically.

## Release check

Before pushing `main` or deploying to Vercel:

1. Run `node --check articles.js` and `node --check studio.js`.
2. Run `git diff --check`.
3. Serve the root locally and verify `/`, `/en/`, both résumé PDFs, all five
   article readers, the project links, and the 390 px layout.
4. Push `main` (triggers GitHub Pages) and/or run `vercel --prod`.
5. Verify the live Chinese and English routes on both hosts.
6. Inspect browser console for errors.
