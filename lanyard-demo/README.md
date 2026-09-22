# Cassie Builder Pass demo

An isolated React/Vite prototype for testing the React Bits Lanyard interaction against the current homepage stage art. It does not modify or mount into the production homepage.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Desktop defaults to a draggable, spring-returning compatibility preview that remains visible without WebGL. An optional “3D 物理” switch loads the original Three.js/Rapier version for capable browsers. Viewports at or below 760px and browsers requesting reduced motion render a static pass. The 3D implementation is lazy-loaded, so compatibility and fallback modes do not request the large Three.js bundle.

The Lanyard component and original binary assets are adapted from [React Bits](https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/Lanyard). See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
