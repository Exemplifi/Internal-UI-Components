/**
 * Internal Tabs — pill tab bar + panels (from ARRC tabs.js / tabs-v2)
 * Demo: htmls/tabs-v1.html
 */

import { createIcons, icons } from "lucide";

const DESKTOP_MQ = "(min-width: 992px)";
const TAB_EDGE_INSET_PX = 40;
const scrollRafByScroller = new WeakMap();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function animateScrollLeft(container, targetLeft, duration = 420, onComplete) {
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  const to = Math.max(0, Math.min(targetLeft, maxScroll));
  const from = container.scrollLeft;
  const delta = to - from;

  const prevFrame = scrollRafByScroller.get(container);
  if (prevFrame) cancelAnimationFrame(prevFrame);

  if (Math.abs(delta) < 1) {
    container.scrollLeft = to;
    scrollRafByScroller.delete(container);
    onComplete?.();
    return;
  }

  if (prefersReducedMotion()) {
    container.scrollLeft = to;
    scrollRafByScroller.delete(container);
    onComplete?.();
    return;
  }

  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    container.scrollLeft = from + delta * easeOutCubic(progress);

    if (progress < 1) {
      scrollRafByScroller.set(container, requestAnimationFrame(frame));
      return;
    }

    container.scrollLeft = to;
    scrollRafByScroller.delete(container);
    onComplete?.();
  }

  scrollRafByScroller.set(container, requestAnimationFrame(frame));
}

function getTabListScroller(tabList) {
  return tabList.querySelector(".tab-list-items") ?? tabList;
}

function scrollTabIntoView(tab) {
  const tabList = tab.closest(".tab-list");
  if (!tabList) return;

  const container = getTabListScroller(tabList);

  const measureAndScroll = () => {
    if (container.scrollWidth <= container.clientWidth + 1) {
      container.scrollLeft = 0;
      return;
    }

    const edgeGap = TAB_EDGE_INSET_PX;
    const containerRect = container.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const tabLeft = tabRect.left - containerRect.left + container.scrollLeft;
    const tabRight = tabLeft + tabRect.width;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);

    let target = viewLeft;

    if (tabLeft < viewLeft + edgeGap) {
      target = tabLeft - edgeGap;
    } else if (tabRight > viewRight - edgeGap) {
      target = tabRight - container.clientWidth + edgeGap;
    } else {
      return;
    }

    animateScrollLeft(container, Math.max(0, Math.min(target, maxScroll)));
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(measureAndScroll);
  });
}

function getTabPanel(root, tab) {
  const tabs = Array.from(root.querySelectorAll("[data-tab-bar-tab]"));
  const panels = root.querySelectorAll("[data-tab-bar-panel]");
  const panelId = tab.getAttribute("aria-controls");

  if (panelId) {
    const byId = root.querySelector(`#${CSS.escape(panelId)}`);
    if (byId) return byId;
  }

  return panels[tabs.indexOf(tab)] ?? null;
}

function getTabHeaders(root) {
  const section = root.closest(
    ".internal-tabs.header-switch-mode, .tabs.header-switch-mode, .tabs-section.header-switch-mode",
  );
  if (!section) return [];

  const beside = section.querySelectorAll(
    ":scope > .container > .section-header-wrapper [data-tab-bar-header]",
  );
  if (beside.length) return beside;

  return root.querySelectorAll(
    ":scope > .section-header-wrapper [data-tab-bar-header], :scope > [data-tab-bar-header]",
  );
}

function getTabHeader(root, tab) {
  const tabs = Array.from(root.querySelectorAll("[data-tab-bar-tab]"));
  const headers = getTabHeaders(root);
  if (!headers.length) return null;
  return headers[tabs.indexOf(tab)] ?? null;
}

function setTabBarTab(root, tab) {
  const tabs = root.querySelectorAll("[data-tab-bar-tab]");
  const panels = root.querySelectorAll("[data-tab-bar-panel]");
  const headers = getTabHeaders(root);
  const activePanel = getTabPanel(root, tab);
  const activeHeader = getTabHeader(root, tab);

  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
    item.tabIndex = active ? 0 : -1;
  });

  scrollTabIntoView(tab);

  headers.forEach((header) => {
    const active = header === activeHeader;
    header.classList.toggle("is-active", active);
    header.toggleAttribute("hidden", !active);
  });

  if (!panels.length) return;

  panels.forEach((panel) => {
    const active = panel === activePanel;
    panel.classList.toggle("is-active", active);
    panel.toggleAttribute("hidden", !active);

    if (!active) return;

    if (tab.id) {
      panel.setAttribute("aria-labelledby", tab.id);
      panel.removeAttribute("aria-label");
      return;
    }

    panel.removeAttribute("aria-labelledby");
    const label = tab.textContent?.trim();
    if (label) panel.setAttribute("aria-label", label);
  });
}

function createScrollAction(direction) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = direction === "prev" ? "scroll-action-prev" : "scroll-action-next";
  button.setAttribute(
    "aria-label",
    direction === "prev" ? "Scroll tabs left" : "Scroll tabs right",
  );
  button.tabIndex = -1;

  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", direction === "prev" ? "arrow-left" : "arrow-right");
  icon.setAttribute("aria-hidden", "true");
  button.appendChild(icon);

  return button;
}

function ensureScrollActions(tabList, scroller) {
  let scrollPrev = tabList.querySelector(".scroll-action-prev");
  let scrollNext = tabList.querySelector(".scroll-action-next");
  let injected = false;

  if (!scrollPrev) {
    scrollPrev = createScrollAction("prev");
    tabList.insertBefore(scrollPrev, scroller);
    injected = true;
  }

  if (!scrollNext) {
    scrollNext = createScrollAction("next");
    scroller.after(scrollNext);
    injected = true;
  }

  tabList.classList.add("has-scroll-actions");

  if (injected) {
    createIcons({ icons, attrs: { "aria-hidden": "true" } });
  }

  return { scrollPrev, scrollNext };
}

function measureTabOverflow(tabList, scroller) {
  const tabs = scroller.querySelectorAll(".tab-btn");
  if (!tabs.length) return false;

  const host = tabList.parentElement;
  const hostWidth = host?.clientWidth ?? tabList.clientWidth;
  if (hostWidth <= 0 || tabList.getClientRects().length === 0) return false;

  const gap = parseFloat(getComputedStyle(scroller).gap) || 0;
  let contentWidth = 0;
  tabs.forEach((tab, index) => {
    contentWidth += tab.getBoundingClientRect().width;
    if (index > 0) contentWidth += gap;
  });

  const listStyle = getComputedStyle(tabList);
  const paddingX =
    parseFloat(listStyle.paddingLeft) + parseFloat(listStyle.paddingRight);

  return contentWidth > hostWidth - paddingX + 1;
}

function bindTabListOverflow(root) {
  root.querySelectorAll(".tab-list").forEach((tabList) => {
    const scroller = tabList.querySelector(".tab-list-items");
    if (!scroller) return;

    const { scrollPrev, scrollNext } = ensureScrollActions(tabList, scroller);
    let resizeFrame = 0;

    const syncScrollEdges = () => {
      const overflow = tabList.classList.contains("is-overflow");
      const tabBtns = scroller.querySelectorAll(".tab-btn");
      const firstRect = tabBtns[0]?.getBoundingClientRect();
      const lastRect = tabBtns[tabBtns.length - 1]?.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();

      const atStart = !firstRect || firstRect.left >= scrollerRect.left - 1;
      const atEnd = !lastRect || lastRect.right <= scrollerRect.right + 1;

      tabList.classList.toggle("can-scroll-left", overflow && !atStart);
      tabList.classList.toggle("can-scroll-right", overflow && !atEnd);

      scrollPrev.disabled = !overflow || atStart;
      scrollNext.disabled = !overflow || atEnd;
    };

    const syncOverflowState = () => {
      if (tabList.getClientRects().length === 0) {
        tabList.classList.remove("is-overflow", "can-scroll-left", "can-scroll-right");
        scrollPrev.disabled = true;
        scrollNext.disabled = true;
        return;
      }

      tabList.classList.toggle("is-overflow", measureTabOverflow(tabList, scroller));
      syncScrollEdges();
    };

    const scheduleOverflowSync = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(syncOverflowState);
    };

    const scrollByPage = (direction) => {
      animateScrollLeft(
        scroller,
        scroller.scrollLeft + scroller.clientWidth * 0.6 * direction,
        420,
        syncScrollEdges,
      );
    };

    if (!scrollPrev.dataset.tabScrollBound) {
      scrollPrev.dataset.tabScrollBound = "true";
      scrollPrev.addEventListener("click", () => {
        if (!scrollPrev.disabled) scrollByPage(-1);
      });
    }

    if (!scrollNext.dataset.tabScrollBound) {
      scrollNext.dataset.tabScrollBound = "true";
      scrollNext.addEventListener("click", () => {
        if (!scrollNext.disabled) scrollByPage(1);
      });
    }

    scroller.addEventListener("scroll", syncScrollEdges, { passive: true });
    window.addEventListener("resize", scheduleOverflowSync);
    window.matchMedia(DESKTOP_MQ).addEventListener("change", scheduleOverflowSync);

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(scheduleOverflowSync).observe(tabList.parentElement ?? tabList);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(syncOverflowState);
    });
  });
}

function scrollToPageNavTarget(target, stickySection) {
  const stickyHeight = stickySection?.getBoundingClientRect().height ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - stickyHeight;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export function initInternalTabs() {
  document.querySelectorAll("[data-tab-bar]").forEach((root) => {
    if (root.dataset.internalTabsInit === "true") return;
    root.dataset.internalTabsInit = "true";

    bindTabListOverflow(root);

    const tabs = root.querySelectorAll("[data-tab-bar-tab]");
    if (!tabs.length) return;

    const activeTab = root.querySelector("[data-tab-bar-tab].is-active") ?? tabs[0];
    if (activeTab) setTabBarTab(root, activeTab);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setTabBarTab(root, tab);

        if (root.querySelectorAll("[data-tab-bar-panel]").length) return;

        const targetId = tab.getAttribute("aria-controls");
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        scrollToPageNavTarget(
          target,
          root.closest(".internal-tabs, .tabs-section"),
        );
      });

      tab.addEventListener("keydown", (event) => {
        const list = Array.from(tabs);
        const index = list.indexOf(tab);
        let next = null;

        if (event.key === "ArrowRight") next = list[index + 1] ?? list[0];
        if (event.key === "ArrowLeft") next = list[index - 1] ?? list[list.length - 1];
        if (event.key === "Home") next = list[0];
        if (event.key === "End") next = list[list.length - 1];

        if (!next) return;

        event.preventDefault();
        next.focus();
        setTabBarTab(root, next);
      });
    });
  });
}

function scrollRouteTabIntoView(tab) {
  const container = tab.closest(".route-tabs");
  if (!container || container.scrollWidth <= container.clientWidth) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = tab.offsetLeft - (container.clientWidth - tab.offsetWidth) / 2;
      animateScrollLeft(container, target);
    });
  });
}

function activateRoutePanel(root, panelIndex) {
  const tabs = root.querySelectorAll("[data-route-tab]");
  const panels = root.querySelectorAll("[data-route-panel]");
  let activeTab = null;

  tabs.forEach((tab, i) => {
    const selected = i === panelIndex;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", selected ? "true" : "false");
    tab.tabIndex = selected ? 0 : -1;
    if (selected) activeTab = tab;
  });

  if (activeTab) scrollRouteTabIntoView(activeTab);

  panels.forEach((panel, i) => {
    const active = i === panelIndex;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;

    if (!active) return;

    if (tabs[i]?.id) {
      panel.setAttribute("aria-labelledby", tabs[i].id);
      panel.removeAttribute("aria-label");
      return;
    }

    panel.removeAttribute("aria-labelledby");
    const label = tabs[i]?.textContent?.trim();
    if (label) panel.setAttribute("aria-label", label);
  });
}

/** Chevron route tabs (Tabs v2 / explore-by-route style) — no nested pill tabs. */
export function initInternalRouteTabs() {
  document.querySelectorAll("[data-internal-route-tabs]").forEach((root) => {
    if (root.dataset.internalRouteTabsInit === "true") return;
    root.dataset.internalRouteTabsInit = "true";

    const tabs = root.querySelectorAll("[data-route-tab]");
    const panels = root.querySelectorAll("[data-route-panel]");
    if (!tabs.length || !panels.length) return;

    const initial =
      Array.from(tabs).findIndex((tab) => tab.classList.contains("is-active"));
    activateRoutePanel(root, initial >= 0 ? initial : 0);

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateRoutePanel(root, index));

      tab.addEventListener("keydown", (event) => {
        if (
          event.key !== "ArrowRight" &&
          event.key !== "ArrowLeft" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }

        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        activateRoutePanel(root, nextIndex);
      });
    });
  });
}

initInternalTabs();
initInternalRouteTabs();
