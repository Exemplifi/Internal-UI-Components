# Components reference

Everything you need to map **demos**, **Sass partials**, and **JavaScript** in this repository.

**Prerequisites:** [README.md](../README.md) (how to build and open the hub). **Workflow:** [docs/README.md](./README.md) (checklist for new patterns).

---

## How patterns are built here

| Layer | Where it lives |
|--------|----------------|
| Demo page | `src/htmls/*.html` |
| Styles | `src/assets/scss/components/_*.scss`, listed in `_components.scss` |
| Behavior | `src/assets/js/*.js`, imported from `main.js` |

There is **one shared bundle** for all demos: every page loads the same `main.min.js`, which includes every script imported in `main.js`. Initialization should only run when the right DOM nodes exist.

---

## Component demos (hub order)

These match the cards in [index.html](../index.html). **Purpose** is a short description of what the demo illustrates.

| # | Name | Demo file | Purpose | Primary SCSS partial | Primary JS |
|---|------|-----------|---------|------------------------|------------|
| 1 | Hero | [hero.html](../src/htmls/hero.html) | Full-width hero with video/headline/CTA | `heros` | `hero.js` |
| 2 | PG Carousel | [pg-carousel.html](../src/htmls/pg-carousel.html) | Project-style carousel | `pg-carousel` | `pg-carousel.js` (`initPgCarousel` in `main.js`) |
| 3 | Cards | [cards.html](../src/htmls/cards.html) | Card layouts and variants | `cards` | — (globals only) |
| 4 | Accordion | [accordion.html](../src/htmls/accordion.html) | FAQ-style expand/collapse | `accordions` | Bootstrap accordion (no dedicated `accordion.js`) |
| 5 | Form | [form.html](../src/htmls/form.html) | Form layout and controls | `forms` | `form.js` |
| 6 | Table | [table.html](../src/htmls/table.html) | Data / content tables | `tables` | — |
| 7 | Stats | [stats.html](../src/htmls/stats.html) | Stat blocks and figures | `stats` | — |
| 8 | Image & Text | [image-text.html](../src/htmls/image-text.html) | Image beside or with text | `image-and-text` | — |
| 9 | Carousel | [carousel.html](../src/htmls/carousel.html) | Bootstrap, Slick, and Swiper carousel examples | `carousels` | `script.js` (Slick `.slick-carousel-v*`, Bootstrap carousel), `swiper-init.js` |
| 10 | Card with Icon | [card-with-icon.html](../src/htmls/card-with-icon.html) | Icon-led cards | `card-with-icon` | `card-with-icon.js` |
| 11 | Icon & Text | [icon-and-text.html](../src/htmls/icon-and-text.html) | Icon with supporting text | `icon-and-text` | `icon-with-text.js` |
| 12 | Header | [header.html](../src/htmls/header.html) | Site header / navigation | `header` | `header.js` |
| 13 | Exemplifi Header | [exemplifi-header.html](../src/htmls/exemplifi-header.html) | Branded Exemplifi header | `exemplifi-header` | `exemplifi-header.js` |
| 14 | Calendar | [calendar.html](../src/htmls/calendar.html) | Calendar UI | `calendar` | `calendar.js` |
| 15 | Footer | [footer.html](../src/htmls/footer.html) | Footer pattern | `footer` | `footer.js` |
| 16 | Footer V2 | [footer-v2.html](../src/htmls/footer-v2.html) | Alternate footer layout | `footer` | `footer.js` |

---

## SCSS partials included in the global stylesheet

Declared in [\_components.scss](../src/assets/scss/components/_components.scss) (order preserved). Some have no dedicated demo file but still style shared UI.

| Partial (`@import` name) | File | Typical use |
|--------------------------|------|-------------|
| `index` | `_index.scss` | Shared bits (e.g. skip-link) |
| `accordions` | `_accordions.scss` | Accordion demo |
| `buttons` | `_buttons.scss` | Buttons across demos |
| `card-with-icon` | `_card-with-icon.scss` | Card with icon demo |
| `cards` | `_cards.scss` | Cards demo |
| `carousels` | `_carousels.scss` | Carousel demo |
| `pg-carousel` | `_pg-carousel.scss` | PG carousel demo |
| `footer` | `_footer.scss` | Footer demos |
| `forms` | `_forms.scss` | Form demo |
| `header` | `_header.scss` | Header demo |
| `calendar` | `_calendar.scss` | Calendar demo |
| `heros` | `_heros.scss` | Hero demo |
| `icon-and-text` | `_icon-and-text.scss` | Icon & text demo |
| `image-and-text` | `_image-and-text.scss` | Image & text demo |
| `stats` | `_stats.scss` | Stats demo |
| `tables` | `_tables.scss` | Table demo |
| `text-only` | `_text-only.scss` | Text-only patterns |
| `typography` | `_typography.scss` | Typography defaults |
| `exemplifi-header` | `_exemplifi-header.scss` | Exemplifi header demo |

Global variables and Bootstrap wiring also come from `styles.scss` and related `utils/` and `base/` files.

---

## JavaScript modules in the bundle

Imported from [main.js](../src/assets/js/main.js) in this order (after libraries and CSS):

| Module | Role |
|--------|------|
| `form.js` | Form demo behavior |
| `hero.js` | Hero demo behavior |
| `script.js` | Shared: Slick carousels (`.slick-carousel-v*`), Bootstrap carousel hooks |
| `card-with-icon.js` | Card-with-icon demo |
| `icon-with-text.js` | Icon-and-text demo (**filename** `icon-with-text` vs **demo** `icon-and-text`) |
| `header.js` | Header demo |
| `footer.js` | Footer demos |
| `exemplifi-header.js` | Exemplifi header |
| `calendar.js` | Calendar |
| `swiper-init.js` | Swiper instances for carousel markup |
| `pg-carousel.js` | PG carousel (`initPgCarousel` called from `main.js` on `$(function(){...})`) |

Libraries loaded before these: **jQuery**, **slick-carousel**, **Bootstrap**, **bs5-lightbox**, **Lucide**, **AOS** (+ AOS CSS).

---

## Naming conventions

| Artifact | Convention |
|----------|------------|
| Demo HTML | `kebab-case.html` under `src/htmls/` |
| SCSS | `_name.scss` in `components/`; import as `"name"` in `_components.scss` |
| JS | Prefer `kebab-case.js`; keep `icon-with-text.js` in sync with `main.js` imports |

---

## Assets

- Images and media: commonly `src/assets/images/` (paths from `src/htmls/` look like `../assets/images/...`).  
- **Lucide:** icons initialized globally in `main.js`.  
- **public/:** favicons, manifest, shared static files for Vite.

---

## Accessibility

Treat each demo like production: semantic HTML, labels, keyboard use, visible focus, sensible headings. Follow [`.cursor/rules/accessibilitystandards.mdc`](../.cursor/rules/accessibilitystandards.mdc).

---

## Related

| File | Purpose |
|------|---------|
| [README.md](../README.md) | Repo overview and commands |
| [docs/README.md](./README.md) | Handbook and change checklist |
| [CHANGELOG.md](../CHANGELOG.md) | Log changes under `[Unreleased]` when you touch patterns |
