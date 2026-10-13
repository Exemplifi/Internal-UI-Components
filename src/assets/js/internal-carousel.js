/**
 * Internal Carousel v3 — hero + thumbnail gallery (from ARRC carousel-v2)
 * Demo: htmls/carousel-v3.html
 */

import Swiper from "swiper";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function once(context, selector) {
  const scope = context instanceof Element || context instanceof Document ? context : document;
  return [...scope.querySelectorAll(selector)].filter((el) => {
    if (el.dataset.internalCarouselInit === "true") return false;
    el.dataset.internalCarouselInit = "true";
    return true;
  });
}

/** Keep every thumb tabbable — Swiper otherwise marks off-screen slides as hidden/inert. */
function unlockSlides(swiper) {
  swiper.slides.forEach((slide) => {
    slide.removeAttribute("aria-hidden");
    slide.removeAttribute("inert");
    slide.removeAttribute("tabindex");
  });
}

function unlockThumbFocus(root) {
  root.querySelectorAll('[role="radio"]').forEach((item) => {
    item.tabIndex = 0;
  });
}

function syncNavA11y(swiper, prevEl, nextEl) {
  const atStart = swiper.isBeginning;
  const atEnd = swiper.isEnd;

  [prevEl, nextEl].forEach((btn, i) => {
    if (!btn) return;
    const disabled = i === 0 ? atStart : atEnd;
    btn.toggleAttribute("disabled", disabled);
    btn.setAttribute("aria-disabled", disabled ? "true" : "false");
  });
}

function onLayoutSettle(callback) {
  let timer = 0;
  const run = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(callback, 150);
  };

  window.addEventListener("resize", run, { passive: true });
  window.addEventListener("orientationchange", run, { passive: true });
  window.visualViewport?.addEventListener("resize", run, { passive: true });
}

function createInternalSwiper(el, { prevEl, nextEl, unlockFocus, ...options }) {
  const refresh = (s) => {
    unlockSlides(s);
    if (unlockFocus) unlockThumbFocus(el);
    syncNavA11y(s, prevEl, nextEl);
  };

  const swiper = new Swiper(el, {
    modules: [Navigation, A11y],
    a11y: { enabled: false },
    loop: false,
    speed: prefersReducedMotion() ? 0 : 300,
    watchOverflow: true,
    observer: true,
    observeParents: true,
    resizeObserver: true,
    touchStartPreventDefault: false,
    threshold: 8,
    resistanceRatio: 0.85,
    navigation: { prevEl, nextEl },
    on: {
      init: refresh,
      slideChange: refresh,
      transitionEnd: refresh,
      resize: refresh,
      lock: refresh,
      unlock: refresh,
    },
    ...options,
  });

  refresh(swiper);

  onLayoutSettle(() => {
    swiper.update();
    refresh(swiper);
  });

  return swiper;
}

function syncHeroScrollA11y(heroScroll) {
  if (!heroScroll) return;

  if (heroScroll.scrollWidth > heroScroll.clientWidth + 1) {
    heroScroll.tabIndex = 0;
    heroScroll.setAttribute("role", "region");
    heroScroll.setAttribute(
      "aria-label",
      "Selected photo. Scroll horizontally to see the full image.",
    );
    return;
  }

  heroScroll.removeAttribute("tabindex");
  heroScroll.removeAttribute("role");
  heroScroll.removeAttribute("aria-label");
}

function bindCarouselV3Hero(root, heroImg, swiper, statusEl) {
  const heroScroll = root.querySelector(".internal-carousel-hero-scroll");
  const heroCaption =
    root.querySelector("[data-internal-carousel-hero-caption]") ||
    root.querySelector(".internal-carousel-hero-caption");
  const thumbs = [...root.querySelectorAll("[data-internal-carousel-thumb]")];
  const total = thumbs.length;
  const radiogroup = root.querySelector('[role="radiogroup"]');

  thumbs.forEach((thumb, index) => {
    const caption = thumb.getAttribute("data-internal-carousel-caption")?.trim() || "";
    const n = index + 1;
    thumb.tabIndex = 0;
    thumb.setAttribute("aria-posinset", String(n));
    thumb.setAttribute("aria-setsize", String(total));
    if (caption) {
      thumb.setAttribute("aria-label", `Photo ${n} of ${total}: ${caption}`);
    }
  });

  const setHeroFromThumb = (thumb, { moveStrip = false, announce = true } = {}) => {
    const src = thumb.getAttribute("data-internal-carousel-thumb");
    const caption = thumb.getAttribute("data-internal-carousel-caption")?.trim() || "";
    const index = thumbs.indexOf(thumb);

    if (heroImg && src) {
      heroImg.src = src;
      heroImg.alt = "";
    }
    if (heroCaption && caption) heroCaption.textContent = caption;
    if (heroScroll) heroScroll.scrollLeft = 0;

    requestAnimationFrame(() => syncHeroScrollA11y(heroScroll));

    thumbs.forEach((item) => {
      item.setAttribute("aria-checked", item === thumb ? "true" : "false");
      item.tabIndex = 0;
    });

    unlockSlides(swiper);

    if (announce && statusEl && index >= 0) {
      statusEl.textContent = caption
        ? `Selected photo ${index + 1} of ${total}: ${caption}`
        : `Selected photo ${index + 1} of ${total}`;
    }

    if (moveStrip && index >= 0) {
      swiper.slideTo(index, prefersReducedMotion() ? 0 : undefined);
    }
  };

  if (radiogroup) {
    radiogroup.addEventListener("keydown", (event) => {
      const current = event.target.closest('[role="radio"]');
      if (!current || !thumbs.includes(current)) return;

      const index = thumbs.indexOf(current);
      let next = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = thumbs[index + 1] ?? thumbs[0];
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = thumbs[index - 1] ?? thumbs[thumbs.length - 1];
      } else if (event.key === "Home") {
        next = thumbs[0];
      } else if (event.key === "End") {
        next = thumbs[thumbs.length - 1];
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setHeroFromThumb(current, { moveStrip: true, announce: true });
        return;
      }

      if (!next) return;
      event.preventDefault();
      next.focus();
      setHeroFromThumb(next, { moveStrip: true, announce: true });
    });
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      setHeroFromThumb(thumb, { moveStrip: true, announce: true });
      thumb.focus();
    });
  });

  if (heroImg) {
    heroImg.addEventListener("load", () => syncHeroScrollA11y(heroScroll));
  }

  const initial =
    thumbs.find((thumb) => thumb.getAttribute("aria-checked") === "true") ||
    thumbs.find(
      (thumb) =>
        thumb.getAttribute("data-internal-carousel-thumb") === heroImg?.getAttribute("src"),
    ) ||
    thumbs[0];

  if (initial) setHeroFromThumb(initial, { announce: false });

  syncHeroScrollA11y(heroScroll);
  unlockSlides(swiper);

  onLayoutSettle(() => {
    syncHeroScrollA11y(heroScroll);
    swiper.update();
    unlockSlides(swiper);
    unlockThumbFocus(root);
  });
}

function announceStrip(swiper, statusEl) {
  unlockSlides(swiper);
  unlockThumbFocus(swiper.el);
  if (!statusEl) return;
  statusEl.textContent = `Thumbnail strip ${swiper.activeIndex + 1} of ${swiper.slides.length}`;
}

export function initInternalCarousel(context = document) {
  once(context, ".internal-carousel.v3 [data-internal-carousel-v3]").forEach((el) => {
    const root = el.closest(".internal-carousel");
    const prevEl = root?.querySelector("[data-internal-carousel-v3-prev]");
    const nextEl = root?.querySelector("[data-internal-carousel-v3-next]");
    const statusEl = root?.querySelector("[data-internal-carousel-v3-status]");
    const heroImg = root?.querySelector(".internal-carousel-hero-figure img");
    if (!root || !prevEl || !nextEl) return;

    const swiper = createInternalSwiper(el, {
      prevEl,
      nextEl,
      unlockFocus: true,
      slidesPerView: "auto",
      spaceBetween: 16,
      breakpoints: {
        576: { spaceBetween: 20 },
        992: { spaceBetween: 24 },
      },
    });

    prevEl.addEventListener("click", () => announceStrip(swiper, statusEl));
    nextEl.addEventListener("click", () => announceStrip(swiper, statusEl));

    bindCarouselV3Hero(root, heroImg, swiper, statusEl);
  });
}

initInternalCarousel();
