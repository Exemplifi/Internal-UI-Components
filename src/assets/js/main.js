import $ from "jquery";
import "slick-carousel";
import * as bootstrap from "bootstrap";
import { createIcons, icons } from "lucide";
import AOS from "aos";
import "aos/dist/aos.css";

// Make jQuery globally available
window.$ = window.jQuery = $;

// Import styles
import "../css/styles.css";

// Initialize Lucide icons
createIcons({ icons });

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 100,
  disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
});

// Import component scripts
import "./form.js";
import "./hero.js";
import "./script.js";
import "./card-with-icon.js";
import "./icon-with-text.js";
import "./header.js";
import "./footer.js";
import "./exemplifi-header.js";
import "./calendar.js";
import "./swiper-init.js";
