# Tabs v1 — Pill tab bar + panels

Centered **section header**, **pill tab track**, and **panels**. Ported from ARRC `tabs-v2`, restyled with Exemplifi tokens.

**Live demo:** [src/htmls/tabs-v1.html](../../src/htmls/tabs-v1.html)  
**Overview:** [README.md](./README.md)

---

## Files

| File | Role |
|------|------|
| `src/htmls/tabs-v1.html` | Standalone demo (light + dark sections) |
| `src/assets/scss/components/_tabs.scss` | Shared `.tab-bar` + `.internal-tabs.v1` |
| `src/assets/js/internal-tabs.js` | Tab selection, keyboard, overflow arrows / fades |
| `index.html` | Hub → Tabs → Tabs v1 |

---

## When to use (UI)

- One intro for all tabs, then switch panel content
- CMS-friendly id-free markup (`data-tab-bar`, `data-tab-bar-tab`, `data-tab-bar-panel`)
- Need overflow handling (desktop arrows, mobile edge fades)

---

## Behavior (developers)

1. **Selection** — Click or ←/→/Home/End activates a tab; only the active tab is in the tab order (`tabindex="0"`).
2. **Panels** — Matched by DOM order (or `aria-controls` / `id` when present). Inactive panels get `hidden`.
3. **Overflow** — When tabs overflow: desktop injects prev/next; mobile shows edge fades via `.can-scroll-left` / `.can-scroll-right`.
4. **Motion** — Scroll animation respects `prefers-reduced-motion`.

---

## Markup

```html
<section class="internal-tabs v1 bg-white" aria-labelledby="tabs-heading">
  <div class="container">
    <div class="section-header-wrapper layout-center">
      <div class="section-header-body">
        <h2 id="tabs-heading">Explore Our Services</h2>
        <p>Short intro for all tabs.</p>
      </div>
    </div>

    <div class="tab-bar" data-tab-bar aria-label="Explore our services">
      <div class="tab-list">
        <div class="tab-list-items" role="tablist">
          <button type="button" class="tab-btn is-active" role="tab"
            aria-selected="true" data-tab-bar-tab>Overview</button>
          <button type="button" class="tab-btn" role="tab"
            aria-selected="false" data-tab-bar-tab tabindex="-1">Programs</button>
        </div>
      </div>
      <div class="tab-panels">
        <div class="tab-panel is-active" role="tabpanel" aria-label="Overview" data-tab-bar-panel>
          <!-- panel content -->
        </div>
        <div class="tab-panel" role="tabpanel" aria-label="Programs" data-tab-bar-panel hidden>
          <!-- panel content -->
        </div>
      </div>
    </div>
  </div>
</section>
```

Dark surface: add `bg-primary-dark` on `.internal-tabs.v1` (see demo).

---

## Tokens

| Role | Token / value |
|------|----------------|
| Active pill | `$blue` |
| Focus ring | `$blue` |
| Inactive label | `$gray` |
| Track | `#f4f9ff` + stroke `#c5d4e3` |
| Dark section | `$primary-dark` |

---

## Accessibility checklist

- [x] `role="tablist"` / `tab` / `tabpanel` with `aria-selected`
- [x] Keyboard: ←/→, Home/End
- [x] Inactive panels `hidden`; active panel labelled
- [x] Overflow controls named (`Scroll tabs left/right`)
- [x] Visible `:focus-visible` on tabs and arrows
