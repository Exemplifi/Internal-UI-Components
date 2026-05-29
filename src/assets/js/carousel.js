/**
 * NCM spotlight slider (Slick + Lucide nav icons).
 *
 * Chrome may log "[Violation] Added non-passive event listener" for touchstart/touchmove:
 * Slick attaches those handlers so it can call preventDefault() during horizontal swipes.
 */

import { createIcons, icons } from "lucide";

const renderLucideIcons = () => {
  createIcons({ icons });
};

const updateSliderLiveRegion = ($live, slick) => {
  if (!$live.length || !slick || typeof slick.currentSlide !== "number" || !slick.slideCount) {
    return;
  }

  const slideEl = slick.$slides?.[slick.currentSlide];
  const title = slideEl
    ? $(slideEl).find(".slider-card__title").first().text().trim()
    : "";
  const label = title || `Slide ${slick.currentSlide + 1}`;
  $live.text(`Slide ${slick.currentSlide + 1} of ${slick.slideCount}: ${label}`);
};

const syncSlideInert = ($slider) => {
  $slider.find(".slick-slide").each(function syncInert() {
    const hidden = this.getAttribute("aria-hidden") === "true";
    if (hidden) this.setAttribute("inert", "");
    else this.removeAttribute("inert");
  });
};

const guardFocusInHiddenSlide = (root) => (ev) => {
  const slide = ev.target.closest(".slick-slide");
  if (!slide || !root.contains(slide)) return;
  if (slide.getAttribute("aria-hidden") === "true") {
    ev.target.blur();
  }
};

export function initNcmSlider($) {
  if (!$ || !$.fn || !$.fn.slick) return;

  const $sliders = $(".js-ncm-slider");
  if (!$sliders.length) return;

  $sliders.each(function initSlider() {
    const $el = $(this);
    if ($el.hasClass("slick-initialized")) return;

    const root = $el[0];
    const $sliderContent = $el.closest(".slider-content");
    const $arrowWrapper = $sliderContent.find(".slider-btn-wrapper").first();
    const $live = $sliderContent.find("[data-ncm-slider-live]").first();
    const focusGuard = guardFocusInHiddenSlide(root);

    $el.on("init reInit breakpoint setPosition afterChange", (_event, slick) => {
      renderLucideIcons();
      updateSliderLiveRegion($live, slick);
      syncSlideInert($el);
    });

    $el.slick({
      slidesToShow: 1.12,
      slidesToScroll: 1,
      infinite: false,
      centerMode: false,
      variableWidth: false,
      arrows: true,
      appendArrows: $arrowWrapper.length ? $arrowWrapper : $el,
      prevArrow:
        '<button type="button" class="slider-nav-btn slider-nav-btn--prev" aria-label="Previous slide"><i data-lucide="arrow-left" aria-hidden="true"></i></button>',
      nextArrow:
        '<button type="button" class="slider-nav-btn slider-nav-btn--next" aria-label="Next slide"><i data-lucide="arrow-right" aria-hidden="true"></i></button>',
      dots: false,
      adaptiveHeight: false,
      speed: 450,
      mobileFirst: true,
      accessibility: false,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2.12,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3.12,
          },
        },
      ],
    });

    syncSlideInert($el);
    root.addEventListener("focusin", focusGuard, true);
    renderLucideIcons();
  });
}
