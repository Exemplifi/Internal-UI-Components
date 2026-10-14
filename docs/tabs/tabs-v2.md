# Tabs v2 — Chevron route tabs + content

Full-bleed **chevron route tabs** with a sample content panel (intro, info cards, media). Ported from ARRC `explore-by-route` **without** nested Route info / Onboard / Map pills.

**Live demo:** [src/htmls/tabs-v2.html](../../src/htmls/tabs-v2.html)  
**Overview:** [README.md](./README.md)

---

## Files

| File | Role |
|------|------|
| `src/htmls/tabs-v2.html` | Standalone demo |
| `src/assets/scss/components/_tabs.scss` | `.internal-tabs.v2` |
| `src/assets/js/internal-tabs.js` | `initInternalRouteTabs()` |
| `index.html` | Hub → Tabs → Tabs v2 |

---

## When to use (UI)

- Switch between peer topics / routes with a chevron tab strip
- One content block per tab (no second-level pill tabs)

Use [v1](./tabs-v1.md) for centered pill bars.

---

## Behavior

1. **Route tabs** — Click or ←/→/Home/End switches `[data-route-panel]` by index.
2. **Overflow** — Mobile: horizontal scroll; active tab scrolls into view.
3. **Sample panel** — Intro + lead + 2×2 cards + image (replace with CMS content).

---

## Markup

```html
<section class="internal-tabs v2" data-internal-route-tabs aria-label="Explore by route">
  <div class="route-tabs" role="tablist" aria-label="Sample routes">
    <button type="button" class="route-tab is-active" role="tab"
      aria-selected="true" data-route-tab>Coastal Classic</button>
    <button type="button" class="route-tab" role="tab"
      aria-selected="false" data-route-tab tabindex="-1">Denali Star</button>
  </div>

  <div class="container internal-tabs-v2__content">
    <div class="route-panels">
      <article class="route-panel is-active" role="tabpanel" aria-label="Coastal Classic" data-route-panel>
        <div class="internal-tabs-v2__intro">…</div>
        <div class="internal-tabs-v2__panel">
          <div class="internal-tabs-v2__body">…</div>
          <figure class="internal-tabs-v2__media">…</figure>
        </div>
      </article>
      <article class="route-panel" role="tabpanel" aria-label="Denali Star" data-route-panel hidden>
        …
      </article>
    </div>
  </div>
</section>
```

---

## Tokens

| Role | Token |
|------|-------|
| Section / card icons | `$primary-dark` |
| Active chevron tab / accents | `$blue` |
| Tab track | `#243443` |
| Cards | `$white` |
