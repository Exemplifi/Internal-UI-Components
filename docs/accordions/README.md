# Accordions

Shared accordion patterns in this kit. Use this folder when implementing or reviewing FAQ / team expand-collapse UI.

For repository setup and builds, see the root [README.md](../../README.md) and [docs/README.md](../README.md). Full component index: [components.md](../components.md).

---

## Which variant to use

| Variant | Demo | Best for | Behavior |
|---------|------|----------|----------|
| **v1** | [accordion.html](../../src/htmls/accordion.html) | Simple FAQ list | Bootstrap collapse |
| **v2** | [accordion-v2.html](../../src/htmls/accordion-v2.html) | Nested parent / child sections | Bootstrap collapse |
| **v3** | [accordions-v3.html](../../src/htmls/accordions-v3.html) | FAQ inside a collapsible group shell | [internal-accordion.js](../../src/assets/js/internal-accordion.js) — see [accordions-v3.md](./accordions-v3.md) |
| **v4** | [accordions-v4.html](../../src/htmls/accordions-v4.html) | Team / bio panels with photo + text | Same JS — see [accordions-v4.md](./accordions-v4.md) |

**v3 and v4** share one script and one SCSS block under `.internal-accordion`. Prefer them for new CMS-friendly work (no fixed `id`s required in author markup).

---

## Shared files (v3 / v4)

| File | Role |
|------|------|
| `src/assets/scss/components/_accordions.scss` | Styles for v1–v4 (v3 / v4 = `.internal-accordion`) |
| `src/assets/js/internal-accordion.js` | Id-free open / close for `[data-internal-accordion]` |
| `src/assets/js/main.js` | `import "./internal-accordion.js";` |
| `src/assets/scss/components/_components.scss` | `@import "accordions";` |
| `index.html` | Hub links under Accordion |

After SCSS or JS changes, run `npm run build:all`.

---

## Design tokens (v3 / v4)

| Token | Value | Use |
|-------|-------|-----|
| `$primary-dark` | `#314459` | Group shell (v3), panel background (v4) |
| `$blue` | `#0079fe` | Focus outline, FAQ body links |
| `$gray` | `#4c6785` | Section intro text (v4) |
| `$white` / `$black` | — | Card / text contrast |

---

## Docs in this folder

| Doc | Audience |
|-----|----------|
| [accordions-v3.md](./accordions-v3.md) | Developers + UI — FAQ group shell markup, states, a11y |
| [accordions-v4.md](./accordions-v4.md) | Developers + UI — team / media panel markup, layout, a11y |
