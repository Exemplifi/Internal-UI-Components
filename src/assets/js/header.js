// Header Component JavaScript
const setupHeader = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  const searchBtn = header.querySelector('.header__search-btn');
  const mobileToggle = header.querySelector('.header__toggle');
  const navbarCollapse = header.querySelector('.navbar-collapse');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  const handleMobileMenu = () => {
    document.body.classList.toggle('menu-open');
    // Update ARIA expanded state
    if (mobileToggle) {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
    }
  };

  const handleOutsideClick = (e) => {
    if (
      document.body.classList.contains('menu-open') &&
      !header.contains(e.target)
    ) {
      mobileToggle.click();
    }
  };

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      mobileToggle.click();
    }
  };

  const setupDropdownKeyboardNavigation = () => {
    const dropdowns = header.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      const menuIcon = trigger?.querySelector('.header__menu-icon');

      if (trigger && menu) {
        // Add click event listener for icon rotation
        trigger.addEventListener('click', () => {
          if (menuIcon) {
            menuIcon.classList.toggle('rotated');
          }
        });

        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger.click();
          }
        });
      }
    });
  };

  const setupAccessibility = () => {
    // Ensure proper ARIA states for mobile menu
    if (mobileToggle && navbarCollapse) {
      const updateAriaExpanded = () => {
        const isExpanded = document.body.classList.contains('menu-open');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
      };

      // Update ARIA states when menu opens/closes
      const observer = new MutationObserver(() => {
        updateAriaExpanded();
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Add keyboard navigation for dropdowns
    const dropdowns = header.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
      const items = dropdown.querySelectorAll('.dropdown-item');

      items.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
          let targetItem;

          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              targetItem = items[index - 1] || items[items.length - 1];
              break;
            case 'ArrowDown':
              e.preventDefault();
              targetItem = items[index + 1] || items[0];
              break;
            case 'Escape':
              e.preventDefault();
              dropdown.closest('.dropdown').querySelector('.dropdown-toggle').click();
              break;
          }

          if (targetItem) {
            targetItem.focus();
          }
        });
      });
    });
  };

  // Bind events
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }

  if (mobileToggle && navbarCollapse) {
    mobileToggle.addEventListener('click', handleMobileMenu);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
  }

  setupDropdownKeyboardNavigation();
  setupAccessibility();
};

// Initialize header
document.addEventListener('DOMContentLoaded', setupHeader);
