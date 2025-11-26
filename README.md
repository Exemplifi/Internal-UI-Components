## Standard Repo

### Overview
This repository uses Vite for development and builds, SASS for styling, and a set of Cursor rule files to standardize project scaffolding, coding conventions, and accessibility. Follow the workflow below to run scripts and apply rules consistently.

### Prerequisites
- Node.js and npm installed

### Install
```bash
npm install
```

### Scripts and What They Do
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "watch:scss": "sass --watch --style=compressed --load-path=node_modules --load-path=src/assets/scss src/assets/scss/styles.scss src/assets/css/styles.css",
    "build:js": "vite build --config vite.config.js --mode production"
  }
}
```

- **dev**: Starts the Vite development server with hot module replacement for rapid local development.
- **build**: Creates a production build of the site using Vite (outputs to `dist`).
- **preview**: Serves the production build locally so you can test the `dist` output.
- **watch:scss**: Compiles SASS to CSS in watch mode. Uses compressed output and includes both `node_modules` and `src/assets/scss` in the SASS load paths. It watches `src/assets/scss/styles.scss` and writes to `src/assets/css/styles.css`.
- **build:js**: Runs a production JS build explicitly using `vite.config.js` and `--mode production`.

### Common Commands
- Start dev server: `npm run dev`
- Watch and compile SCSS: `npm run watch:scss`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Production JS build (explicit): `npm run build:js`

## Cursor Rule Files Workflow
Use the following rule files in the specified order for a consistent workflow across project setup, coding standards, and accessibility compliance.

### 1) Project Setup — `@starter-pack.mdc`
Run at the beginning of the project or when bootstrapping new modules/pages.

Example prompts:
- "Use `@starter-pack.mdc` to verify the project structure, ensure Vite and SASS are configured, and confirm scripts are correct."
- "Run `@starter-pack.mdc` and list any missing directories or files under `src/assets/scss`, `src/assets/js`, and `src/htmls`."
- "With `@starter-pack.mdc`, generate or validate base scaffolding and report what changed."

### 2) Coding Standards — `@coding-standard.mdc`
Use while building or refactoring any component or page to maintain consistent code quality.

Example prompts:
- "Run `@coding-standard.mdc` to review `src/assets/js/main.js` and suggest improvements per ES6 and project guidelines."
- "Apply `@coding-standard.mdc` to SCSS in `src/assets/scss/components/_cards.scss` for naming, variables, and mixins."
- "Using `@coding-standard.mdc`, flag any deviations from the coding rules in recently modified files and propose edits."

### 3) Accessibility — `@accessibilitystandards.mdc`
Run before pushing individual components/pages to ensure WCAG 2.1 AA compliance.

Example prompts:
- "Audit `src/htmls/cards.html` with `@accessibilitystandards.mdc` for heading hierarchy, focus states, and link text."
- "Use `@accessibilitystandards.mdc` to check all `<img>` tags for meaningful `alt` text and identify any decorative images that need `alt=\"\"`."
- "With `@accessibilitystandards.mdc`, review forms in `src/htmls/form.html` for labels, `aria-*` attributes, and error message semantics."

### Recommended Order
1. Start project: `@starter-pack.mdc`
2. While coding components/pages: `@coding-standard.mdc`
3. Before pushing components/pages: `@accessibilitystandards.mdc`

### Notes
- Keep `watch:scss` running alongside `dev` for immediate SASS compilation feedback.
- Always preview a production build (`npm run build && npm run preview`) before final reviews.