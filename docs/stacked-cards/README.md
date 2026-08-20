# Stacked Cards

VVTA **Specialized Services** stacked sticky cards, named Stacked Cards in this kit.

**Live demo:** [src/htmls/stacked-cards.html](../../src/htmls/stacked-cards.html)

Source: `Client-VVTA` `html_mockups/src/htmls/components/specialized-services.html`.

For repository setup and builds, see the root [README.md](../../README.md) and [docs/README.md](../README.md).

---

## Files

| File | Role |
|------|------|
| `src/htmls/stacked-cards.html` | Standalone demo |
| `src/assets/scss/components/_stacked-cards.scss` | Styles |
| `src/assets/js/stacked-cards.js` | Sticky stack + heading chevron |
| `src/assets/js/main.js` | `import "./stacked-cards.js";` |
| `src/assets/scss/components/_components.scss` | `@import "stacked-cards";` |
| `index.html` | Hub link |

After changing SCSS or JS, run `npm run build:all`.

---

## Behavior

1. **Stack** — Cards stick as you scroll; earlier cards scale down behind the next one.
2. **Shell** — A dark frame tracks the stacked cards while they are pinned.
3. **Reduced motion** — Static stacked list, no sticky/scale.
4. **Chevron** — `.heading-chevron` slides in when its parent enters view.

---

## Markup

Root: `<section class="stacked-cards">` with header (eyebrow + chevron title) and `.stacked-cards__stack` (decorative shell + `.stacked-cards__item` cards).
