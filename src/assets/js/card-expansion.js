// Card Expansion: open panel directly after the active card's visual row
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".card-expansion");
  if (!sections.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqTablet = window.matchMedia("(min-width: 768px)");
  const mqDesktop = window.matchMedia("(min-width: 992px)");

  function getColsPerRow() {
    if (mqDesktop.matches) return 3;
    if (mqTablet.matches) return 2;
    return 1;
  }

  function setButtonState(btn, isOpen) {
    const labelEl = btn.querySelector(".card-expansion__btn-label");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!labelEl) return;
    labelEl.textContent = isOpen
      ? labelEl.getAttribute("data-label-close") || "Close"
      : labelEl.getAttribute("data-label-open") || "Details";
  }

  function getGrid(cardOrSection) {
    return cardOrSection.querySelector
      ? cardOrSection.querySelector(".card-expansion__grid") ||
          cardOrSection.querySelector(".card-expansion__group > .row")
      : null;
  }

  function getCardCols(grid) {
    return Array.from(grid.children).filter(function (el) {
      return el.querySelector(".card-expansion__card");
    });
  }

  function getBodies(section) {
    return section.querySelector(".card-expansion__bodies");
  }

  function restoreBodies(bodies, section) {
    if (!bodies || !section) return;
    const group = section.querySelector(".card-expansion__group") || section;
    const grid = getGrid(group);
    bodies.classList.remove("col-12", "is-open");
    if (grid) {
      grid.after(bodies);
    }
  }

  function placeBodiesAfterVisualRow(card, bodies) {
    const grid = card.closest(".card-expansion__grid") || card.closest(".row");
    if (!grid || !bodies) return;

    const cols = getCardCols(grid);
    const cardCol = card.closest("[class*='col-']");
    const index = cols.indexOf(cardCol);
    if (index < 0) return;

    const perRow = getColsPerRow();
    const rowEnd = Math.min(
      cols.length - 1,
      Math.floor(index / perRow) * perRow + perRow - 1
    );

    bodies.classList.add("col-12");
    cols[rowEnd].after(bodies);
  }

  function closeCard(card) {
    if (!card) return;
    const section = card.closest(".card-expansion");
    const btn = card.querySelector(".card-expansion__btn");
    const bodyId = btn && btn.getAttribute("aria-controls");
    const body = bodyId ? document.getElementById(bodyId) : null;
    const bodies = section ? getBodies(section) : null;

    card.classList.remove("is-active");
    if (btn) setButtonState(btn, false);
    if (body) {
      body.hidden = true;
      body.classList.remove("is-active");
    }
    if (bodies && !bodies.querySelector(".card-expansion__body.is-active")) {
      restoreBodies(bodies, section);
    }
  }

  function closeAllInSection(section) {
    section.querySelectorAll(".card-expansion__card.is-active").forEach(closeCard);
  }

  function openCard(card) {
    const section = card.closest(".card-expansion");
    const btn = card.querySelector(".card-expansion__btn");
    const bodyId = btn && btn.getAttribute("aria-controls");
    const body = bodyId ? document.getElementById(bodyId) : null;
    const bodies = section ? getBodies(section) : null;

    if (!section || !btn || !body || !bodies) return;

    closeAllInSection(section);

    card.classList.add("is-active");
    setButtonState(btn, true);
    body.hidden = false;
    body.classList.add("is-active");
    placeBodiesAfterVisualRow(card, bodies);
    bodies.classList.add("is-open");

    if (!reducedMotion.matches) {
      body.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function toggleCard(card) {
    if (card.classList.contains("is-active")) {
      closeCard(card);
    } else {
      openCard(card);
    }
  }

  function repositionOpenPanels() {
    sections.forEach(function (section) {
      const activeCard = section.querySelector(".card-expansion__card.is-active");
      if (!activeCard) return;
      const bodies = getBodies(section);
      if (!bodies) return;
      placeBodiesAfterVisualRow(activeCard, bodies);
      bodies.classList.add("is-open");
    });
  }

  sections.forEach(function (section) {
    section.addEventListener("click", function (event) {
      const toggleBtn = event.target.closest(".card-expansion__btn");
      if (toggleBtn && section.contains(toggleBtn)) {
        const card = toggleBtn.closest(".card-expansion__card");
        if (card) toggleCard(card);
        return;
      }

      const closeBtn = event.target.closest(".card-expansion__body-close");
      if (closeBtn && section.contains(closeBtn)) {
        const body = closeBtn.closest(".card-expansion__body");
        if (!body || !body.id) return;
        const card = section
          .querySelector('.card-expansion__btn[aria-controls="' + body.id + '"]')
          ?.closest(".card-expansion__card");
        if (card) closeCard(card);
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".card-expansion").forEach(closeAllInSection);
  });

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(repositionOpenPanels, 150);
  });
});
