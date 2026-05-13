/**
 * PG carousel (Slick).
 *
 * Chrome may log "[Violation] Added non-passive event listener" for touchstart/touchmove:
 * Slick attaches those handlers so it can call preventDefault() during horizontal swipes.
 * That cannot be changed from here without replacing Slick or patching node_modules.
 */

export function initPgCarousel($) {
  if (!$ || !$.fn || !$.fn.slick) return;

  const $pgSlick = $(".pg-slick");
  if (!$pgSlick.length) return;

  const root = $pgSlick[0];

  $pgSlick.slick({
    autoplay: false,
    autoplaySpeed: 0,
    speed: 3000,
    infinite: true,
    arrows: false,
    centerMode: false,
    variableWidth: true,
    cssEase: "linear",
    dots: false,
    /** Slick’s initADA + clones fights variable-width + infinite; we use inert + focus guard below. */
    accessibility: false,
    pauseOnFocus: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          speed: 6000,
        },
      },
    ],
  });

  /** Align with aria-hidden so focus cannot enter “hidden” slides (inert is supported in Chromium/WebKit). */
  function syncSlideInert() {
    $pgSlick.find(".slick-slide").each(function () {
      const hidden = this.getAttribute("aria-hidden") === "true";
      if (hidden) this.setAttribute("inert", "");
      else this.removeAttribute("inert");
    });
  }

  /** Browsers without inert: blur if focus lands inside a slide Slick marked hidden. */
  function guardFocusInHiddenSlide(ev) {
    const slide = ev.target.closest(".slick-slide");
    if (!slide || !root.contains(slide)) return;
    if (slide.getAttribute("aria-hidden") === "true") {
      ev.target.blur();
    }
  }

  $pgSlick.on("init reInit afterChange", syncSlideInert);
  syncSlideInert();
  root.addEventListener("focusin", guardFocusInHiddenSlide, true);

  $pgSlick.on("mouseenter", function () {
    $(this).slick("slickPause");
  });
  $pgSlick.on("mouseleave", function () {
    $(this).slick("slickPlay");
  });
}
