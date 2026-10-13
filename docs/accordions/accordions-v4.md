# Accordions v4 — Team / media panels

Dark **team member** (or similar) panels: title + chevron in the header; expanded body shows a portrait beside bio text. Only one panel is open at a time.

**Live demo:** [src/htmls/accordions-v4.html](../../src/htmls/accordions-v4.html)  
**Overview:** [README.md](./README.md)

Demo panels use long lorem copy + images to QA tall open/close and scroll-to-heading. Production copy can be shorter.

---

## Files

| File | Role |
|------|------|
| `src/htmls/accordions-v4.html` | Standalone demo |
| `src/assets/scss/components/_accordions.scss` | `.internal-accordion.v4` |
| `src/assets/js/internal-accordion.js` | Panel collapse (same as v3) |
| `src/assets/images/carousel-img/` | Demo media (`carousel-image-1.jpg` … `4.jpg`) |
| `index.html` | Hub → Accordions v4 |

---

## When to use (UI)

- Executive / staff bios with a photo
- Any list where each row expands to **media + rich text**
- Section intro (title + short lead) above the accordion list

Do **not** use v4 for a simple FAQ without images — use [v3](./accordions-v3.md) or Accordion v1.

---

## Behavior (developers)

Same engine as v3 (`internal-accordion.js`):

1. **Panels** — `[data-internal-accordion]` on `.accordion-list`; single-open; snap open / animated close.
2. **No group shell** — v4 does not use `data-internal-accordion-group`.
3. **Layout** — `.accordion-body` is column on mobile, row (media left, text right) from `992px`.
4. **IDs** — Wired at runtime for `aria-controls` / `aria-labelledby`.

---

## Markup

```html
<section class="internal-accordion v4">
  <div class="container">
    <div class="section-header-wrapper">
      <h2>Our Executive Team</h2>
      <p>Short supporting sentence for the section.</p>
    </div>

    <div class="accordion-list" data-internal-accordion aria-label="Executive team member accordions">
      <!-- panels -->
    </div>
  </div>
</section>
```

### Panel with media

```html
<div class="accordion-panel">
  <h3 class="accordion-heading">
    <button type="button" class="accordion-trigger" aria-expanded="true">
      <span class="accordion-header-copy">
        <span class="title">Alex Rivera, President &amp; CEO</span>
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
        <figure class="media-wrapper">
          <img src="../assets/images/carousel-img/carousel-image-1.jpg" alt="" loading="lazy">
        </figure>
        <div class="content-wrapper">
          <p>Bio paragraph…</p>
          <ul>
            <li>Optional list item</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

Closed panel: `collapsed` on the trigger, `aria-expanded="false"`, no `show` on `.accordion-collapse`, `aria-hidden="true"`.

**Image notes**

- Demo uses images from `carousel-img/` (e.g. `carousel-image-1.jpg`). If the person’s name is already in the heading, decorative `alt=""` is OK; otherwise use a short descriptive `alt`.
- Do not set `width` / `height` on `<img>` — sizing is in CSS (`max-width: 19.1875rem`, square-ish aspect ratio).
- Prefer `loading="lazy"` on below-the-fold portraits.

---

## Required classes / attributes

| Piece | Required |
|-------|----------|
| Section | `.internal-accordion.v4` |
| List | `data-internal-accordion` on `.accordion-list` |
| Media | `.media-wrapper` > `img` inside `.accordion-body` |
| Body text | `.content-wrapper` (supports `p`, `ul`, `ol`, plain links) |
| Icons | Lucide chevrons (via `main.js`) |

---

## Accessibility checklist

- [ ] Section title is an `h1`; each person name is an `h2` wrapping the trigger
- [ ] List has an accessible name (`aria-label` on `.accordion-list`)
- [ ] Portrait `alt` is descriptive (e.g. “Photo of Alex Rivera”)
- [ ] Chevrons `aria-hidden="true"`
- [ ] Panels: `aria-expanded`, `aria-controls`, region `aria-labelledby`; closed panels use `aria-hidden` + `inert`
- [ ] Keyboard operable; visible focus ring
- [ ] Skip link to `<main>` on demo pages

---

## Visual notes (UI)

| Element | Look |
|---------|------|
| Panel | `$primary-dark`, rounded `1rem` |
| Title / chevron | White |
| Open body | Top border (white ~30% opacity) under header |
| Portrait | Rounded `0.5rem`, left of bio on desktop |
| Bio text | White; lists inherit color |

---

## Copy / content tips

- Title format: **Name, Role** (keeps the closed row scannable).
- Keep bios short (2–3 paragraphs or a short list).
- Section lead under the `h2` should be one sentence.
