# Cassie's Room

[Live site](https://cassieliang6709.github.io/personal_website/) · [English route](https://cassieliang6709.github.io/personal_website/en/)

A bilingual, room-shaped personal portfolio for Cassie Liang. Visitors move
through five spaces—Home, About, Timeline, Projects, and Writing—rather than
scrolling through a conventional résumé page.

## What is here

- a modern-room visual system built around cool white, pale wood, muted blush,
  gray-blue, and one yellow interaction cue;
- a four-city timeline from Hami to Shanghai, Hangzhou, and San Jose;
- direct, truthful project destinations for Tabspace, 1Day, Cassie Capture,
  MindBridge, and Vance;
- five complete bilingual articles rendered in a distraction-free reader;
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
- `articles.js` is the bilingual public article collection.
- `assets/room-spec/` contains the final room artwork.
- `assets/resume/` contains the current public résumé files.

The source material for public writing lives in Cassie's private Life Archive;
only reviewed text is copied into this public repository. Product claims should
remain separated into shipped behavior, prepared releases, and experiments.

## Deployment

GitHub Pages deploys the repository root from `main` to:

`https://cassieliang6709.github.io/personal_website/`
