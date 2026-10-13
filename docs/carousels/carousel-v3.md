# Carousel v3 — Hero + thumbnail gallery

Large **hero photo** with caption, plus a **horizontal thumbnail strip** (Swiper). Selecting a thumb updates the hero. Ported from ARRC `carousel-v2`, restyled with Exemplifi tokens.

**Live demo:** [src/htmls/carousel-v3.html](../../src/htmls/carousel-v3.html)  
**Overview:** [README.md](./README.md)

---

## Files

| File | Role |
|------|------|
| `src/htmls/carousel-v3.html` | Standalone demo |
| `src/assets/images/carousel-img/carousel-v3/` | Demo landscape assets (`thumb-1…4.png`, `hero.png`) |
| `src/assets/scss/components/_carousels.scss` | `.internal-carousel.v3` |
| `src/assets/js/internal-carousel.js` | Swiper strip + hero sync + radiogroup keyboard |
| `index.html` | Hub → Carousel v3 |

---

## When to use (UI)

- Facility / photo showcase: one large image + many selectable thumbs
- Need captions that update with the selected photo
- Dark section (`$primary-dark`) with `$blue` focus rings and nav

Do **not** use v3 for simple multi-card product carousels — use v1 / v2.

Use **landscape** hero assets (roughly ≥700px wide). Tiny square JPGs look soft in the wide hero crop.

---

## Behavior (developers)

1. **Hero** — Thumb click / keyboard selection swaps `.internal-carousel-hero-img` `src` and `[data-internal-carousel-hero-caption]` text from `data-internal-carousel-caption`.
2. **Thumb strip** — Swiper `slidesPerView: "auto"`; prev/next only scroll the strip.
3. **Radiogroup** — Thumbs are `role="radio"` inside `role="radiogroup"`. ←/→/↑/↓, Home/End move selection; Enter/Space confirm. All thumbs stay tabbable; Swiper `aria-hidden` / `inert` on slides is cleared after updates.
4. **Live region** — `[data-internal-carousel-v3-status]` (beside the hero caption) announces selection and strip position.
5. **Mobile hero** — Wide hero can pan horizontally; when it overflows, the scroll region gets `tabindex="0"` + `role="region"`.
6. **Motion** — `prefers-reduced-motion: reduce` sets Swiper speed to `0`.

---

## Markup

```html
<section class="internal-carousel v3" aria-labelledby="carousel-v3-heading">
  <div class="container">
    <div class="section-header-wrapper">
      <h2 id="carousel-v3-heading">A Closer Look at Our Work</h2>
    </div>

    <div class="internal-carousel-hero">
      <div class="internal-carousel-hero-scroll">
        <figure class="internal-carousel-hero-figure" aria-hidden="true">
          <img class="internal-carousel-hero-img" src="…" alt="" decoding="async">
        </figure>
      </div>
      <p class="internal-carousel-hero-caption" data-internal-carousel-hero-caption>
        Caption for the selected photo
      </p>
      <p class="visually-hidden">
        <span data-internal-carousel-v3-status role="status" aria-live="polite" aria-atomic="true"></span>
      </p>
    </div>

    <div class="internal-carousel-gallery">
      <div class="internal-carousel-swiper swiper" data-internal-carousel-v3 role="radiogroup"
        aria-label="Photo gallery. Use Tab to reach a thumbnail, then Left or Right arrow keys to choose a photo.">
        <div class="swiper-wrapper">
          <!-- slides: thumb button + optional figcaption -->
        </div>
      </div>
      <div class="internal-carousel-nav" role="group" aria-label="Thumbnail gallery controls">
        <button type="button" class="internal-carousel-arrow" data-internal-carousel-v3-prev
          aria-label="Show previous thumbnails">…</button>
        <button type="button" class="internal-carousel-arrow" data-internal-carousel-v3-next
          aria-label="Show next thumbnails">…</button>
      </div>
    </div>
  </div>
</section>
```

### Thumbnail button

```html
<button type="button" class="internal-carousel-thumb" role="radio" aria-checked="true"
  data-internal-carousel-thumb="path/to/image.png"
  data-internal-carousel-caption="Accessible caption text"
  aria-label="Photo 1 of 5: Accessible caption text">
  <img src="path/to/image.png" alt="" aria-hidden="true">
</button>
```

Hero and thumb images use empty `alt` because the caption / `aria-label` carries the meaning.

---

## Tokens

| Role | Token |
|------|-------|
| Section background | `$primary-dark` |
| Heading / captions | `$white` |
| Focus ring, arrow border, selected thumb ring, scrollbar | `$blue` |

---

## Accessibility checklist

- [x] Tab reaches every thumbnail; ←/→/↑/↓, Home/End, Enter/Space move or confirm selection
- [x] Polite live region (next to hero caption) announces selection and strip position
- [x] Selected thumb shows visible ring; `:focus-visible` on arrows and thumbs
- [x] Hero pan region is keyboard-reachable only when image overflows
- [x] Prev/next expose `aria-disabled` / `disabled` at strip ends
- [x] `prefers-reduced-motion` disables Swiper animation
- [x] Decorative hero/thumb images use `alt=""`; meaning lives in caption / `aria-label`
