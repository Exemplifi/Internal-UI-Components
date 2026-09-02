class SearchInterface {
  constructor() {
    this.searchForm = document.querySelector(".search-wrap");
    this.searchInput = document.getElementById("search-input");
    this.clearButton = null;
    this.dropdown = null;
    this.selectedIndex = -1;
    this.lastQuery = "";
    this.lastResults = [];
    this.popularSearches = [];

    // Only initialize if required elements exist
    if (this.searchForm && this.searchInput) {
      this.init();
    } else {
      console.warn(
        "SearchInterface: Required elements not found. Search form or input missing."
      );
    }
  }

  init() {
    // Create dropdown if it doesn't exist
    this.createDropdown();

    // Create clear button
    this.createClearButton();

    // Form submission handling
    this.searchForm.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Input event handling
    this.searchInput.addEventListener("input", (e) => this.handleInput(e));
    this.searchInput.addEventListener("keydown", (e) => this.handleKeydown(e));
    this.searchInput.addEventListener("focus", () => this.handleFocus());
    this.searchInput.addEventListener("blur", () => this.handleBlur());

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      // Don't close if clicking on dropdown elements
      if (e.target.closest(".search-dropdown")) {
        return;
      }

      if (!e.target.closest(".search-wrap")) {
        this.hideDropdown();
      }
    });

    this.attachPopularSearches();
  }

  attachPopularSearches() {
    this.popularSearches = this.fetchPopularSearches();
    const popularSearchesHTML = `
    <div class="popular-searches">
      <div class="popular-searches-title">POPULAR</div>
      <div class="popular-searches-list" role="group" aria-label="Popular Search Items">
        ${this.popularSearches
          .map(
            (item, index) => `
              <button type="button" class="popular-search-item" 
                   data-index="${index}" 
                   data-url="${item.url}">
                <span class="popular-search-text">${item.text}</span>
                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M0.750044 4.91667H9.84188L6.75429 1.82909C6.69858 1.77528 6.65414 1.71091 6.62357 1.63974C6.593 1.56857 6.5769 1.49203 6.57623 1.41457C6.57556 1.33712 6.59032 1.26031 6.61965 1.18862C6.64898 1.11693 6.69229 1.0518 6.74706 0.997026C6.80183 0.942255 6.86696 0.898941 6.93865 0.869611C7.01034 0.84028 7.08716 0.825521 7.16461 0.826194C7.24206 0.826867 7.31861 0.842959 7.38978 0.873531C7.46095 0.904103 7.52532 0.948543 7.57913 1.00426L11.6625 5.08759C11.7718 5.19698 11.8333 5.34533 11.8333 5.50001C11.8333 5.65469 11.7718 5.80303 11.6625 5.91242L7.57913 9.99576C7.46911 10.102 7.32176 10.1608 7.16881 10.1595C7.01586 10.1582 6.86955 10.0968 6.7614 9.98865C6.65324 9.8805 6.5919 9.73419 6.59057 9.58124C6.58924 9.42829 6.64803 9.28094 6.75429 9.17093L9.84188 6.08334H0.750044C0.595334 6.08334 0.44696 6.02188 0.337564 5.91249C0.228168 5.80309 0.16671 5.65472 0.16671 5.50001C0.16671 5.3453 0.228168 5.19693 0.337564 5.08753C0.44696 4.97813 0.595334 4.91667 0.750044 4.91667Z" fill="white"/>
                </svg>
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
    this.searchForm.insertAdjacentHTML("afterend", popularSearchesHTML);
    this.attachInitialPopularSearchListeners();
  }

  createDropdown() {
    // Check if dropdown already exists
    this.dropdown = document.getElementById("search-dropdown");

    if (!this.dropdown) {
      // Create dropdown element
      this.dropdown = document.createElement("div");
      this.dropdown.id = "search-dropdown";
      this.dropdown.className = "search-dropdown";
      this.dropdown.setAttribute("role", "listbox");
      this.dropdown.setAttribute("aria-label", "Search results");

      // Insert dropdown at the end of the search form
      this.searchForm.appendChild(this.dropdown);
    }
  }

  createClearButton() {
    // Check if clear button already exists
    this.clearButton = document.getElementById("clear-search");

    if (!this.clearButton) {
      // Create clear button element
      this.clearButton = document.createElement("button");
      this.clearButton.id = "clear-search";
      this.clearButton.type = "button";
      this.clearButton.className = "clear-button";
      this.clearButton.textContent = "Clear";
      this.clearButton.setAttribute("aria-label", "Clear search input");
      this.clearButton.style.display = "none";

      // Insert clear button before the submit button
      const submitButton = this.searchForm.querySelector(
        'button[type="submit"]'
      );
      this.searchForm.insertBefore(this.clearButton, submitButton);

      // Add click event listener
      this.clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearInput();
      });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const query = this.searchInput.value.trim();

    if (query.length === 0) {
      // Focus the input if form is submitted with empty query
      this.searchInput.focus();
      return;
    }

    // If dropdown is open and a result is selected, navigate to it
    if (this.selectedIndex >= 0 && this.lastResults[this.selectedIndex]) {
      const results = this.dropdown.querySelectorAll(".search-result");
      if (results[this.selectedIndex]) {
        results[this.selectedIndex].click();
        this.hideDropdown();
        return;
      }
    }

    // Otherwise, perform search
    this.performSearch(query);
  }

  fetchPopularSearches() {
    // Temporary popular searches data
    const popularSearches = [
      {
        text: "Crisis hotline",
        url: "https://fayettecounty.exemplifi.io/about-us/fiscal-court-property-tax-appeals/"
      },
      {
        text: "Counseling",
        url: "https://fayettecounty.exemplifi.io/faq/"
      },
      {
        text: "Emergency services (PES)",
        url: "https://fayettecounty.exemplifi.io/vehicles/vehicle-registration/"
      },
      {
        text: "Telehealth",
        url: "https://fayettecounty.exemplifi.io/elections/register-to-vote/"
      },
      {
        text: "Housing",
        url: "https://fayettecounty.exemplifi.io/elections/eo-voting-locations-officer-roles/"
      }
    ];

    return popularSearches;
  }

  displayPopularSearches(popularSearches, isNoResults = false) {
    const query = this.searchInput.value.trim();
    const noResultsHTML = `
        <div class="no-results-container">
          <div class="no-results-message">
            <div class="no-results-text">No result found</div>
            <div class="no-results-search-button">
              <a href="/?s=${encodeURIComponent(
                query
              )}" class="search-for-button">
                <span>SEARCH FOR "${query.toUpperCase()}"</span>
                <div class="icon"></div>
              </a>
            </div>
          </div>
          <div class="popular-searches no-results-popular">
            <div class="popular-searches-title">POPULAR</div>
            <div class="popular-searches-list" role="group" aria-label="Popular Search Items">
              ${popularSearches
                .map(
                  (item, index) => `
                    <button type="button" class="popular-search-item" 
                         data-index="${index}" 
                         data-url="${item.url}">
                      <span class="popular-search-text">${item.text}</span>
                      <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M0.750044 4.91667H9.84188L6.75429 1.82909C6.69858 1.77528 6.65414 1.71091 6.62357 1.63974C6.593 1.56857 6.5769 1.49203 6.57623 1.41457C6.57556 1.33712 6.59032 1.26031 6.61965 1.18862C6.64898 1.11693 6.69229 1.0518 6.74706 0.997026C6.80183 0.942255 6.86696 0.898941 6.93865 0.869611C7.01034 0.84028 7.08716 0.825521 7.16461 0.826194C7.24206 0.826867 7.31861 0.842959 7.38978 0.873531C7.46095 0.904103 7.52532 0.948543 7.57913 1.00426L11.6625 5.08759C11.7718 5.19698 11.8333 5.34533 11.8333 5.50001C11.8333 5.65469 11.7718 5.80303 11.6625 5.91242L7.57913 9.99576C7.46911 10.102 7.32176 10.1608 7.16881 10.1595C7.01586 10.1582 6.86955 10.0968 6.7614 9.98865C6.65324 9.8805 6.5919 9.73419 6.59057 9.58124C6.58924 9.42829 6.64803 9.28094 6.75429 9.17093L9.84188 6.08334H0.750044C0.595334 6.08334 0.44696 6.02188 0.337564 5.91249C0.228168 5.80309 0.16671 5.65472 0.16671 5.50001C0.16671 5.3453 0.228168 5.19693 0.337564 5.08753C0.44696 4.97813 0.595334 4.91667 0.750044 4.91667Z" fill="#0E1A32"/>
                      </svg>
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

    this.dropdown.innerHTML = noResultsHTML;
    this.showDropdown();
    this.attachPopularSearchListeners();

    // Add specific handlers for search buttons
    this.attachSearchButtonHandlers();
  }

  attachInitialPopularSearchListeners() {
    const popularItems = document.querySelectorAll(
      ".popular-searches .popular-search-item"
    );
    popularItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const searchText = item.querySelector(
          ".popular-search-text"
        ).textContent;
        this.searchInput.value = searchText;
        this.searchInput.focus();

        // Perform search directly
        this.performSearch(searchText);
        this.showClearButton();
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const searchText = item.querySelector(
            ".popular-search-text"
          ).textContent;
          this.searchInput.value = searchText;
          this.searchInput.focus();

          // Perform search directly
          this.performSearch(searchText);
          this.showClearButton();
        }
      });
    });
  }

  attachPopularSearchListeners() {
    const popularItems = this.dropdown.querySelectorAll(".popular-search-item");
    popularItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const searchText = item.querySelector(
          ".popular-search-text"
        ).textContent;
        this.searchInput.value = searchText;
        this.searchInput.focus();

        // Perform search directly
        this.performSearch(searchText);
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const searchText = item.querySelector(
            ".popular-search-text"
          ).textContent;
          this.searchInput.value = searchText;
          this.searchInput.focus();

          // Perform search directly
          this.performSearch(searchText);
        }
      });

      item.addEventListener("mouseenter", () => {
        this.clearSelection();
        item.classList.add("selected");
        item.setAttribute("aria-selected", "true");
        this.selectedIndex = parseInt(item.dataset.index);
      });
    });
  }

  attachSearchButtonHandlers() {
    // Handle search-for-button clicks
    const searchButtons = this.dropdown.querySelectorAll(".search-for-button");
    searchButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the href and navigate
        const href = button.getAttribute("href");
        if (href) {
          // Use window.location to navigate
          window.location.href = href;
        }
      });
    });
  }

  showShortQueryMessage() {
    this.dropdown.innerHTML =
      '<div class="query-message">Please enter at least 3 characters to search</div>';
    this.showDropdown();
  }

  handleFocus() {
    const query = this.searchInput.value.trim();

    if (this.lastResults.length > 0) {
      // Restore previous results
      this.displayResults(this.lastResults, this.lastQuery);
    } else if (query.length > 0) {
      // Re-search if we have a query but no results
      this.performSearch(query);
    }
  }

  handleBlur() {
    // Check if the related target is a dropdown element
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget &&
      (relatedTarget.closest(".search-dropdown") ||
        relatedTarget.closest(".popular-search-item"))
    ) {
      return; // Don't hide dropdown if clicking on dropdown elements
    }

    // Add a small delay to allow click events to process
    setTimeout(() => {
      // Double-check that we're not hovering over dropdown elements
      if (
        !this.dropdown.matches(":hover") &&
        !this.dropdown.contains(document.activeElement)
      ) {
        this.hideDropdown();
      }
    }, 100);
  }

  handleInput(e) {
    const query = e.target.value.trim();
    const hasContent = e.target.value.length > 0;

    // Handle clear button based on input content
    if (hasContent) {
      this.showClearButton();
    } else {
      this.hideClearButton();
    }

    // Hide dropdown if query is empty
    if (query.length === 0) {
      this.lastQuery = "";
      this.lastResults = [];
      this.hideDropdown();
      return;
    }

    // Perform search for any non-empty query (including single characters)
    this.performSearch(query);
  }

  performSearch(query) {
    // Get search results from static data
    const results = this.fetchSearchResults(query);
    this.lastQuery = query;
    this.lastResults = results;
    this.displayResults(results, query);
  }

  fetchSearchResults(query) {
    // Temporary search results data
    const searchResults = [
      {
        phrase: "Property Tax Appeal",
        subtext: "Appeal your property's assessed value to Fiscal Court.",
        url: "https://fayettecounty.exemplifi.io/about-us/fiscal-court-property-tax-appeals/"
      },
      {
        phrase: "Land Records",
        subtext: "Get answers on recording deeds and documents.",
        url: "https://fayettecounty.exemplifi.io/faq/"
      },
      {
        phrase: "Register A Vehicle",
        subtext: "Renew your tags and vehicle registration.",
        url: "https://fayettecounty.exemplifi.io/elections/register-to-vote/"
      },
      {
        phrase: "Register to Vote",
        subtext: "Register or update your voter information.",
        url: "https://fayettecounty.exemplifi.io/vehicles/vehicle-registration/"
      },
      {
        phrase: "Find Your Polling Place",
        subtext: "Find polling places and view ballots.",
        url: "https://fayettecounty.exemplifi.io/elections/eo-voting-locations-officer-roles/"
      },
      {
        phrase: "Apply for a Marriage License",
        subtext: "Start your marriage license application process.",
        url: "https://fayettecounty.exemplifi.io/marriage-license/"
      },
      {
        phrase: "Property Lookup Tool",
        subtext: "Search official property deeds and records.",
        url: "https://fayettecountyclerk.com/web/landrecords/documentrecordings"
      },
      {
        phrase: "County Clerk",
        subtext: "Learn about our office and mission.",
        url: "https://fayettecounty.exemplifi.io/about-us/meet-the-clerk/"
      },
      {
        phrase: "County Clerk",
        subtext: "Become a notary public",
        url: "https://fayettecounty.exemplifi.io/about-us/meet-the-clerk/"
      },
      {
        phrase: "Forms & Applications",
        subtext: "Find and download all necessary forms.",
        url: "https://fayettecounty.exemplifi.io/vehicles/printable-forms/"
      }
    ];

    // Filter results based on query (case-insensitive)
    const filteredResults = searchResults.filter(
      (result) =>
        result.phrase.toLowerCase().includes(query.toLowerCase()) ||
        result.subtext.toLowerCase().includes(query.toLowerCase())
    );

    return filteredResults;
  }

  showNoResults(query) {
    // Show popular searches when no results are found
    this.displayPopularSearches(this.popularSearches);
  }

  displayResults(results, query) {
    if (results.length === 0) {
      this.showNoResults(query);
      return;
    }

    const resultsHTML = results
      .map(
        (result, index) => `
            <a href="${result.url}" class="search-result" 
               id="search-option-${index}"
               data-index="${index}" 
               role="option"
               aria-selected="false">
                <div class="result-content">
                  <div class="result-phrase">${result.phrase}</div>
                  <div class="result-subtext">${result.subtext}</div>
                </div>
                <div class="result-icon">
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M1.00021 7.50057H16.5862L11.2932 2.20757C11.1977 2.11532 11.1215 2.00498 11.0691 1.88297C11.0167 1.76097 10.9891 1.62975 10.988 1.49697C10.9868 1.36419 11.0121 1.23251 11.0624 1.10962C11.1127 0.986719 11.1869 0.875067 11.2808 0.781174C11.3747 0.687282 11.4864 0.613028 11.6093 0.562748C11.7322 0.512467 11.8638 0.487165 11.9966 0.488319C12.1294 0.489473 12.2606 0.517059 12.3826 0.569468C12.5046 0.621877 12.615 0.698059 12.7072 0.79357L19.7072 7.79357C19.8947 7.9811 20 8.23541 20 8.50057C20 8.76573 19.8947 9.02004 19.7072 9.20757L12.7072 16.2076C12.5186 16.3897 12.266 16.4905 12.0038 16.4882C11.7416 16.486 11.4908 16.3808 11.3054 16.1954C11.12 16.01 11.0148 15.7592 11.0125 15.497C11.0103 15.2348 11.1111 14.9822 11.2932 14.7936L16.5862 9.50057H1.00021C0.734997 9.50057 0.480642 9.39521 0.293106 9.20768C0.10557 9.02014 0.000213623 8.76579 0.000213623 8.50057C0.000213623 8.23535 0.10557 7.981 0.293106 7.79346C0.480642 7.60593 0.734997 7.50057 1.00021 7.50057Z" fill="#0E1A32"/>
                  </svg>
                </div>
            </a>
        `
      )
      .join("");

    const searchButtonHTML = `
      <div class="search-results-footer">
        <a href="/?s=${encodeURIComponent(query)}" class="search-for-button">
          <span>See all results for "${query}" <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L10 7L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg></span>
        </a>
      </div>
    `;

    this.dropdown.innerHTML = `
      <div class="search-results-container">
        ${resultsHTML}
        ${searchButtonHTML}
      </div>
    `;

    this.showDropdown();
    this.attachResultListeners();
  }

  attachResultListeners() {
    const results = this.dropdown.querySelectorAll(".search-result");
    results.forEach((result) => {
      result.addEventListener("click", (e) => {
        // Let the anchor tag handle navigation naturally
        this.hideDropdown();
      });

      result.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          // Let the anchor tag handle navigation naturally
          this.hideDropdown();
        }
      });

      result.addEventListener("mouseenter", () => {
        this.clearSelection();
        result.classList.add("selected");
        result.setAttribute("aria-selected", "true");
        this.selectedIndex = parseInt(result.dataset.index);
      });
    });

    // Also handle the search-for-button in results
    const searchButtons = this.dropdown.querySelectorAll(".search-for-button");
    searchButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the href and navigate
        const href = button.getAttribute("href");
        if (href) {
          // Use window.location to navigate
          window.location.href = href;
        }
      });
    });
  }

  handleKeydown(e) {
    const results = this.dropdown.querySelectorAll(
      ".search-result, .popular-search-item"
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          results.length - 1
        );
        this.updateSelection(results);
        break;

      case "ArrowUp":
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection(results);
        break;

      case "Enter":
        e.preventDefault();
        if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
          // Let the anchor tag handle navigation naturally
          results[this.selectedIndex].click();
          this.hideDropdown();
        }
        break;

      case "Escape":
        this.hideDropdown();
        this.searchInput.blur();
        break;
    }
  }

  updateSelection(results) {
    this.clearSelection();
    if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
      const selected = results[this.selectedIndex];
      selected.classList.add("selected");
      selected.setAttribute("aria-selected", "true");
      if (selected.id) {
        this.searchInput.setAttribute("aria-activedescendant", selected.id);
      }
      selected.focus();
    } else {
      this.searchInput.removeAttribute("aria-activedescendant");
    }
  }

  clearSelection() {
    this.dropdown
      .querySelectorAll(".search-result, .popular-search-item")
      .forEach((result) => {
        result.classList.remove("selected");
        result.setAttribute("aria-selected", "false");
      });
  }

  showDropdown() {
    this.dropdown.classList.add("show");
    this.searchInput.setAttribute("aria-expanded", "true");
  }

  hideDropdown() {
    this.dropdown.classList.remove("show");
    this.searchInput.setAttribute("aria-expanded", "false");
    this.searchInput.removeAttribute("aria-activedescendant");
    this.selectedIndex = -1;
  }

  hideLabel() {
    if (this.searchLabel) {
      this.searchLabel.style.display = "none";
    }
  }

  clearInput() {
    // Clear the input value
    this.searchInput.value = "";

    // Trigger input event to update UI state
    this.searchInput.dispatchEvent(new Event("input"));

    // Focus the input
    this.searchInput.focus();
  }

  showClearButton() {
    if (this.clearButton) {
      this.clearButton.style.display = "inline-block";
    }
  }

  hideClearButton() {
    if (this.clearButton) {
      this.clearButton.style.display = "none";
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SearchInterface();
});
