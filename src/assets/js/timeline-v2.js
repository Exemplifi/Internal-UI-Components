const ROOT = ".timeline-v2";
const STEP = ".timeline-v2__step";
const ACTIVE = "is-active";
const INTERVAL_MS = 5000;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setActive(steps, index) {
  steps.forEach((el, i) => {
    const on = i === index;
    el.classList.toggle(ACTIVE, on);
    el.classList.toggle("is-complete", i < index);
    if (on) {
      el.setAttribute("aria-current", "step");
    } else {
      el.removeAttribute("aria-current");
    }
  });
}

function revealHeadingChevron(chevron) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      chevron.classList.add("is-in-view");
    });
  });
}

function initHeadingChevrons(root) {
  const chevrons = root.querySelectorAll(".heading-chevron");
  if (!chevrons.length) return;

  if (prefersReducedMotion()) {
    chevrons.forEach(revealHeadingChevron);
    return;
  }

  if (!("IntersectionObserver" in window)) {
    chevrons.forEach(revealHeadingChevron);
    return;
  }

  const triggers = new Map();

  chevrons.forEach((chevron) => {
    const trigger = chevron.parentElement || chevron;
    if (!triggers.has(trigger)) {
      triggers.set(trigger, []);
    }
    triggers.get(trigger).push(chevron);
  });

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (triggers.get(entry.target) || []).forEach(revealHeadingChevron);
        instance.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.5,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  triggers.forEach((_, trigger) => observer.observe(trigger));
}

function initSection(root) {
  if (root.dataset.timelineV2Init === "1") return;
  root.dataset.timelineV2Init = "1";

  initHeadingChevrons(root);

  const steps = [...root.querySelectorAll(STEP)];
  if (steps.length < 2) return;

  let index = 0;
  setActive(steps, index);

  if (prefersReducedMotion()) return;

  let timerId = null;

  const clear = () => {
    if (timerId == null) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  const tick = () => {
    index = (index + 1) % steps.length;
    setActive(steps, index);
  };

  const play = () => {
    if (timerId != null) return;
    timerId = window.setInterval(tick, INTERVAL_MS);
  };

  play();

  if (!("IntersectionObserver" in window)) return;

  const target = root.querySelector(".timeline-v2__steps") || root;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
        } else {
          clear();
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(target);
}

function initTimelineV2() {
  document.querySelectorAll(ROOT).forEach(initSection);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTimelineV2);
} else {
  initTimelineV2();
}

export { initTimelineV2 };
