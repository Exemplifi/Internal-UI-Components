export function initPgCarousel($) {
  if (!$ || !$.fn || !$.fn.slick) return;

  const $pgSlick = $(".pg-slick");
  if ($pgSlick.length) {
    $pgSlick.slick({
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
    $pgSlick.on("mouseenter", function () {
      $(this).slick("slickPause");
    });
    $pgSlick.on("mouseleave", function () {
      $(this).slick("slickPlay");
    });
  }
}
