# Timeline Section (V1)

A scroll-driven historical timeline with a **sticky horizontal navigation bar**, **progress indicator**, and **linked content articles**. Nav tabs and articles stay in sync while the user scrolls or clicks a date range.

**Live demo:** [src/htmls/timeline-v1.html](../../src/htmls/timeline-v1.html)

For repository setup and builds, see the root [README.md](../../README.md) and [docs/README.md](../README.md).

---

## Files

| File | Role |
|------|------|
| `src/htmls/timeline-v1.html` | Standalone demo markup |
| `src/assets/scss/components/_timeline-v1.scss` | Styles (imported as `timeline-v1` in `_components.scss`) |
| `src/assets/js/timeline-v1.js` | Scroll spy, nav clicks, progress bar, line height |
| `src/assets/js/main.js` | `import "./timeline-v1.js";` |
| `src/assets/scss/components/_components.scss` | `@import "timeline-v1";` |

After changing SCSS or JS, run `npm run build:all` (or `npm run watch:all`) so demos that load `../assets/dist/main.min.js` and `../assets/dist/style.min.css` stay up to date.

---

## Behavior

1. **Sticky navigation** — `.timeline-navigation-wrapper` sticks to the top of the viewport while content scrolls beneath it.
2. **Scroll spy** — As the user scrolls, the nav tab whose linked article has crossed the “reading line” (just below the sticky nav) receives `.active`. The matching `article.timeline-item` also gets `.active` (marker scales up).
3. **Click navigation** — Nav links use in-page anchors (`href="#01"`). Clicks smooth-scroll so the target article aligns below the nav with a fixed gap.
4. **Progress bar** — `.index-progress-bar` width tracks scroll progress between the current and next nav tab; it fills to 100% on the last tab.
5. **Horizontal nav scroll** — On viewports ≤767px, the active tab scrolls into view (`scrollIntoView` inline start). On larger screens, the nav row scrolls horizontally to center the active tab.
6. **Vertical dashed line** — Height is set via `--timeline-line-height` so the line ends at the bottom of the last item (not through the last marker).
7. **Empty range labels** — If the second `.timeline-range-to` after an arrow SVG is empty, the SVG arrow is removed on load.

---

## Markup structure

Root wrapper:

```html
<section class="timeline-section">
  <!-- Sticky nav + progress -->
  <div class="timeline-navigation-wrapper">…</div>

  <!-- Scrollable articles -->
  <div class="timeline-content-wrapper">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="timeline-content">…</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Navigation (one link per article)

Each `.timeline-range-item` must:

- Use `href="#{id}"` matching a unique `id` on an `article.timeline-item`.
- Appear in the **same order** as its articles in `.timeline-content`.
- Include one or two `.timeline-range-to` spans (start/end labels). Optional arrow SVG between them (`aria-hidden="true"`).

```html
<div class="timeline-range">
  <div class="timeline-items-wrapper">
    <a href="#01" class="timeline-range-item active">
      <span class="timeline-range-to">1840s</span>
      <!-- optional SVG arrow -->
      <span class="timeline-range-from">1870s</span>
    </a>
    <a href="#02" class="timeline-range-item">
      <span class="timeline-range-to">1845</span>
      <!-- … -->
    </a>
  </div>
  <div class="timeline-dashed-line">…</div>
</div>
<div class="index-progress">
  <div class="index-progress-bar"></div>
</div>
```

**Single-date tabs:** Use one `.timeline-range-to` with text, then a second empty `.timeline-range-to` after the SVG—the script removes the arrow when the trailing label is empty.

### Content articles

```html
<article class="timeline-item" id="01">
  <div class="timeline-title">
    <span>1847</span>
  </div>
  <div class="timeline-description">
    <p>…</p>
    <!-- optional <img alt="…"> -->
  </div>
</article>
```

**Contract:** Number of `.timeline-range-item` links should match number of `article.timeline-item` elements, with matching `href` / `id` pairs. The first nav item should have `active` on initial load if that section is in view.

---

## CSS custom properties

Set on `.timeline-content` by JavaScript:

| Property | Set by | Purpose |
|----------|--------|---------|
| `--timeline-line-height` | `updateTimelineLineHeight()` | Height of the dashed vertical line (`::before`) |
| `--nav-article-gap` | `syncNavArticleGapCss()` | `scroll-margin-top` on articles; matches JS scroll offset (default `48px`) |

Active article markers use `.timeline-item.active::before { transform: scale(1.3); }`.

---

## JavaScript configuration

Constants at the top of `timeline-v1.js`:

| Constant | Default | Purpose |
|----------|---------|---------|
| `NAV_ACTIVE_EARLY_PX` | `120` | Pixels before the reading line at which the next tab becomes active |
| `NAV_ARTICLE_GAP_PX` | `48` | Space between sticky nav bottom and article top when scrolling to a section |

The script only runs when `.timeline-section .timeline-content` exists. It listens to `scroll`, `resize`, font load, and `ResizeObserver` on `.timeline-content`.

---

## Adding or customizing a timeline

1. Copy the `<section class="timeline-section">` block from `timeline-v1.html`.
2. Add or remove `.timeline-range-item` / `article.timeline-item` pairs; keep `href` and `id` in sync and order aligned.
3. Mark the default tab with `class="timeline-range-item active"`.
4. Ensure the page loads the built bundle:

   ```html
   <link rel="stylesheet" href="../assets/dist/style.min.css" />
   <script src="../assets/dist/main.min.js"></script>
   ```

5. Rebuild assets after SCSS/JS changes.

To tune scroll feel, adjust `NAV_ACTIVE_EARLY_PX` and `NAV_ARTICLE_GAP_PX` in `timeline-v1.js`, then rebuild.

---

## Layout and dependencies

- Uses Bootstrap **container / row / col-12** for horizontal alignment with the rest of the kit.
- Dark theme: nav background `#040404`, content area `#121212`, accent gold `#cda631` / `#C48D25`.
- Requires the global stylesheet (Bootstrap grid + component partial). No separate npm package.

---

## Accessibility notes

When integrating into production pages:

- Wrap the section in proper landmarks (`<main>`, one per page) and ensure a logical heading hierarchy above the timeline.
- Nav links must have **visible, descriptive text** in `.timeline-range-to` / `.timeline-range-from` (not icon-only).
- Decorative SVGs in the nav should keep `aria-hidden="true"`.
- All informative images in `.timeline-description` need meaningful `alt` text.
- Keyboard users can Tab through nav links and activate with Enter; focus styles must remain visible (do not remove outlines).
- **Screen reader announcements:** `#timeline-v1-announce` (`role="status"`, `aria-live="polite"`) reads the active article title and body when a nav tab is clicked. Each `article.timeline-item` is focusable (`tabindex="-1"`) and receives focus after scroll so assistive tech can read the section in context.
- Nav tabs expose `aria-current="location"` when active, `aria-controls` pointing to the linked article, and `aria-label` derived from visible date text.
- `prefers-reduced-motion` disables smooth scrolling in the click handler.
- For long nav lists, ensure horizontal scroll does not trap focus; current pattern uses native `<a>` elements only.

See [.cursor/rules/accessibilitystandards.mdc](../../.cursor/rules/accessibilitystandards.mdc) for full WCAG guidance.

---

## Class reference

| Class | Element | Role |
|-------|---------|------|
| `.timeline-section` | `<section>` | Root component |
| `.timeline-navigation-wrapper` | `<div>` | Sticky nav + progress host |
| `.timeline-range` | `<div>` | Nav track container |
| `.timeline-items-wrapper` | `<div>` | Horizontally scrollable nav row |
| `.timeline-range-item` | `<a>` | Nav tab; `.active` when current |
| `.timeline-range-to` / `.timeline-range-from` | `<span>` | Date labels |
| `.timeline-dashed-line` | `<div>` | Decorative dashed line under tabs |
| `.index-progress` / `.index-progress-bar` | `<div>` | Scroll progress track / fill |
| `.timeline-content-wrapper` | `<div>` | Padded content area |
| `.timeline-content` | `<div>` | Article list + vertical line |
| `.timeline-item` | `<article>` | One timeline entry; `.active` when in view |
| `.timeline-title` | `<div>` | Entry heading (year/range) |
| `.timeline-description` | `<div>` | Body copy and media |
