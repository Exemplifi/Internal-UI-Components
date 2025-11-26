import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Initialize Swiper instances
const initSwipers = () => {
  // Carousel Variant 1
  const carousel1 = new Swiper('.carousel-v1', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    pagination: {
      el: '.carousel--v1 .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.carousel--v1 .swiper-button-next',
      prevEl: '.carousel--v1 .swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });

  // Carousel Variant 2
  const carousel2 = new Swiper('.carousel-v2', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    pagination: {
      el: '.carousel--v2 .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.carousel--v2 .swiper-button-next',
      prevEl: '.carousel--v2 .swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  // Carousel Variant 3
  const carousel3 = new Swiper('.carousel-v3', {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false,
    pagination: {
      el: '.carousel--v3 .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.carousel--v3 .swiper-button-next',
      prevEl: '.carousel--v3 .swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSwipers);

export default initSwipers; 