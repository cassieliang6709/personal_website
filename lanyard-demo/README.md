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

Desktop renders the draggable WebGL/physics version. Viewports at or below 760px and browsers requesting reduced motion render a static pass instead. The 3D implementation is lazy-loaded so those fallback modes do not request the large Three.js bundle.

The Lanyard component and original binary assets are adapted from [React Bits](https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/Lanyard). See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
