# Internal UI Components

Shared static HTML demos, Sass, and a Vite bundle (jQuery, Bootstrap, Slick, Swiper, AOS, etc.) built to `src/assets/dist/`.

## Prerequisites

- Node.js 18+ and npm

## Setup

```bash
npm install
npm run build:all
```

Run `build:all` after clone so `src/assets/dist/style.min.css` and `main.min.js` exist before opening HTML files from disk.

## Layout

| Path | Purpose |
|------|---------|
| `src/assets/scss/` | Sass entry `styles.scss` |
| `src/assets/css/styles.css` | Sass output (imported by Vite; do not edit) |
| `src/assets/js/main.js` | ESM source entry for Vite |
| `src/assets/dist/` | Built `main.min.js`, `style.min.css`, emitted assets |
| `src/htmls/` | Component demos |
| `index.html` | Hub listing (links to each demo) |

Demos load **`../assets/dist/style.min.css`** and **`../assets/dist/main.min.js`**. The minified JS bundle is not an ES module: use `<script src="...">` without `type="module"`.

## Build

1. Sass: `styles.scss` → `src/assets/css/styles.css`
2. Vite: `main.js` + that CSS → `src/assets/dist/`

| Command | Use |
|---------|-----|
| `npm run build:all` | Full production build |
| `npm run watch:dist` | Watch SCSS + rebuild `dist/` (best for static HTML) |
| `npm run dev:watch` | Vite dev server + Sass watch |
| `npm run dev` | Vite only (use `watch:scss` separately if you edit `.scss`) |

## Optional Cursor workflow

Use internal rule packs in order when relevant: `@starter-pack.mdc`, `@coding-standard.mdc`, `@accessibilitystandards.mdc`.
