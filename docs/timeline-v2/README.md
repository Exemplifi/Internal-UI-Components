# Timeline V2

VVTA **How Reimbursement Works** four-step timeline, named Timeline V2 in this kit.

**Live demo:** [src/htmls/timeline-v2.html](../../src/htmls/timeline-v2.html)

Source: [Figma 4803:7223](https://www.figma.com/design/GdxsDPQKBDddEfuOQUrkAQ/VVTA----Internal-?node-id=4803-7223).

For repository setup and builds, see the root [README.md](../../README.md) and [docs/README.md](../README.md).

---

## Files

| File | Role |
|------|------|
| `src/htmls/timeline-v2.html` | Standalone demo |
| `src/assets/scss/components/_timeline-v2.scss` | Styles |
| `src/assets/js/timeline-v2.js` | Step autoplay + heading chevron |
| `src/assets/images/timeline-v2-chevron.svg` | Heading chevron |
| `src/assets/js/main.js` | `import "./timeline-v2.js";` |
| `src/assets/scss/components/_components.scss` | `@import "timeline-v2";` |
| `index.html` | Hub link |

After changing SCSS or JS, run `npm run build:all`.

---

## Behavior

1. **Steps** — Four numbered cards; the active step uses `.is-active` (teal marker + teal card border).
2. **Autoplay** — Highlight starts on step 01 and advances every 5 seconds. Pauses when the steps are fully off-screen, then resumes.
3. **Reduced motion** — No autoplay; step 01 stays active. Chevron does not slide.
4. **Chevron** — `.heading-chevron` slides in when its parent enters view.

---

## Markup

Root: `<section class="timeline-v2">` with aside (eyebrow, chevron title, lead) and an ordered list of `.timeline-v2__step`. First step has `.is-active`.
