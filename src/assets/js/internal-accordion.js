/**
 * Exemplifi Accordions v3 / v4 — id-free collapse (CMS-friendly)
 *
 * Open: snap (avoids mid-open hitch on tall/image panels)
 * Close: smooth height ~350ms
 * Switch: snap previous shut → open next → park header at top
 *
 * Demo: htmls/accordions-v3.html · htmls/accordions-v4.html
 */

const CLOSE_MS = 350;
const CLOSE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

let idSeq = 0;

/** @type {WeakMap<HTMLElement, { onEnd: (e: TransitionEvent) => void, fallback: number, done: boolean }>} */
const animByCollapse = new WeakMap();

function uid(suffix) {
  idSeq += 1;
  return `internal-accordion-${suffix}-${idSeq}`;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function headerOffset() {
  const header = document.querySelector(".site-header, .ex-header, header");
  return (header?.getBoundingClientRect().height ?? 0) + 16;
}

function headingEl(panel) {
  return panel.querySelector(".accordion-heading") || panel;
}

function isNearTop(panel) {
  const top = headingEl(panel).getBoundingClientRect().top;
  const offset = headerOffset();
  return top >= offset - 12 && top <= offset + 80;
}

function scrollPanelToTop(panel) {
  if (isNearTop(panel)) return;

  const top =
    headingEl(panel).getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

function isExpanded(trigger) {
  return trigger.getAttribute("aria-expanded") === "true";
}

function setExpanded(trigger, collapse, open) {
  trigger.classList.toggle("collapsed", !open);
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  collapse.setAttribute("aria-hidden", open ? "false" : "true");
}

function clearAnim(collapse) {
  const state = animByCollapse.get(collapse);
  if (!state) return;
  collapse.removeEventListener("transitionend", state.onEnd);
  window.clearTimeout(state.fallback);
  animByCollapse.delete(collapse);
}

function clearInlineTransition(collapse) {
  collapse.style.transition = "";
}

function whenHeightEnds(collapse, ms, callback) {
  clearAnim(collapse);

  const state = { done: false, onEnd: /** @type {any} */ (null), fallback: 0 };

  const finish = () => {
    if (state.done) return;
    state.done = true;
    clearAnim(collapse);
    callback();
  };

  state.onEnd = (event) => {
    if (event.target !== collapse || event.propertyName !== "height") return;
    finish();
  };
  state.fallback = window.setTimeout(finish, ms + 80);

  animByCollapse.set(collapse, state);
  collapse.addEventListener("transitionend", state.onEnd);
}

function settleClosed(collapse) {
  clearAnim(collapse);
  collapse.classList.remove("show");
  collapse.classList.add("accordion-collapse--settled");
  collapse.style.height = "";
  clearInlineTransition(collapse);
}

function snapOpen(collapse) {
  clearAnim(collapse);
  collapse.classList.remove("accordion-collapse--settled");
  collapse.classList.add("show");
  collapse.style.height = "auto";
  clearInlineTransition(collapse);
}

/**
 * @returns {Promise<void>}
 */
function setCollapseOpen(trigger, collapse, open, { animate = true } = {}) {
  if (!trigger || !collapse) return Promise.resolve();

  clearAnim(collapse);
  clearInlineTransition(collapse);
  setExpanded(trigger, collapse, open);

  if (trigger.classList.contains("accordion-group-trigger")) {
    trigger.setAttribute(
      "aria-label",
      open ? "Collapse FAQ section" : "Expand FAQ section",
    );
    trigger
      .closest("[data-internal-accordion-group]")
      ?.classList.toggle("is-group-open", open);
  }

  if (open) {
    snapOpen(collapse);
    return Promise.resolve();
  }

  if (!animate || reducedMotion()) {
    settleClosed(collapse);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    collapse.classList.remove("accordion-collapse--settled");
    collapse.classList.add("show");

    const current =
      collapse.style.height === "auto" || collapse.style.height === ""
        ? collapse.scrollHeight
        : collapse.getBoundingClientRect().height;

    if (current < 1) {
      settleClosed(collapse);
      resolve();
      return;
    }

    collapse.style.height = `${current}px`;
    void collapse.offsetHeight;
    collapse.style.transition = `height ${CLOSE_MS}ms ${CLOSE_EASE}`;
    collapse.style.height = "0px";

    whenHeightEnds(collapse, CLOSE_MS, () => {
      if (!isExpanded(trigger)) settleClosed(collapse);
      resolve();
    });
  });
}

function panelParts(panel) {
  return {
    trigger: panel.querySelector(".accordion-trigger"),
    collapse: panel.querySelector(":scope > .accordion-collapse"),
  };
}

function wirePanelA11y(panel) {
  const { trigger, collapse } = panelParts(panel);
  if (!trigger || !collapse) return;

  if (!trigger.id) trigger.id = uid("trigger");
  if (!collapse.id) collapse.id = uid("panel");

  trigger.setAttribute("aria-controls", collapse.id);
  collapse.setAttribute("role", "region");
  collapse.setAttribute("aria-labelledby", trigger.id);
  collapse.removeAttribute("aria-label");
}

function setPanelOpen(panel, open, options) {
  const { trigger, collapse } = panelParts(panel);
  if (!trigger || !collapse) return Promise.resolve();
  return setCollapseOpen(trigger, collapse, open, options);
}

function closeSiblingPanels(panel, options) {
  const list = panel.closest("[data-internal-accordion]");
  if (!list) return;

  list.querySelectorAll(".accordion-panel").forEach((sibling) => {
    if (sibling !== panel) setPanelOpen(sibling, false, options);
  });
}

function hasOpenSibling(panel) {
  const list = panel.closest("[data-internal-accordion]");
  if (!list) return false;

  return [...list.querySelectorAll(".accordion-panel")].some((sibling) => {
    if (sibling === panel) return false;
    const trigger = sibling.querySelector(".accordion-trigger");
    return Boolean(trigger && isExpanded(trigger));
  });
}

function initAccordionList(list) {
  if (list.dataset.internalAccordionInit === "true") return;
  list.dataset.internalAccordionInit = "true";

  list.querySelectorAll(".accordion-panel").forEach((panel) => {
    const { trigger, collapse } = panelParts(panel);
    if (!trigger || !collapse) return;

    wirePanelA11y(panel);
    setPanelOpen(panel, collapse.classList.contains("show"), { animate: false });

    trigger.addEventListener("click", () => {
      if (isExpanded(trigger)) {
        setPanelOpen(panel, false);
        return;
      }

      if (hasOpenSibling(panel)) {
        closeSiblingPanels(panel, { animate: false });
      }

      setPanelOpen(panel, true);
      scrollPanelToTop(panel);
    });
  });
}

function wireGroupA11y(group) {
  const trigger = group.querySelector(".accordion-group-trigger");
  const collapse = group.querySelector(":scope > .accordion-group-collapse");
  const title = group.querySelector(".accordion-group-title");
  if (!trigger || !collapse || !title) return;

  if (!title.id) title.id = uid("group-title");
  if (!collapse.id) collapse.id = uid("group-panel");

  trigger.setAttribute("aria-controls", collapse.id);
  collapse.setAttribute("role", "region");
  collapse.setAttribute("aria-labelledby", title.id);
  collapse.removeAttribute("aria-label");
}

function initAccordionGroup(group) {
  if (group.dataset.internalAccordionGroupInit === "true") return;
  group.dataset.internalAccordionGroupInit = "true";

  const trigger = group.querySelector(".accordion-group-trigger");
  const collapse = group.querySelector(":scope > .accordion-group-collapse");
  if (!trigger || !collapse) return;

  wireGroupA11y(group);

  const isOpen = collapse.classList.contains("show");
  group.classList.toggle("is-group-open", isOpen);
  setCollapseOpen(trigger, collapse, isOpen, { animate: false });

  trigger.addEventListener("click", () => {
    setCollapseOpen(trigger, collapse, !isExpanded(trigger));
  });
}

export function initInternalAccordion(root = document) {
  root.querySelectorAll("[data-internal-accordion-group]").forEach(initAccordionGroup);
  root.querySelectorAll("[data-internal-accordion]").forEach(initAccordionList);
}

initInternalAccordion();
