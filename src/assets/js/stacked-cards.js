/**
 * Stacked Cards — stacking cards (VVTA Specialized Services)
 * Sticky cards + translateY/scale; fixed black shell hugs cards (all viewports).
 * Reduced-motion: static list inside in-flow black shell.
 */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    if (!triggers.has(trigger)) triggers.set(trigger, []);
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
    { root: null, threshold: 0.5, rootMargin: "0px 0px -8% 0px" }
  );

  triggers.forEach((_, trigger) => observer.observe(trigger));
}


/** Resolve a CSS length custom property (e.g. 1.5rem) to px. */
function cssLengthToPx(host, value) {
  const probe = document.createElement("div");
  probe.setAttribute(
    "style",
    `opacity:0;visibility:hidden;position:absolute;height:${value}`
  );
  host.appendChild(probe);
  const px = parseInt(getComputedStyle(probe).height, 10);
  host.removeChild(probe);
  return px;
}

const PEEK_Y = 8;
const PEEK_SCALE = 0.006;

function clearItemTransforms(items) {
  items.forEach((item) => {
    item.style.transform = "";
    item.style.opacity = "";
  });
}

function bindStack(section) {
  const stack = section.querySelector(".stacked-cards__stack");
  const list = section.querySelector(".stacked-cards__list");
  const shell = section.querySelector(".stacked-cards__list-shell");
  const header = section.querySelector(".stacked-cards__header");
  const inner = section.querySelector(".stacked-cards__inner");
  if (!stack || !list) return;

  const items = [
    ...list.querySelectorAll(":scope > .stacked-cards__item"),
  ];
  if (!items.length) return;

  const state = {
    stack,
    list,
    shell,
    header,
    inner,
    items,
    marginY: 24,
    shellPad: 24,
    headerGap: 48,
    cardTop: 0,
    cardHeight: 0,
    cardHeights: [],
    bases: [],
    scrolling: false,
    scrollingFn: null,
    shellVisible: false,
    io: null,
    mode: null, // "static" | "stack"
  };

  const hideShell = () => {
    if (!shell) return;
    state.shellVisible = false;
    shell.classList.remove("is-ready");
    shell.style.left = "0px";
    shell.style.top = "0px";
    shell.style.width = "0px";
    shell.style.height = "0px";
  };

  const teardownStack = () => {
    if (state.scrollingFn) {
      window.removeEventListener("scroll", state.scrollingFn);
      state.scrollingFn = null;
    }
    if (state.io) {
      state.io.disconnect();
      state.io = null;
    }
    list.style.paddingBottom = "";
    items.forEach((item) => {
      item.style.top = "";
    });
    clearItemTransforms(items);
    hideShell();
  };

  /**
   * Sticky/shell pin line. CSS --stack-top alone can sit under the section
   * heading while it is still on screen; keep a constant gap below the header.
   */
  const getPinTop = () => {
    const cssTop = state.cardTop || 0;
    const pad = state.shellPad || 0;
    const gap = state.headerGap || 48;
    if (!header) return cssTop;
    const headerBottom = header.getBoundingClientRect().bottom;
    // Shell top should clear header by `gap`; cards sit `pad` inside the shell.
    const clearTop = Math.ceil(headerBottom + gap + pad);
    return Math.max(cssTop, clearTop);
  };

  const syncShell = () => {
    if (!shell || !state.cardHeight) return;

    const pad = state.shellPad || 0;
    const pinTop = getPinTop();
    const listRect = list.getBoundingClientRect();
    if (listRect.width <= 0) {
      hideShell();
      return;
    }

    // Horizontal frame follows the list (stable under card scale transforms).
    const shellLeft = Math.round(listRect.left);
    const shellWidth = Math.max(0, Math.round(listRect.width));

    const listTop = listRect.top;
    const maxCardH = state.cardHeights.reduce(
      (m, h) => Math.max(m, h || 0),
      state.cardHeight
    );

    let anyPinned = false;
    let minTop = Infinity;
    let maxBottom = -Infinity;

    items.forEach((item, i) => {
      const scrolling = pinTop - listTop - (state.bases[i] || 0);
      const layoutH = state.cardHeights[i] || state.cardHeight;
      const r = item.getBoundingClientRect();

      if (scrolling > 0) anyPinned = true;

      // Painted bounds (translateY / sticky). Scale shrinks r.bottom — restore
      // full layout height from the painted top so the shell never shrinks.
      minTop = Math.min(minTop, r.top);
      maxBottom = Math.max(maxBottom, r.bottom, r.top + layoutH);
    });

    if (!Number.isFinite(minTop) || !Number.isFinite(maxBottom)) {
      hideShell();
      return;
    }

    // Lead card is still on the sticky line (not releasing upward yet).
    const leadTop = items[0].getBoundingClientRect().top;
    const stuckOnLine = leadTop >= pinTop - 1;

    if (anyPinned && stuckOnLine) {
      // Lock top to the sticky line so card 0 can't rise out mid-stack.
      minTop = Math.min(minTop, pinTop);

      // Cover translateY(marginY * i) cascade + per-card heights (mobile).
      const cascade = state.marginY * Math.max(0, items.length - 1);
      maxBottom = Math.max(maxBottom, pinTop + cascade + maxCardH);
      items.forEach((_, i) => {
        const h = state.cardHeights[i] || state.cardHeight;
        maxBottom = Math.max(maxBottom, pinTop + state.marginY * i + h);
      });
    }
    // else: still approaching, or releasing after the pin — painted union
    // already tracks cards (including ones that scroll out the top).

    let shellTop = Math.round(minTop - pad);

    // Never paint over the section heading (fixed shell used to climb under it).
    if (header) {
      const floor = Math.ceil(
        header.getBoundingClientRect().bottom + (state.headerGap || 48)
      );
      shellTop = Math.max(shellTop, floor);
    }

    shell.style.left = `${shellLeft}px`;
    shell.style.top = `${shellTop}px`;
    shell.style.width = `${shellWidth}px`;
    shell.style.height = `${Math.max(
      0,
      Math.round(maxBottom - shellTop + pad)
    )}px`;

    if (!state.shellVisible) {
      state.shellVisible = true;
      shell.classList.add("is-ready");
    }
  };

  const measure = () => {
    items.forEach((item) => {
      item.style.transform = "none";
      item.style.top = "";
    });

    const styles = getComputedStyle(stack);
    // Prefer --shell-pad-y (Figma mobile py 24) when set; fall back to --shell-pad
    const shellPadY = styles.getPropertyValue("--shell-pad-y").trim();
    const shellPad = styles.getPropertyValue("--shell-pad").trim();
    state.shellPad =
      cssLengthToPx(stack, shellPadY || shellPad) || 24;

    if (inner) {
      const gapPx = parseFloat(getComputedStyle(inner).gap);
      if (Number.isFinite(gapPx) && gapPx > 0) state.headerGap = gapPx;
    }

    const itemStyle = getComputedStyle(items[0]);
    state.cardTop = Math.floor(parseFloat(itemStyle.top)) || 0;

    const marginBottom = parseFloat(itemStyle.marginBottom);
    const gapToken = cssLengthToPx(
      stack,
      styles.getPropertyValue("--stack-cards-gap").trim()
    );

    state.cardHeight = Math.floor(items[0].offsetHeight);
    state.cardHeights = items.map((item) => Math.floor(item.offsetHeight));

    // Prefer the stack gap token when margin collapses to 0 on :last-child reads
    // or when computed margin is oddly small — cascade offsets need the real gap.
    if (!Number.isFinite(marginBottom) || marginBottom < 1) {
      state.marginY = gapToken || 24;
    } else {
      state.marginY = Math.round(marginBottom);
    }
    if (gapToken && gapToken > state.marginY) {
      state.marginY = gapToken;
    }

    // `offsetTop` on a sticky item reports where it is currently stuck, not where it
    // sits in flow, so measuring pin progress against it always cancels to zero.
    // Read the natural offsets with positioning off; `static` is used rather than
    // `relative` because `relative` would keep applying the sticky `top`.
    items.forEach((item) => {
      item.style.position = "static";
    });
    state.bases = items.map((item) => item.offsetTop);
    items.forEach((item) => {
      item.style.position = "";
    });

    if (!state.cardHeight) {
      list.style.paddingBottom = "";
      hideShell();
      return;
    }

    // Extra runway so the last card can reach the pin line and sit on the deck.
    const peekSpan = PEEK_Y * Math.max(0, items.length - 1);
    const pinHold = Math.round(
      (state.cardHeight || 0) + peekSpan + (state.shellPad || 0)
    );
    list.style.paddingBottom = `${pinHold}px`;

    items.forEach((item) => {
      item.style.transform = "translateY(0)";
    });
  };

  const animate = () => {
    if (!state.cardHeight) {
      state.scrolling = false;
      return;
    }

    const pinTop = getPinTop();
    items.forEach((item) => {
      item.style.top = `${pinTop}px`;
    });

    const listTop = list.getBoundingClientRect().top;
    const peekCount = Math.max(0, items.length - 1);

    let frontIndex = -1;
    items.forEach((item, i) => {
      const scrolling = pinTop - listTop - (state.bases[i] || 0);
      if (scrolling > 0) frontIndex = i;
    });

    items.forEach((item, i) => {
      const scrolling = pinTop - listTop - (state.bases[i] || 0);

      if (scrolling <= 0) {
        item.style.transform = "translateY(0) scale(1)";
        item.style.opacity = "1";
        return;
      }

      if (i === frontIndex) {
        item.style.transform = "translateY(0) scale(1)";
        item.style.opacity = "1";
        return;
      }

      const depth = Math.min(frontIndex - i, peekCount);
      const y = -PEEK_Y * depth;
      const scale = 1 - PEEK_SCALE * depth;
      item.style.transform = `translateY(${y}px) scale(${scale})`;
      item.style.opacity = "1";
    });

    syncShell();
    state.scrolling = false;
  };

  const onScroll = () => {
    if (state.scrolling) return;
    state.scrolling = true;
    window.requestAnimationFrame(animate);
  };

  const boot = () => {
    measure();
    animate();
  };

  const enableStatic = () => {
    teardownStack();
    list.classList.add("is-static-stack");
    state.mode = "static";
  };

  const enableStack = () => {
    list.classList.remove("is-static-stack");
    state.mode = "stack";

    state.io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (state.scrollingFn) return;
          state.scrollingFn = onScroll;
          window.addEventListener("scroll", state.scrollingFn, {
            passive: true,
          });
          measure();
          animate();
        } else if (state.scrollingFn) {
          window.removeEventListener("scroll", state.scrollingFn);
          state.scrollingFn = null;
          hideShell();
        }
      },
      { threshold: [0, 0.01, 1] }
    );

    boot();
    window.requestAnimationFrame(boot);

    list.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", boot, { once: true });
    });

    state.io.observe(stack);
  };

  const applyMode = () => {
    if (prefersReducedMotion()) {
      if (state.mode !== "static") enableStatic();
      return;
    }
    if (state.mode !== "stack") {
      teardownStack();
      enableStack();
      return;
    }
    boot();
  };

  applyMode();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyMode, 150);
  });
}

function initStackedCards() {
  document.querySelectorAll(".stacked-cards").forEach((section) => {
    if (section.dataset.stackedCardsBound === "1") return;
    section.dataset.stackedCardsBound = "1";
    initHeadingChevrons(section);
    bindStack(section);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStackedCards);
} else {
  initStackedCards();
}

export { initStackedCards };
