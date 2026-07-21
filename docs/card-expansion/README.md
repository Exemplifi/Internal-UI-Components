# Card Expansion

A responsive **card grid** with a **shared expansion panel**. Clicking **Details** on a card opens its body content directly below that card’s visual row; the active card shows a highlighted border and a **Close** control.

**Live demo:** [src/htmls/card-expansion.html](../../src/htmls/card-expansion.html)

For repository setup and builds, see the root [README.md](../../README.md) and [docs/README.md](../README.md).

---

## Files

| File | Role |
|------|------|
| `src/htmls/card-expansion.html` | Standalone demo markup |
| `src/assets/scss/components/_card-expansion.scss` | Styles (imported as `card-expansion` in `_components.scss`) |
| `src/assets/js/card-expansion.js` | Toggle, panel placement by breakpoint, resize reposition |
| `src/assets/js/main.js` | `import "./card-expansion.js";` |
| `src/assets/scss/components/_components.scss` | `@import "card-expansion";` |
| `index.html` | Hub link to the demo |

After changing SCSS or JS, run `npm run build:all` (or `npm run watch:all`) so demos that load `../assets/dist/main.min.js` and `../assets/dist/style.min.css` stay up to date.

---

## Behavior

1. **One panel open at a time** — Opening a card closes any other open card in the same `.card-expansion` section.
2. **Details / Close toggle** — The card button flips label and icon (`+` → `−`), sets `aria-expanded`, and adds `.is-active` on the card.
3. **Panel placement** — `.card-expansion__bodies` is moved into the grid as a `col-12` and inserted **after the last card in the current visual row** (not after a fixed group of three).
4. **Breakpoint columns** — Driven by Bootstrap breakpoints in JS:
   - Mobile (`<768px`): **1** card per row → panel opens directly under that card
   - Tablet (`≥768px`): **2** cards per row → panel opens under that pair
   - Desktop (`≥992px`): **3** cards per row → panel opens under that trio
5. **Close paths** — Card **Close** button, panel **X** (`.card-expansion__body-close`), or `Escape`.
6. **Resize** — If a panel is open, it is repositioned after a short debounce so it stays under the correct visual row.
7. **Reduced motion** — `prefers-reduced-motion` skips smooth `scrollIntoView` when opening.

---

## Markup structure

Root wrapper:

```html
<section class="card-expansion py-5" aria-labelledby="card-expansion-heading">
  <div class="container">
    <div class="card-expansion__group">
      <div class="row g-4 card-expansion__grid">
        <!-- card columns -->
      </div>
      <div class="card-expansion__bodies">
        <!-- one body panel per card -->
      </div>
    </div>
  </div>
</section>
```

Use a **single continuous** `.card-expansion__grid` for all cards (do not split into separate rows of three). That keeps tablet layout at a consistent **2 cards per row**.

### Card (trigger)

Each card column must include an `article.card-expansion__card` and a button whose `aria-controls` matches a body `id`:

```html
<div class="col-12 col-md-6 col-lg-4">
  <article class="card-expansion__card" data-card-id="ce-1">
    <h2 class="card-expansion__card-title" id="ce-1-title">Card title</h2>
    <button
      type="button"
      class="card-expansion__btn"
      aria-expanded="false"
      aria-controls="ce-1-body"
      aria-labelledby="ce-1-title"
    >
      <span class="card-expansion__btn-icon" aria-hidden="true">
        <i data-lucide="plus" class="card-expansion__icon-open"></i>
        <i data-lucide="minus" class="card-expansion__icon-close"></i>
      </span>
      <span
        class="card-expansion__btn-label"
        data-label-open="Details"
        data-label-close="Close"
      >Details</span>
    </button>
  </article>
</div>
```

### Body panel (content)

Place **all** panels inside one `.card-expansion__bodies` sibling of the grid. Each panel `id` must match its card’s `aria-controls`:

```html
<div class="card-expansion__bodies">
  <div
    id="ce-1-body"
    class="card-expansion__body"
    role="region"
    aria-labelledby="ce-1-body-title"
    hidden
  >
    <div class="card-expansion__body-header">
      <h3 class="card-expansion__body-title" id="ce-1-body-title">Card title</h3>
      <button
        type="button"
        class="card-expansion__body-close"
        aria-label="Close Card title details"
      >
        <i data-lucide="x" aria-hidden="true"></i>
      </button>
    </div>
    <div class="card-expansion__body-content">
      <!-- text, two-column layouts, file links, etc. -->
    </div>
  </div>
</div>
```

**Contract:** One body per card; `aria-controls` / `id` pairs must match. Cards can be added or removed freely as long as that pairing stays in sync.

### Optional content patterns

Inside `.card-expansion__body-content`:

| Pattern | Classes |
|---------|---------|
| Two-column decision layout | Bootstrap `row` / `col-lg-6` + `.card-expansion__col-heading` |
| White info block | `.card-expansion__info` |
| Emphasized label | `.card-expansion__info-label` |
| File / PDF link | `.card-expansion__file` (+ icon / name / external spans) |

---

## Grid and layout

| Viewport | Column classes | Cards per row |
|----------|----------------|---------------|
| Mobile | `col-12` | 1 |
| Tablet | `col-md-6` | 2 |
| Desktop | `col-lg-4` | 3 |

Theme tokens (SCSS custom properties on `.card-expansion`):

| Token | Typical value | Use |
|-------|---------------|-----|
| `--ce-card-bg` | `$primary-dark` (`#314459`) | Card / panel background |
| `--ce-accent` | `#faa300` | Active border, Details button |
| `--ce-text` | white | Titles and panel chrome |
| `--ce-radius` | `24px` | Card and panel corners |

Uses Bootstrap **container / row / col-*** for alignment with the rest of the kit. Lucide icons are initialized globally via `main.js` (`createIcons`).

---

## Adding or customizing cards

1. Copy the `<section class="card-expansion">` block from `card-expansion.html`.
2. Add a new `col-12 col-md-6 col-lg-4` card in `.card-expansion__grid`.
3. Add a matching `#…-body` panel inside `.card-expansion__bodies`.
4. Wire `aria-controls`, body `id`, and heading `id`s consistently.
5. Ensure the page loads the built bundle:

   ```html
   <link rel="stylesheet" href="../assets/dist/style.min.css" />
   <script src="../assets/dist/main.min.js"></script>
   ```

6. Rebuild assets after SCSS/JS changes.

---

## Accessibility notes

When integrating into production pages:

- Keep a single logical heading hierarchy; card titles and body titles should relate clearly.
- Toggle buttons expose `aria-expanded` and `aria-controls`; prefer `aria-labelledby` pointing at the card title.
- Panel close controls need a descriptive `aria-label` (e.g. “Close … details”).
- Decorative Lucide icons use `aria-hidden="true"`.
- File links that open in a new tab should include a visually hidden “(opens in a new tab)” note.
- Body regions use `role="region"` and `aria-labelledby` for the panel title; start with the `hidden` attribute when collapsed.
- Focus rings are defined for `.card-expansion__btn`, `.card-expansion__body-close`, and `.card-expansion__file`.
- `Escape` closes the open panel; keyboard users can activate buttons with Enter / Space (native `<button>`).

See [.cursor/rules/accessibilitystandards.mdc](../../.cursor/rules/accessibilitystandards.mdc) for full WCAG guidance.

---

## Class reference

| Class | Element | Role |
|-------|---------|------|
| `.card-expansion` | `<section>` | Root component |
| `.card-expansion__group` | `<div>` | Grid + bodies wrapper |
| `.card-expansion__grid` | `.row` | Continuous card grid |
| `.card-expansion__card` | `<article>` | Card; `.is-active` when open |
| `.card-expansion__card-title` | heading | Card title |
| `.card-expansion__btn` | `<button>` | Details / Close toggle |
| `.card-expansion__btn-label` | `<span>` | Label; `data-label-open` / `data-label-close` |
| `.card-expansion__icon-open` / `__icon-close` | icon | Plus / minus visibility by state |
| `.card-expansion__bodies` | `<div>` | Host for all panels; moved into grid when open (`.is-open`, `.col-12`) |
| `.card-expansion__body` | `<div>` | One panel; `.is-active` when shown |
| `.card-expansion__body-header` | `<div>` | Title + close row |
| `.card-expansion__body-title` | heading | Panel title |
| `.card-expansion__body-close` | `<button>` | Close panel (X) |
| `.card-expansion__body-content` | `<div>` | Panel content |
| `.card-expansion__col-heading` | heading | Column heading inside panel |
| `.card-expansion__info` | `<div>` | White content block |
| `.card-expansion__info-label` | `<p>` | Bold label inside info |
| `.card-expansion__file` | `<a>` | Document / external link row |
