# Changelog

All notable changes to this project are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html) — policy in [VERSIONING.md](./VERSIONING.md).

## [Unreleased]

### Changed

- Documentation aligned across [README.md](./README.md), [docs/README.md](./docs/README.md), [docs/components.md](./docs/components.md), [VERSIONING.md](./VERSIONING.md), and this file: clear repo purpose, numbered reading order, full component/demo map (including all SCSS partials and JS modules), and shorter release policy.
- `package.json` scripts: `watch:js` (Vite watch), `watch:all` (`watch:scss` + `watch:js`); removed `watch:vite` / `watch:dist`; `build` aliases `build:js`. README script tables updated.

### Fixed

- Removed debug `console` usage from several component scripts; scoped Exemplifi header handlers to `.ex-header` so other pages do not log or bind global `.navbar-toggler`.
- PG carousel: removed stray `console.log`; mitigated Slick `aria-hidden`/focus issues with `inert` on hidden slides, `accessibility: false`, and capture-phase `focusin` guard; documented that Slick’s touch listeners are non-passive by design (Chrome performance hint).
- Added `public/ajax-loader.gif` (from `slick-carousel`) so built `style.min.css` resolves the Slick loader asset under `src/assets/dist/`.
