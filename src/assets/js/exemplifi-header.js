document.addEventListener("DOMContentLoaded", () => {
  $(function () {
    $(".navbar-toggler").on("click", function () {
      $(".ex-header, .ex-menu").toggleClass("white-bg");
    });

    $(".navbar-toggler").on("click", function () {
      $("body").toggleClass("overflow-y-hidden");
    });

    $(".ex-header .label").on("click", function () {
      $(this).toggleClass("rotate");
      $(this)
        .closest(".heading-wrap")
        .next(".ex-menu-links-wrap")
        .stop()
        .slideToggle();
    });

    //Header On Scroll Script
    let lastScrollTop = 0;
    jQuery(window).on("scroll", function () {
      let scrollTop = jQuery(this).scrollTop();

      if (scrollTop > lastScrollTop) {
        // Scrolling up
        jQuery(".ex-header").addClass("upwards");
      } else {
        // Scrolling down
        jQuery(".ex-header").removeClass("upwards");
      }

      lastScrollTop = scrollTop;
    });

    // Search Script
    $(".search-btn").on("click", function (event) {
      event.stopPropagation();
      $(".search-form").toggleClass("expand");
      $(this).toggleClass("close-search");

      // Focus on the search input field when expanding the search form
      if ($(".search-form").hasClass("expand")) {
        $(".search-form input").focus();
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      const isExpanded = searchBtn.getAttribute("aria-expanded") === "true";
      searchBtn.setAttribute("aria-expanded", String(!isExpanded));
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Select key elements
  const menuToggleBtn = document.querySelector(".navbar-toggler");
  if (!menuToggleBtn) {
    console.error("Menu toggle button not found");
    return;
  }
  const menu = document.querySelector("#eX-navbarNav");
  const header = document.querySelector(".ex-header"); // Header element
  const exMenu = document.querySelector(".ex-menu"); // Menu wrapper

  let focusableElements;
  let firstFocusable;
  let lastFocusable;

  // Trap Tab and Shift+Tab inside the menu
  function trapTabKey(e) {
    if (!menu.classList.contains("show")) return;

    const isTabPressed = e.key === "Tab" || e.keyCode === 9;
    if (!isTabPressed) return;

    // Recalculate all focusable AND visible elements
    const allFocusable = menu.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Filter visible elements only
    focusableElements = Array.from(allFocusable).filter((el) => isVisible(el));

    if (!focusableElements.length) return;

    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];

    const focused = document.activeElement;
    console.log("First:", firstFocusable);
    console.log("Last:", lastFocusable);

    if (e.shiftKey) {
      // If Shift+Tab and focus is at the first element, loop to last
      if (focused === firstFocusable || firstFocusable.contains(focused)) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // If Tab and focus is at the last element, loop to first
      if (focused === lastFocusable || lastFocusable.contains(focused)) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element);

    // Check if it's visually hidden using .screen-only styles
    const isScreenOnly =
      style.position === "absolute" &&
      style.width === "1px" &&
      style.height === "1px" &&
      style.margin === "-1px" &&
      style.overflow === "hidden" &&
      (style.clip === "rect(0px, 0px, 0px, 0px)" ||
        style.clip === "rect(0 0 0 0)") &&
      (style.clipPath === "inset(50%)" ||
        style.clipPath === "inset(50% 50% 50% 50%)") &&
      style.whiteSpace === "nowrap" &&
      style.border === "0px none rgb(0, 0, 0)";

    if (isScreenOnly) return false;

    // Default visibility check (non-zero layout)
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  // Helper function to check if element is visible
  // Close the menu and clean up
  function closeMenu() {
    menu.classList.remove("show"); // Hide menu
    menuToggleBtn.setAttribute("aria-expanded", "false"); // Update ARIA
    menuToggleBtn.focus(); // Return focus to toggle button
    document.removeEventListener("keydown", handleKeydown); // Stop listening for keys

    // Remove white background classes from header and menu
    if (header) header.classList.remove("white-bg");
    if (exMenu) exMenu.classList.remove("white-bg");
  }

  // Handle keydown: escape to close or trap tab focus
  function handleKeydown(e) {
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      closeMenu(); // Close menu and do the new tasks
    } else {
      trapTabKey(e); // Trap focus within open menu
    }
  }

  // Handle click on toggle button
  menuToggleBtn.addEventListener("click", () => {
    setTimeout(() => {
      if (menu.classList.contains("show")) {
        // Menu is open

        // Select all focusable elements inside menu
        focusableElements = menu.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        firstFocusable = focusableElements[0];
        lastFocusable = focusableElements[focusableElements.length - 1];

        firstFocusable.focus(); // Move focus to the first element

        document.addEventListener("keydown", handleKeydown); // Enable Escape & Tab trap
        menuToggleBtn.setAttribute("aria-expanded", "true"); // Update ARIA
      } else {
        // Menu is closed
        document.removeEventListener("keydown", handleKeydown); // Cleanup
        menuToggleBtn.setAttribute("aria-expanded", "false"); // Update ARIA
      }
    }, 100); // Wait for Bootstrap collapse animation
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const accordionButtons = document.querySelectorAll('.label[role="button"]');

  accordionButtons.forEach((button) => {
    // Get the closest wrapper and find the panel just after it
    const wrapper = button.closest(".heading-wrap");
    const panel = wrapper?.nextElementSibling;

    if (!panel || !panel.classList.contains("ex-menu-links-wrap")) return;

    function toggleAccordion() {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      panel.style.display = isExpanded ? "none" : "block";
    }

    button.addEventListener("click", toggleAccordion);

    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });
});
