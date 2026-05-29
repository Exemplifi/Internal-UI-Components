(function () {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  var mq = window.matchMedia("(min-width: 1200px)");
  var nav = document.getElementById("primaryNav");
  var mobileHeader = document.querySelector(".navbar-mobile-header");
  var dropdownItems = document.querySelectorAll(".nav-item.dropdown-custom");
  var flyoutParentRows = document.querySelectorAll(
    "#primaryNav .dropdown-panel li.has-flyout"
  );

  function isDesktop() {
    return mq.matches;
  }

  function setMobileMenuOpen(open) {
    if (!mobileHeader) return;
    mobileHeader.classList.toggle("open-menu", open);
  }

  if (nav) {
    nav.addEventListener("shown.bs.collapse", function () {
      setMobileMenuOpen(true);
    });
    nav.addEventListener("hidden.bs.collapse", function () {
      setMobileMenuOpen(false);
    });
    setMobileMenuOpen(nav.classList.contains("show"));
  }

  function isPlaceholderTriggerLink(el) {
    if (!el || el.tagName !== "A") return true;
    var href = el.getAttribute("href");
    if (href == null || href === "" || href === "#") return true;
    var t = href.trim().toLowerCase();
    if (t.indexOf("javascript:") === 0) return true;
    return false;
  }

  function setExpanded(item, open) {
    var btn = item.querySelector(".nav-trigger");
    if (!btn) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) item.classList.add("show");
    else item.classList.remove("show");
  }

  function toggleTopDropdown(item) {
    var willOpen = !item.classList.contains("show");
    dropdownItems.forEach(function (other) {
      if (other !== item) setExpanded(other, false);
    });
    setExpanded(item, willOpen);
  }

  function clickHitChevron(ev, chevron) {
    if (!chevron) return false;
    if (ev.target && ev.target.closest && ev.target.closest(".nav-chevron-toggle")) {
      return true;
    }
    var x = ev.clientX;
    var y = ev.clientY;
    if (typeof x !== "number" || typeof y !== "number") return false;
    var rect = chevron.getBoundingClientRect();
    if (!rect.width && !rect.height) return false;
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }

  var HOVER_CLOSE_MS = 100;
  var topCloseTimers = new Map();

  function clearTopCloseTimer(li) {
    var t = topCloseTimers.get(li);
    if (t) {
      clearTimeout(t);
      topCloseTimers.delete(li);
    }
  }

  function scheduleTopClose(li) {
    clearTopCloseTimer(li);
    var tid = setTimeout(function () {
      topCloseTimers.delete(li);
      if (!isDesktop()) return;
      if (li.matches(":hover")) return;
      if (li.contains(document.activeElement)) return;
      setExpanded(li, false);
      li.classList.remove("is-active");
    }, HOVER_CLOSE_MS);
    topCloseTimers.set(li, tid);
  }

  function closeAllTop() {
    dropdownItems.forEach(function (li) {
      clearTopCloseTimer(li);
      setExpanded(li, false);
      li.classList.remove("is-active");
    });
  }

  var flyoutCloseTimers = new Map();

  function clearFlyoutCloseTimer(li) {
    var t = flyoutCloseTimers.get(li);
    if (t) {
      clearTimeout(t);
      flyoutCloseTimers.delete(li);
    }
  }

  function scheduleFlyoutClose(li) {
    clearFlyoutCloseTimer(li);
    var tid = setTimeout(function () {
      flyoutCloseTimers.delete(li);
      if (!isDesktop()) return;
      if (li.matches(":hover")) return;
      if (li.contains(document.activeElement)) return;
      li.classList.remove("is-open");
      var b = li.querySelector(".flyout-trigger");
      if (b) b.setAttribute("aria-expanded", "false");
    }, HOVER_CLOSE_MS);
    flyoutCloseTimers.set(li, tid);
  }

  function closeAllFlyouts() {
    flyoutParentRows.forEach(function (li) {
      clearFlyoutCloseTimer(li);
      li.classList.remove("is-open");
      var b = li.querySelector(".flyout-trigger");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function openFlyout(li) {
    if (!li) return;
    flyoutParentRows.forEach(function (other) {
      if (other !== li) {
        clearFlyoutCloseTimer(other);
        other.classList.remove("is-open");
        var ob = other.querySelector(".flyout-trigger");
        if (ob) ob.setAttribute("aria-expanded", "false");
      }
    });
    clearFlyoutCloseTimer(li);
    li.classList.add("is-open");
    var trigger = li.querySelector(".flyout-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  function closeFlyout(li) {
    if (!li) return;
    clearFlyoutCloseTimer(li);
    li.classList.remove("is-open");
    var trigger = li.querySelector(".flyout-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  /* Desktop keyboard: Tab stays on top-level triggers; arrows enter panels/flyouts */
  var KB_TAB_SAVED = "data-header-kb-tab";

  function isKbVisible(el) {
    if (!el || el.disabled) return false;
    if (el.closest("[hidden]")) return false;
    return el.getClientRects().length > 0;
  }

  function getTopNavFocusables() {
    if (!nav) return [];
    var list = [];
    nav.querySelectorAll(".navbar-nav > .nav-item > .nav-trigger").forEach(function (el) {
      list.push(el);
    });
    nav.querySelectorAll(
      ".navbar-utilities .lang-picker, .navbar-utilities .search-btn, .navbar-utilities .header__alerts-btn"
    ).forEach(function (el) {
      list.push(el);
    });
    return list.filter(isKbVisible);
  }

  function focusNextTopNav(fromEl) {
    var all = getTopNavFocusables();
    var i = all.indexOf(fromEl);
    if (i >= 0 && i < all.length - 1) {
      all[i + 1].focus();
      return true;
    }
    return false;
  }

  function focusPrevTopNav(fromEl) {
    var all = getTopNavFocusables();
    var i = all.indexOf(fromEl);
    if (i > 0) {
      all[i - 1].focus();
      return true;
    }
    return false;
  }

  function getDropdownRowTriggers(panel) {
    var list = panel && panel.querySelector(".dropdown-link-list");
    if (!list) return [];
    return Array.from(list.querySelectorAll(":scope > .dropdown-link"))
      .map(function (row) {
        return (
          row.querySelector(":scope > .flyout-trigger") ||
          row.querySelector(":scope > a[href]")
        );
      })
      .filter(isKbVisible);
  }

  function getFlyoutMenuLinks(flyout) {
    if (!flyout) return [];
    return Array.from(
      flyout.querySelectorAll('[role="menuitem"], li:not(.dropdown-flyout__back) > a[href]')
    ).filter(function (a) {
      return !a.classList.contains("flyout-back-btn");
    });
  }

  function getFlyoutRowFromTrigger(trigger) {
    if (!trigger) return null;
    return trigger.closest(".dropdown-link.has-flyout, li.has-flyout");
  }

  function openFlyoutAndFocusFirst(row, flyoutEl) {
    openFlyout(row);
    var links = getFlyoutMenuLinks(flyoutEl);
    if (!links.length) return;
    requestAnimationFrame(function () {
      links[0].focus();
    });
  }

  function setPanelRemovedFromTabOrder(panel, removed) {
    if (!panel) return;
    panel.querySelectorAll("a[href], button").forEach(function (el) {
      if (el.classList.contains("flyout-back-btn")) return;
      if (removed) {
        if (!el.hasAttribute(KB_TAB_SAVED)) {
          el.setAttribute(KB_TAB_SAVED, el.getAttribute("tabindex") || "");
        }
        el.setAttribute("tabindex", "-1");
      } else if (el.hasAttribute(KB_TAB_SAVED)) {
        var saved = el.getAttribute(KB_TAB_SAVED);
        el.removeAttribute(KB_TAB_SAVED);
        if (saved === "") {
          el.removeAttribute("tabindex");
        } else {
          el.setAttribute("tabindex", saved);
        }
      }
    });
  }

  function initDesktopDropdownTabOrder() {
    if (!isDesktop()) return;
    document.querySelectorAll("#primaryNav .dropdown-panel").forEach(function (panel) {
      setPanelRemovedFromTabOrder(panel, true);
    });
  }

  function clearDesktopDropdownTabOrder() {
    document.querySelectorAll("#primaryNav .dropdown-panel").forEach(function (panel) {
      setPanelRemovedFromTabOrder(panel, false);
    });
  }

  function focusFirstDropdownRow(navItem) {
    var panel = navItem.querySelector(".dropdown-panel");
    var rows = getDropdownRowTriggers(panel);
    if (rows.length) {
      closeAllFlyouts();
      rows[0].focus();
    }
  }

  function handleDesktopNavTriggerKeydown(e, li, btn) {
    if (!isDesktop()) return;
    if (e.key === "Tab" && !e.shiftKey) {
      if (document.activeElement !== btn) return;
      e.preventDefault();
      closeAllFlyouts();
      focusNextTopNav(btn);
      return;
    }
    if (e.key === "Tab" && e.shiftKey) {
      if (document.activeElement !== btn) return;
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setExpanded(li, true);
      li.classList.add("is-active");
      focusFirstDropdownRow(li);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      var top = getTopNavFocusables();
      var idx = top.indexOf(btn);
      if (idx === -1) return;
      var next =
        e.key === "ArrowRight"
          ? top[(idx + 1) % top.length]
          : top[(idx - 1 + top.length) % top.length];
      if (next) next.focus();
    }
  }

  function getPanelKeyContext(target) {
    var panel = target.closest(".dropdown-panel");
    if (!panel) return null;
    var activeEl = document.activeElement || target;
    var navItem = panel.closest(".nav-item.dropdown-custom");
    var navTrigger = navItem && navItem.querySelector(".nav-trigger");
    var rowTriggers = getDropdownRowTriggers(panel);
    var flyoutRow = activeEl.closest(".dropdown-link.has-flyout, li.has-flyout");
    if (!flyoutRow || !panel.contains(flyoutRow)) {
      flyoutRow = target.closest(".dropdown-link.has-flyout, li.has-flyout");
    }
    var flyout = flyoutRow ? flyoutRow.querySelector(".dropdown-flyout") : null;
    var flyoutTriggerEl = flyoutRow ? flyoutRow.querySelector(".flyout-trigger") : null;
    var flyoutLinks = getFlyoutMenuLinks(flyout);
    var isFlyoutTrigger = !!(
      flyoutTriggerEl &&
      (activeEl === flyoutTriggerEl || flyoutTriggerEl.contains(activeEl))
    );
    return {
      panel: panel,
      activeEl: activeEl,
      navTrigger: navTrigger,
      rowTriggers: rowTriggers,
      flyoutRow: flyoutRow,
      flyout: flyout,
      flyoutTriggerEl: flyoutTriggerEl,
      flyoutLinks: flyoutLinks,
      isFlyoutTrigger: isFlyoutTrigger,
    };
  }

  function handleDesktopArrowLeft(e, ctx) {
    var activeEl = ctx.activeEl;
    if (!ctx.panel.contains(activeEl)) return false;

    e.preventDefault();
    e.stopPropagation();

    if (
      ctx.flyout &&
      ctx.flyout.contains(activeEl) &&
      ctx.flyoutTriggerEl &&
      activeEl !== ctx.flyoutTriggerEl
    ) {
      closeFlyout(ctx.flyoutRow);
      ctx.flyoutTriggerEl.focus();
      return true;
    }

    if (ctx.isFlyoutTrigger) {
      closeFlyout(ctx.flyoutRow);
      if (ctx.navTrigger) ctx.navTrigger.focus();
      return true;
    }

    if (ctx.rowTriggers.indexOf(activeEl) !== -1 || ctx.panel.contains(activeEl)) {
      closeAllFlyouts();
      if (ctx.navTrigger) ctx.navTrigger.focus();
      return true;
    }

    return false;
  }

  function handleDesktopDropdownPanelKeydown(e) {
    if (!isDesktop()) return;
    var target = e.target;
    var ctx = getPanelKeyContext(target);
    if (!ctx) return;
    var panel = ctx.panel;
    var navTrigger = ctx.navTrigger;
    var rowTriggers = ctx.rowTriggers;
    var flyoutRow = ctx.flyoutRow;
    var flyout = ctx.flyout;
    var flyoutLinks = ctx.flyoutLinks;
    var isFlyoutTrigger = ctx.isFlyoutTrigger;
    var activeEl = ctx.activeEl;

    if (e.key === "Tab" && !e.shiftKey) {
      var tabOrder = rowTriggers.slice();
      var openFlyout = panel.querySelector("li.has-flyout.is-open");
      if (openFlyout) {
        tabOrder = tabOrder.concat(
          getFlyoutMenuLinks(openFlyout.querySelector(".dropdown-flyout"))
        );
      }
      var last = tabOrder[tabOrder.length - 1];
      if (target === last) {
        e.preventDefault();
        closeAllFlyouts();
        if (navTrigger) focusNextTopNav(navTrigger);
      }
      return;
    }

    if (e.key === "Tab" && e.shiftKey) {
      var first = rowTriggers[0];
      if (target === first) {
        e.preventDefault();
        closeAllFlyouts();
        if (navTrigger) navTrigger.focus();
      } else if (flyout && flyout.contains(target) && target === flyoutLinks[0]) {
        e.preventDefault();
        closeFlyout(flyoutRow);
        var ft = flyoutRow.querySelector(".flyout-trigger");
        if (ft) ft.focus();
      }
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      var dir = e.key === "ArrowDown" ? 1 : -1;
      if (flyout && flyout.contains(activeEl) && !isFlyoutTrigger) {
        var fIdx = flyoutLinks.indexOf(activeEl);
        if (fIdx !== -1) {
          e.preventDefault();
          var fNext = flyoutLinks[fIdx + dir];
          if (fNext) {
            fNext.focus();
          } else if (dir < 0 && fIdx === 0) {
            closeFlyout(flyoutRow);
            if (ctx.flyoutTriggerEl) ctx.flyoutTriggerEl.focus();
          }
        }
        return;
      }
      var rIdx = rowTriggers.indexOf(activeEl);
      if (rIdx !== -1) {
        e.preventDefault();
        closeAllFlyouts();
        var rNext = rowTriggers[rIdx + dir];
        if (rNext) {
          rNext.focus();
        } else if (dir < 0 && navTrigger) {
          navTrigger.focus();
        }
      }
      return;
    }

    if (e.key === "ArrowRight" && isFlyoutTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openFlyoutAndFocusFirst(flyoutRow, flyout);
      return;
    }

    if (e.key === "ArrowLeft") {
      handleDesktopArrowLeft(e, ctx);
    }
  }

  initDesktopDropdownTabOrder();

  /* Desktop: sync aria-expanded with focus-within for screen readers */
  function updateTopAria() {
    if (!isDesktop()) return;
    dropdownItems.forEach(function (li) {
      var open =
        li.matches(":focus-within") ||
        li.classList.contains("force-open");
      setExpanded(li, open);
      li.classList.toggle("is-active", open);
    });
  }

  /* Site search: toggle panel; input focuses only on direct click or typing */
  var searchHosts = document.querySelectorAll(".navbar-utility-search");
  var SEARCH_TYPE_FOCUS_SKIP = { INPUT: 1, TEXTAREA: 1, SELECT: 1 };

  function isPrintableSearchKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    return e.key.length === 1;
  }

  function getOpenSearchHost() {
    var open = null;
    searchHosts.forEach(function (host) {
      if (host.classList.contains("is-open")) open = host;
    });
    return open;
  }

  function focusSearchInputFromTyping(searchHost, e) {
    var searchInput = searchHost.querySelector(".site-search-input");
    if (!searchInput || document.activeElement === searchInput) return;
    var active = document.activeElement;
    if (
      active &&
      SEARCH_TYPE_FOCUS_SKIP[active.tagName] &&
      !searchHost.contains(active)
    ) {
      return;
    }
    if (!searchHost.contains(active) && active !== document.body) {
      return;
    }
    e.preventDefault();
    searchInput.focus({ preventScroll: true });
    var start = searchInput.selectionStart;
    var end = searchInput.selectionEnd;
    var val = searchInput.value;
    var next = val.slice(0, start) + e.key + val.slice(end);
    searchInput.value = next;
    var pos = start + e.key.length;
    searchInput.setSelectionRange(pos, pos);
  }

  function setSearchOpen(searchHost, open) {
    if (!searchHost) return;
    var searchBtn = searchHost.querySelector(".search-btn");
    var panel = searchHost.querySelector(".site-search-input-wrap");
    if (!searchBtn) return;
    searchHost.classList.toggle("is-open", open);
    searchBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (panel) {
      if (open) {
        panel.removeAttribute("inert");
        panel.removeAttribute("aria-hidden");
      } else {
        panel.setAttribute("inert", "");
        panel.setAttribute("aria-hidden", "true");
      }
    }
  }
  function toggleSearch(searchHost) {
    if (!searchHost) return;
    setSearchOpen(searchHost, !searchHost.classList.contains("is-open"));
  }
  function closeSearch() {
    searchHosts.forEach(function (searchHost) {
      if (searchHost.classList.contains("is-open")) {
        setSearchOpen(searchHost, false);
      }
    });
  }
  searchHosts.forEach(function (searchHost) {
    setSearchOpen(searchHost, searchHost.classList.contains("is-open"));
  });
  searchHosts.forEach(function (searchHost) {
    var searchBtn = searchHost.querySelector(".search-btn");
    var searchInput = searchHost.querySelector(".site-search-input");
    if (!searchBtn) return;
    searchBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      searchHosts.forEach(function (otherHost) {
        if (otherHost !== searchHost) {
          setSearchOpen(otherHost, false);
        }
      });
      toggleSearch(searchHost);
    });
    searchBtn.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      searchHosts.forEach(function (otherHost) {
        if (otherHost !== searchHost) {
          setSearchOpen(otherHost, false);
        }
      });
      toggleSearch(searchHost);
    });
    if (searchInput) {
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          e.stopPropagation();
          setSearchOpen(searchHost, false);
          searchBtn.focus();
        }
      });
    }
  });
  document.addEventListener("click", function (e) {
    searchHosts.forEach(function (searchHost) {
      if (!searchHost.classList.contains("is-open")) return;
      if (!searchHost.contains(e.target)) {
        setSearchOpen(searchHost, false);
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!isPrintableSearchKey(e)) return;
    var openHost = getOpenSearchHost();
    if (!openHost) return;
    focusSearchInputFromTyping(openHost, e);
  });

  document.addEventListener("focusin", function (e) {
    if (!nav || !nav.contains(e.target)) {
      if (isDesktop()) {
        closeAllTop();
        closeAllFlyouts();
        updateTopAria();
      }
      return;
    }
    updateTopAria();
  });

  document.addEventListener("focusout", function (e) {
    if (!isDesktop() || !nav) return;
    var rt = e.relatedTarget;
    if (rt && nav.contains(rt)) {
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!nav.contains(document.activeElement)) {
          closeAllTop();
          closeAllFlyouts();
        }
        updateTopAria();
      });
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSearch();
      if (isDesktop() && nav) {
        var openFlyoutRow = nav.querySelector("li.has-flyout.is-open");
        if (openFlyoutRow) {
          e.preventDefault();
          var flyTrigger = openFlyoutRow.querySelector(".flyout-trigger");
          closeFlyout(openFlyoutRow);
          if (flyTrigger) flyTrigger.focus();
          return;
        }
        var openNavItem = nav.querySelector(".nav-item.dropdown-custom:focus-within");
        if (openNavItem && document.activeElement !== openNavItem.querySelector(".nav-trigger")) {
          e.preventDefault();
          var topTrigger = openNavItem.querySelector(".nav-trigger");
          closeAllFlyouts();
          if (topTrigger) topTrigger.focus();
          return;
        }
      }
      closeAllTop();
      closeAllFlyouts();
      if (nav && nav.classList.contains("show")) {
        var toggler = document.querySelector('[data-bs-target="#primaryNav"]');
        if (toggler && typeof bootstrap !== "undefined") {
          var inst = bootstrap.Collapse.getInstance(nav);
          if (inst) inst.hide();
          toggler.focus();
        }
      }
    }
  });

  if (nav) {
    nav.addEventListener("keydown", function (e) {
      handleDesktopDropdownPanelKeydown(e);
    });
  }

  /* Mobile: top dropdown opens only when the down-chevron is tapped */
  dropdownItems.forEach(function (li) {
    var btn = li.querySelector(".nav-trigger");
    if (!btn) return;
    var chevron = li.querySelector(".nav-chevron-toggle");

    if (chevron) {
      chevron.addEventListener("pointerdown", function (ev) {
        if (isDesktop()) return;
        ev.preventDefault();
        ev.stopPropagation();
      });

      chevron.addEventListener("click", function (ev) {
        if (isDesktop()) return;
        ev.preventDefault();
        ev.stopPropagation();
        toggleTopDropdown(li);
      });
    }

    btn.addEventListener("click", function (ev) {
      if (isDesktop()) {
        if (isPlaceholderTriggerLink(btn)) {
          ev.preventDefault();
        }
        return;
      }

      if (clickHitChevron(ev, chevron)) {
        ev.preventDefault();
        return;
      }

      if (isPlaceholderTriggerLink(btn)) {
        ev.preventDefault();
        toggleTopDropdown(li);
        return;
      }
    });
    btn.addEventListener("keydown", function (e) {
      if (isDesktop()) {
        handleDesktopNavTriggerKeydown(e, li, btn);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!isPlaceholderTriggerLink(btn)) return;
      e.preventDefault();
      toggleTopDropdown(li);
    });
  });

  flyoutParentRows.forEach(function (li) {
    var subBtn = li.querySelector(".flyout-trigger");
    var flyout = li.querySelector(".dropdown-flyout");
    if (!subBtn || !flyout) return;

    var backBtn = flyout.querySelector(".flyout-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", function (e) {
        if (isDesktop()) return;
        e.preventDefault();
        li.classList.remove("is-open");
        subBtn.setAttribute("aria-expanded", "false");
        subBtn.focus();
      });
    }

    subBtn.addEventListener("keydown", function (e) {
      if (!isDesktop()) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        openFlyoutAndFocusFirst(li, flyout);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        var navItem = li.closest(".nav-item.dropdown-custom");
        var topTrigger = navItem && navItem.querySelector(".nav-trigger");
        closeFlyout(li);
        if (topTrigger) topTrigger.focus();
      }
    });

    getFlyoutMenuLinks(flyout).forEach(function (link) {
      link.addEventListener("keydown", function (e) {
        if (!isDesktop() || e.key !== "ArrowLeft") return;
        e.preventDefault();
        e.stopPropagation();
        closeFlyout(li);
        subBtn.focus();
      });
    });

    subBtn.addEventListener("click", function (e) {
      if (isDesktop()) {
        if (isPlaceholderTriggerLink(subBtn)) {
          e.preventDefault();
        }
        return;
      }
      if (e.target.closest(".sub-chevron")) {
        e.preventDefault();
        var open = !li.classList.contains("is-open");
        flyoutParentRows.forEach(function (o) {
          if (o !== li) {
            o.classList.remove("is-open");
            var b = o.querySelector(".flyout-trigger");
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });
        li.classList.toggle("is-open", open);
        subBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open && backBtn) {
          backBtn.focus();
        }
        return;
      }
      if (isPlaceholderTriggerLink(subBtn)) {
        e.preventDefault();
      }
    });

    li.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (isDesktop()) return;
      if (e.target !== subBtn) return;
      if (!isPlaceholderTriggerLink(subBtn)) {
        return;
      }
      e.preventDefault();
      var open = !li.classList.contains("is-open");
      flyoutParentRows.forEach(function (o) {
        if (o !== li) {
          o.classList.remove("is-open");
          var b = o.querySelector(".flyout-trigger");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
      li.classList.toggle("is-open", open);
      subBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    function flyoutHoverTarget(related) {
      if (!related || !related.closest) return false;
      return !!related.closest(".dropdown-link.has-flyout, li.has-flyout");
    }

    li.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      clearFlyoutCloseTimer(li);
      openFlyout(li);
    });
    li.addEventListener("mouseleave", function (ev) {
      if (!isDesktop()) return;
      if (flyoutHoverTarget(ev.relatedTarget)) return;
      scheduleFlyoutClose(li);
    });

    flyout.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      clearFlyoutCloseTimer(li);
      openFlyout(li);
    });
    flyout.addEventListener("mouseleave", function (ev) {
      if (!isDesktop()) return;
      if (flyoutHoverTarget(ev.relatedTarget)) return;
      scheduleFlyoutClose(li);
    });
  });

  mq.addEventListener("change", function () {
    closeAllTop();
    closeAllFlyouts();
    if (isDesktop()) {
      initDesktopDropdownTabOrder();
    } else {
      clearDesktopDropdownTabOrder();
    }
    updateTopAria();
    if (nav) {
      setMobileMenuOpen(nav.classList.contains("show") && !isDesktop());
    }
  });

  /* Desktop hover: delayed close (setTimeout) avoids flicker crossing trigger ↔ panel */
  dropdownItems.forEach(function (li) {
    li.addEventListener("mouseenter", function () {
      if (!isDesktop()) return;
      /* Entering a new top item must collapse siblings immediately; otherwise the
         previous item’s scheduled close still runs after HOVER_CLOSE_MS and the
         old panel lingers when moving quickly across the nav. */
      dropdownItems.forEach(function (other) {
        if (other === li) return;
        clearTopCloseTimer(other);
        setExpanded(other, false);
        other.classList.remove("is-active");
      });
      closeAllFlyouts();
      clearTopCloseTimer(li);
      setExpanded(li, true);
      li.classList.add("is-active");
    });
    li.addEventListener("mouseleave", function () {
      if (!isDesktop()) return;
      scheduleTopClose(li);
    });
  });
})();
