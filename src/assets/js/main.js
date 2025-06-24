import $ from "jquery";
import "slick-carousel";
import * as bootstrap from "bootstrap";
import { createIcons, icons } from "lucide";

// Make jQuery globally available
window.$ = window.jQuery = $;

// Import styles
import "../css/styles.css";

// Initialize Lucide icons
createIcons({ icons });

// Import component scripts
import './form.js';
import './hero.js';
import './script.js';
import './card-with-icon.js';
import './icon-with-text.js';
import './header.js';
import './footer.js';




