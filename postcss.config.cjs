/**
 * Local PostCSS config to prevent Vite from picking up a parent-drive
 * `postcss.config.js` (e.g. `G:\postcss.config.js`) that may reference
 * plugins not installed in this project (like `tailwindcss`).
 */
module.exports = {
  plugins: {},
};

