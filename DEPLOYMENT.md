# Deployment

Production uses GitHub Pages from the `main` branch and repository root.

- Repository: `https://github.com/cassieliang6709/personal_website`
- Live URL: `https://cassieliang6709.github.io/personal_website/`
- English route: `https://cassieliang6709.github.io/personal_website/en/`

## Release check

Before pushing `main`:

1. Run `node --check articles.js` and `node --check studio.js`.
2. Run `git diff --check`.
3. Serve the root locally and verify `/`, `/en/`, both résumé PDFs, all five
   article readers, the project links, and the 390 px layout.
4. Push `main` and wait for the `pages build and deployment` workflow.
5. Verify the live Chinese and English routes and inspect browser console errors.
