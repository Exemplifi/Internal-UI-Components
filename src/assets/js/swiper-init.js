import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const initSwipers = () => {
  const el1 = document.querySelector(".carousel-v1");
  if (el1) {
    new Swiper(el1, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: ".carousel--v1 .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".carousel--v1 .swiper-button-next",
        prevEl: ".carousel--v1 .swiper-button-prev",
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
  }

  const el2 = document.querySelector(".carousel-v2");
  if (el2) {
    new Swiper(el2, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: ".carousel--v2 .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".carousel--v2 .swiper-button-next",
        prevEl: ".carousel--v2 .swiper-button-prev",
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
  }

  const el3 = document.querySelector(".carousel-v3");
  if (el3) {
    new Swiper(el3, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      pagination: {
        el: ".carousel--v3 .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".carousel--v3 .swiper-button-next",
        prevEl: ".carousel--v3 .swiper-button-prev",
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
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSwipers);

export default initSwipers; 