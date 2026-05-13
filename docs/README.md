# Documentation handbook

This file is **step 2** after the root [README.md](../README.md). Read that first for what the repository is and how to run it.

## Contents

1. [Repository map](#repository-map)
2. [Build pipeline](#build-pipeline)
3. [How demos load assets](#how-demos-load-assets)
4. [Components reference](./components.md) — all demos, SCSS partials, JavaScript modules
5. [Adding or changing a pattern](#adding-or-changing-a-pattern)
6. [Runtime stack](#runtime-stack)
7. [Standards](#standards)
8. [Other documents](#other-documents)

---

## Repository map

| Location | Role |
|----------|------|
| `index.html` | Hub linking to every demo in `src/htmls/` |
| `src/htmls/*.html` | Standalone demo pages |
| `src/assets/scss/` | Sass; entry `styles.scss` |
| `src/assets/css/styles.css` | **Generated** from Sass; imported in `main.js` for Vite—do not edit |
| `src/assets/js/main.js` | Vite ESM entry: libraries, CSS, feature scripts |
| `src/assets/js/*.js` | Feature scripts imported from `main.js` |
| `src/assets/dist/` | **Output:** `style.min.css`, `main.min.js` |
| `public/` | Vite `publicDir` (favicons, manifest, shared images) |
| `.cursor/rules/` | Coding and accessibility guidance |

Styles for UI blocks are aggregated in `src/assets/scss/includes/_includes.scss` → `components/_components.scss` (`@import` of each partial under `components/`).

---

## Build pipeline

1. **Sass:** `src/assets/scss/styles.scss` → `src/assets/css/styles.css` (compressed).  
2. **Vite:** `src/assets/js/main.js` (and imported CSS) → `src/assets/dist/`.

| Command | Typical use |
|---------|-------------|
| `npm run build:all` | Sass + Vite production build |
| `npm run watch:all` | `watch:scss` + `watch:js` in parallel → refresh `dist/` |
| `npm run watch:scss` | Sass watch only |
| `npm run watch:js` | Vite watch only |
| `npm run dev:watch` | Vite dev server + Sass watch |

Full command list: root [README.md](../README.md#build-commands).

---

## How demos load assets

Demos under `src/htmls/` use relative paths to **`../assets/dist/style.min.css`** and **`../assets/dist/main.min.js`**, plus `<script src="...">` without `type="module"`. If you move folders, update those paths everywhere.

---

## Adding or changing a pattern

1. **Demo** — Add or edit `src/htmls/*.html` (copy head/link/script pattern from an existing demo).  
2. **Styles** — Add `src/assets/scss/components/_your-partial.scss` and `@import "your-partial";` in `components/_components.scss` (import name without `_` or `.scss`).  
3. **Script** — Add `src/assets/js/your.js` and `import "./your.js";` in `main.js`.  
4. **Hub** — Add a card in root `index.html`.  
5. **Changelog** — Note user-visible or contract changes under `[Unreleased]` in [CHANGELOG.md](../CHANGELOG.md).  
6. **Dist** — Run `npm run build:all` and commit `src/assets/dist/` if your team tracks built files in Git.

---

## Runtime stack

Bundled from `main.js` (verify there for the live list):

- jQuery (global `$` / `jQuery`)  
- slick-carousel  
- Bootstrap 5 JS  
- bs5-lightbox  
- Lucide (`createIcons`)  
- AOS (+ `prefers-reduced-motion` handling in init)  
- Swiper (via `swiper-init.js`)  
- Feature modules: `form.js`, `hero.js`, `script.js`, `card-with-icon.js`, `icon-with-text.js`, `header.js`, `footer.js`, `exemplifi-header.js`, `calendar.js`, `pg-carousel.js`

---

## Standards

- **Accessibility:** [`.cursor/rules/accessibilitystandards.mdc`](../.cursor/rules/accessibilitystandards.mdc)  
- **HTML / SCSS / JS style:** [`.cursor/rules/coding-standard.mdc`](../.cursor/rules/coding-standard.mdc)  
- **Broader Cursor context:** [`.cursor/rules/starter-pack.mdc`](../.cursor/rules/starter-pack.mdc)  

There is no automated test suite in this repo yet; use keyboard checks, IDE linters, and a11y browser tools as needed.

---

## Other documents

| File | Purpose |
|------|---------|
| [components.md](./components.md) | Full component and stylesheet reference |
| [CHANGELOG.md](../CHANGELOG.md) | Release notes |
| [VERSIONING.md](../VERSIONING.md) | Version and release policy |
