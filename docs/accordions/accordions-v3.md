# Accordions v3 — FAQ group shell

Collapsible **FAQ group**: a dark shell with a section title and chevron that expands/collapses a list of white Q&amp;A cards. Only one FAQ item is open at a time.

**Live demo:** [src/htmls/accordions-v3.html](../../src/htmls/accordions-v3.html)  
**Overview:** [README.md](./README.md)

---

## Files

| File | Role |
|------|------|
| `src/htmls/accordions-v3.html` | Standalone demo |
| `src/assets/scss/components/_accordions.scss` | `.internal-accordion.v3` |
| `src/assets/js/internal-accordion.js` | Group + panel collapse |
| `index.html` | Hub → Accordions v3 |

---

## When to use (UI)

- FAQ or policy Q&amp;A that sits inside one labeled section
- Need a **group-level** expand/collapse (whole FAQ block) plus per-question panels
- Dark shell + light cards matches Exemplifi `$primary-dark` / white treatment

Do **not** use v3 for photo + bio layouts — use [v4](./accordions-v4.md).

---

## Behavior (developers)

1. **Group** — `[data-internal-accordion-group]` toggles the shell body. Open class: `.is-group-open`. Trigger `aria-label` swaps between “Collapse FAQ section” / “Expand FAQ section”.
2. **Panels** — `[data-internal-accordion]` manages `.accordion-panel` items. Opening one **closes siblings** (single-open).
3. **Animation** — Open snaps to full height; close animates height (~350ms). Respects `prefers-reduced-motion`.
4. **Scroll** — Opening a panel scrolls its heading under any sticky header (`.site-header`, `.ex-header`, or `header`).
5. **IDs** — Script assigns `id` / `aria-controls` / `aria-labelledby` at runtime. Author markup can stay id-free (CMS-friendly).

---

## Markup

Root section:

```html
<section class="internal-accordion v3" aria-label="Frequently asked questions">
  <div class="container">
    <div class="accordion-wrapper is-group-open" data-internal-accordion-group>
      <!-- group header + group collapse + accordion-list -->
    </div>
  </div>
</section>
```

### Group header

```html
<div class="accordion-group-header">
  <h2 class="accordion-group-title">FAQ’s</h2>
  <button type="button" class="accordion-group-trigger" aria-expanded="true"
    aria-label="Collapse FAQ section">
    <span class="accordion-toggle" aria-hidden="true">
      <i data-lucide="chevron-down" class="accordion-icon accordion-icon--closed"></i>
      <i data-lucide="chevron-up" class="accordion-icon accordion-icon--open"></i>
    </span>
  </button>
</div>
```

Start open: add `is-group-open` on `.accordion-wrapper`, `show` on `.accordion-group-collapse`, and `aria-expanded="true"` on the group trigger.

### FAQ panel (one item)

```html
<div class="accordion-panel">
  <h3 class="accordion-heading">
    <button type="button" class="accordion-trigger" aria-expanded="true">
      <span class="accordion-header-copy">
        <span class="title">Q: How does the program work?</span>
      </span>
      <span class="accordion-toggle" aria-hidden="true">
        <i data-lucide="chevron-down" class="accordion-icon accordion-icon--closed"></i>
        <i data-lucide="chevron-up" class="accordion-icon accordion-icon--open"></i>
      </span>
    </button>
  </h3>
  <div class="accordion-collapse collapse show" aria-hidden="false">
    <div class="accordion-collapse-inner">
      <div class="accordion-body">
        <div class="content-wrapper">
          <p>A: Answer text…</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

Closed panel: add `collapsed` on the trigger, `aria-expanded="false"`, omit `show` on `.accordion-collapse`, set `aria-hidden="true"`.

---

## Required classes / attributes

| Piece | Required |
|-------|----------|
| Section | `.internal-accordion.v3` |
| Group root | `data-internal-accordion-group` on `.accordion-wrapper` |
| List | `data-internal-accordion` on `.accordion-list` |
| Icons | Lucide `chevron-down` / `chevron-up` (initialized in `main.js`) |

---

## Accessibility checklist

- [ ] Real headings: group `h1`, each question `h2` (demo page hierarchy)
- [ ] Triggers are `<button type="button">` with visible title text (accessible name)
- [ ] Decorative chevrons: `aria-hidden="true"` on `.accordion-toggle`
- [ ] Group icon button uses `aria-labelledby` → group title (wired in JS)
- [ ] Panels: `aria-expanded`, `aria-controls`, region `aria-labelledby`; closed panels use `aria-hidden` + `inert`
- [ ] Keyboard: Tab to triggers, Enter/Space to toggle
- [ ] Visible `:focus-visible` (blue outline via SCSS)
- [ ] Skip link to `<main>` on demo pages

---

## Visual notes (UI)

| Element | Look |
|---------|------|
| Shell | `$primary-dark`, rounded `1rem` |
| Cards | White, rounded, stacked with gap |
| Question title | `$primary-dark`, semibold |
| Answer | Body text; links use `$blue` |
| Open card | Top border under question before answer |

---

## Copy / content tips

- Prefer short answers (1–2 paragraphs).
- Keep “Q:” / “A:” consistent if that is the product pattern, or drop both for cleaner copy.
- Group title should name the topic (e.g. “FAQ’s”, “Billing questions”).
