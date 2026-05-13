# Internal UI Components

## What this repository is

This repo is an **internal Exemplifi UI kit**: **static HTML pages** that demonstrate reusable patterns (heroes, headers, forms, carousels, and so on). Styles are written in **Sass** (with **Bootstrap 5**). All demo pages load one **minified JavaScript bundle** and one **minified CSS file** produced by **Sass + Vite** into `src/assets/dist/`.

It is **not** a React or npm component library. It is a **reference and copy-paste source** for markup, class names, styles, and behavior—plus a place to review layout and accessibility before patterns go into client projects.

## Who it is for

- Developers integrating or matching Exemplifi front-end patterns  
- Designers checking how patterns render in code  
- Anyone who needs a **stable, browsable set of demos** with a documented build

## Quick start

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
npm run build:all
```

After a clone you **must** run `build:all` once so `src/assets/dist/style.min.css` and `main.min.js` exist. Then open **`index.html`** at the repo root (or serve the folder) and use the **component hub** to open each demo in `src/htmls/`.

For local work on HTML + SCSS + JS:

```bash
npm run watch:all
```

## How demos load assets

Files under `src/htmls/` link to **`../assets/dist/style.min.css`** and **`../assets/dist/main.min.js`**. Load the script with a normal `<script src="...">` (not `type="module"`).

## Project layout

| Path | Role |
|------|------|
| `index.html` | Hub: links to every component demo |
| `src/htmls/` | One standalone HTML demo per pattern (or variant) |
| `src/assets/scss/` | Sass source; entry `styles.scss` |
| `src/assets/css/styles.css` | **Generated** by Sass—do not edit; imported by Vite |
| `src/assets/js/main.js` | Vite entry: imports CSS and all feature scripts |
| `src/assets/dist/` | **Build output:** `style.min.css`, `main.min.js`, emitted assets |
| `public/` | Static assets (favicons, manifest, sample images) |
| `docs/` | Human-readable documentation beyond this file |

## Build commands

| Command | When to use |
|---------|-------------|
| `npm run build:all` | Full production build: `sass:build` then `build:js` → `src/assets/dist/` |
| `npm run build` / `npm run build:js` | Vite production bundle only (after CSS exists from Sass) |
| `npm run watch:all` | **Sass + Vite** in parallel; use while editing static HTML / SCSS / JS for `dist/` |
| `npm run watch:scss` | Sass watch only → `src/assets/css/styles.css` |
| `npm run watch:js` | Vite `--watch` only → `src/assets/dist/` |
| `npm run dev:watch` | Vite dev server + Sass watch |
| `npm run dev` | Vite dev server only |
| `npm run preview` | Preview Vite build output |

## Documentation (reading order)

| Order | File | What you get |
|-------|------|----------------|
| 1 | **This README** | What the repo is, how to run and browse it |
| 2 | [docs/README.md](./docs/README.md) | Repository map, build pipeline, checklist for changes, stack, standards |
| 3 | [docs/components.md](./docs/components.md) | **Every demo listed**, SCSS ↔ JS mapping, bundle behavior, naming, assets, accessibility |
| 4 | [VERSIONING.md](./VERSIONING.md) | SemVer, tags, release workflow |
| 5 | [CHANGELOG.md](./CHANGELOG.md) | What changed in each version |

## Releases and versioning

- [CHANGELOG.md](./CHANGELOG.md) — release history  
- [VERSIONING.md](./VERSIONING.md) — how to choose versions and cut releases  

## Cursor (optional)

When using Cursor in this repo, rule packs under `.cursor/rules/` can be applied in order where relevant: `starter-pack.mdc`, `coding-standard.mdc`, `accessibilitystandards.mdc`.
