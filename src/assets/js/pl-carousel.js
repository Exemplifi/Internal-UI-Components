/**
 * Port Laredo: htmls/src/js/main.js — "pl-carousel scripts" block (lines 150–178).
 * Internal: bundled via main.js → $(function () { initPlCarousel($); })
 */
export function initExCarousel($) {
  if (!$ || !$.fn || !$.fn.slick) return;

  const $exSlick = $(".ex-slick");
  if ($exSlick.length) {
    $exSlick.slick({
      autoplay: true,
      autoplaySpeed: 0,
      speed: 3000,
      infinite: true,
      arrows: false,
      centerMode: false,
      variableWidth: true,
      cssEase: "linear",
      dots: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            speed: 6000,
          },
        },
      ],
    });
    $exSlick.on("mouseenter", function () {
      $(this).slick("slickPause");
    });
    $exSlick.on("mouseleave", function () {
      $(this).slick("slickPlay");
    });
  }
}
