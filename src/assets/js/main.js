import $ from "jquery";
import "slick-carousel";
import * as bootstrap from "bootstrap";
import { createIcons, icons } from "lucide";
import AOS from "aos";
import "aos/dist/aos.css";

import "../css/styles.css";

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
import "./dart-header.js";

window.$ = window.jQuery = $;

function initLucideIcons() {
  createIcons({ icons });
}

window.lucide = { createIcons, icons, refresh: initLucideIcons };
window.initLucideIcons = initLucideIcons;

function runWhenDomReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

runWhenDomReady(initLucideIcons);

AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
  offset: 100,
  disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});
