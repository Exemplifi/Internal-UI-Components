(function ($) {
  "use strict";

  class EXCalendar {
    constructor(container) {
      this.container = container;
      this.currentDate = new Date();
      this.selectedDate = new Date();
      this.events = {};
      this.currentMonth = this.currentDate.getMonth();
      this.currentYear = this.currentDate.getFullYear();

      this.init();
    }

    init() {
      this.bindEvents();
      this.renderCalendar();
      this.loadEvents();
    }

    bindEvents() {
      // Navigation buttons
      this.container.on("click", ".ex-calendar-nav-btn", (e) => {
        e.preventDefault();
        const isNext = $(e.currentTarget).hasClass("ex-calendar-next");
        this.navigateMonth(isNext);
      });

      // Date selection
      this.container.on("click", ".ex-calendar-day", (e) => {
        e.preventDefault();
        const day = $(e.currentTarget).data("day");
        const month = $(e.currentTarget).data("month");
        const year = $(e.currentTarget).data("year");

        if (day != null && month != null && year != null) {
          this.selectDate(new Date(year, month, day));
        }
      });

      // Keyboard navigation
      this.container.on("keydown", ".ex-calendar-day", (e) => {
        this.handleKeyboardNavigation(e);
      });

      // Focus management
      this.container.on("focusin", ".ex-calendar-day", (e) => {
        $(e.currentTarget).addClass("ex-calendar-day-focus");
      });

      this.container.on("focusout", ".ex-calendar-day", (e) => {
        $(e.currentTarget).removeClass("ex-calendar-day-focus");
      });
    }

    handleKeyboardNavigation(e) {
      const $currentDay = $(e.currentTarget);
      const $allDays = this.container.find(
        ".ex-calendar-day:not(.ex-calendar-day-inactive)"
      );
      const currentIndex = $allDays.index($currentDay);
      let newIndex = currentIndex;

      switch (e.keyCode) {
        case 37: // Left arrow
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case 39: // Right arrow
          newIndex = Math.min($allDays.length - 1, currentIndex + 1);
          break;
        case 38: // Up arrow
          newIndex = Math.max(0, currentIndex - 7);
          break;
        case 40: // Down arrow
          newIndex = Math.min($allDays.length - 1, currentIndex + 7);
          break;
        case 13: // Enter
        case 32: // Space
          e.preventDefault();
          const day = $currentDay.data("day");
          const month = $currentDay.data("month");
          const year = $currentDay.data("year");

          if (day != null && month != null && year != null) {
            this.selectDate(new Date(year, month, day));
          }
          return;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        e.preventDefault();
        $allDays.eq(newIndex).focus();
      }
    }

    navigateMonth(isNext) {
      if (isNext) {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
      } else {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
      }

      this.renderCalendar();
      this.loadEvents();
      this.updateMonthYear();
    }

    renderCalendar() {
      // Initialize the first and last date of the current month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      // Create a new date object for the start date, adjusted to the start of the week (Monday)
      const startDate = new Date(firstDay);
      // Start weeks on Monday reliably (Sun=0 -> 6, Mon=1 -> 0, ...)
      const dayOfWeek = firstDay.getDay();
      const mondayOffset = (dayOfWeek + 6) % 7;
      startDate.setDate(firstDay.getDate() - mondayOffset); // Start from Monday

      // Select the container where the calendar days will be rendered
      const $daysContainer = this.container.find(".ex-calendar-days");
      $daysContainer.empty(); // Clear any previous calendar days

      $daysContainer.attr("role", "rowgroup");
      this.container.find(".ex-calendar-grid").attr("role", "grid");

      // Initialize currentDate with startDate and set the end date as the last day of the month
      let currentDate = new Date(startDate);
      const endDate = new Date(lastDay);

      let row = $('<div role="row" class="ex-calendar-row"></div>'); // Row wrapper

      // Loop through the days from startDate to endDate
      while (currentDate <= endDate) {
        // Check if the current date is in the current month, today, or selected day
        const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
        const isCurrentDay = this.isSameDate(currentDate, this.currentDate);
        const isSelectedDay = this.isSameDate(currentDate, this.selectedDate);
        const hasEvents = this.hasEventsForDate(currentDate);

        if (isCurrentMonth) {
          // Only create day elements for current month dates
          const dayElement = this.createDayElement(currentDate, {
            isCurrentMonth,
            isCurrentDay,
            isSelectedDay,
            hasEvents
          });
          row.append(dayElement);
        } else {
          // Create empty cells for past/future month dates
          const emptyElement = $(`
                <div class="ex-calendar-day ex-calendar-day-empty"
                     role="gridcell">
                </div>
              `);
          row.append(emptyElement);
        }
        // Add the row to the container if it has 7 days (end of the row)
        if (row.children().length === 7) {
          $daysContainer.append(row);
          row = $('<div role="row" class="ex-calendar-row"></div>'); // Start a new row
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // Append any remaining days in the last row if there are less than 7 days in it
      if (row.children().length > 0) {
        $daysContainer.append(row);
      }
    }

    createDayElement(date, options) {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      let classes = "ex-calendar-day";
      let ariaLabel = `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })}`;

      if (!options.isCurrentMonth) {
        classes += " ex-calendar-day-inactive";
        ariaLabel += " (not in current month)";
      }

      if (options.isCurrentDay) {
        classes += " ex-calendar-day-current";
        ariaLabel += " (current day)";
      }

      if (options.isSelectedDay) {
        classes += " ex-calendar-day-selected";
        ariaLabel += " (selected)";
      }

      if (options.hasEvents) {
        classes += " ex-calendar-day-has-events";
        ariaLabel += " (has events)";
      }

      const dayElement = $(`
                <div class="${classes}"
                     role="gridcell"
                     tabindex="0"
                     aria-label="${ariaLabel}"
                     data-day="${day}"
                     data-month="${month}"
                     data-year="${year}">
                    <span class="ex-calendar-day-number">${day}</span>
                    ${
                      options.hasEvents
                        ? '<div class="ex-calendar-day-indicator"></div>'
                        : ""
                    }
                </div>
            `);

      return dayElement;
    }

    loadEvents() {
      const month = this.currentMonth + 1;
      const year = this.currentYear;

      // API call commented out - using static data for temporary usage
      // $.ajax({
      //   url: xoCalendarAjax.ajaxurl,
      //   type: "POST",
      //   data: {
      //     action: "xo_calendar_get_events",
      //     nonce: xoCalendarAjax.nonce,
      //     month: month,
      //     year: year
      //   },
      //   success: (response) => {
      //     if (response.success) {
      //       this.events = this.groupEventsByDate(response.data);
      //       this.renderCalendar(); // Re-render to show event indicators
      //       this.updateEventDisplay();
      //     }
      //   },
      //   error: (xhr, status, error) => {
      //     console.error("Error loading events:", error);
      //   }
      // });

      // Static data for temporary usage
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const currentMonthName = monthNames[this.currentMonth];
      const today = new Date();
      const currentDay = today.getDate();

      // Sample static events - adjust dates as needed
      const staticEvents = [
        {
          month: currentMonthName,
          year: this.currentYear,
          day: currentDay,
          title: "Sample Event Today",
          start_time: "10:00",
          end_time: "12:00",
          venue: "Conference Room A"
        },
        {
          month: currentMonthName,
          year: this.currentYear,
          day: currentDay + 2,
          title: "Team Meeting",
          start_time: "14:30",
          end_time: "16:00",
          venue: "Main Office"
        },
        {
          month: currentMonthName,
          year: this.currentYear,
          day: currentDay + 5,
          title: "Workshop Session",
          start_time: "09:00",
          end_time: "17:00",
          venue: "Training Center"
        }
      ];

      // Simulate API response structure
      const response = {
        success: true,
        data: staticEvents
      };

      if (response.success) {
        this.events = this.groupEventsByDate(response.data);
        this.renderCalendar(); // Re-render to show event indicators
        this.updateEventDisplay();
      }
    }

    groupEventsByDate(events) {
      const grouped = {};
      events.forEach((event) => {
        // Convert month name to numeric month (0-11)
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        const monthIndex = monthNames.indexOf(event.month);
        const numericMonth = monthIndex + 1; // Convert to 1-12 format

        const dateKey = `${event.year}-${numericMonth}-${event.day}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      });
      return grouped;
    }

    hasEventsForDate(date) {
      const dateKey = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      return this.events[dateKey] && this.events[dateKey].length > 0;
    }

    selectDate(date) {
      this.selectedDate = date;
      this.renderCalendar();
      this.updateEventDisplay();

      // Update focus
      const $selectedDay = this.container.find(
        `[data-day="${date.getDate()}"][data-month="${date.getMonth()}"][data-year="${date.getFullYear()}"]`
      );
      if ($selectedDay.length) {
        $selectedDay.focus();
      }
    }

    updateEventDisplay() {
      const dateKey = `${this.selectedDate.getFullYear()}-${
        this.selectedDate.getMonth() + 1
      }-${this.selectedDate.getDate()}`;
      const events = this.events[dateKey] || [];

      // Debug logging
      console.log("Selected date:", this.selectedDate);
      console.log("Date key:", dateKey);
      console.log("Available events:", this.events);
      console.log("Events for selected date:", events);

      if (events.length > 0) {
        const event = events[0]; // Show first event
        console.log("Showing event:", event);
        this.showEvent(event);
      } else {
        console.log("No events found for selected date");
        this.showNoEvents();
      }
    }

    showEvent(event) {
      const $display = this.container.find(".ex-event-display");
      const $card = $display.find(".ex-event-card");

      $card.find(".ex-event-month").text(event.month.toUpperCase());
      $card.find(".ex-event-day").text(event.day);
      $card.find(".ex-event-title").text(event.title);
      // Format times to include AM/PM
      const formattedStartTime = this.formatTime(event.start_time);
      const formattedEndTime = this.formatTime(event.end_time);

      $card
        .find(".ex-event-time-text")
        .text(`${formattedStartTime} - ${formattedEndTime} PST`);
      $card.find(".ex-event-location-text").text(event.venue);

      // Update the location link to open Google Maps
      const $locationLink = $card.find(".ex-event-location-link");
      if (event.venue && event.venue !== "No venue specified") {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          event.venue
        )}`;
        $locationLink.attr("href", googleMapsUrl);
        $locationLink.show();
      } else {
        $locationLink.hide();
      }

      // Show the time and location sections when there are events
      $card.find(".ex-event-time").show();
      $card.find(".ex-event-location").show();

      $display.attr(
        "aria-label",
        `Event on ${event.month} ${event.day}: ${event.title}`
      );
      $card.show();
    }

    showNoEvents() {
      const $display = this.container.find(".ex-event-display");
      const $card = $display.find(".ex-event-card");

      const selectedMonth = this.selectedDate.toLocaleDateString("en-US", {
        month: "long"
      });
      const selectedDay = this.selectedDate.getDate();

      $card.find(".ex-event-month").text(selectedMonth.toUpperCase());
      $card.find(".ex-event-day").text(selectedDay);
      $card.find(".ex-event-title").text("No events on this day");
      $card.find(".ex-event-time-text").text("");
      $card.find(".ex-event-location-text").text("");

      // Hide the time and location sections when no events
      $card.find(".ex-event-time").hide();
      $card.find(".ex-event-location").hide();

      $display.attr(
        "aria-label",
        `No events on ${selectedMonth} ${selectedDay}`
      );
      $card.show();
    }

    updateMonthYear() {
      const monthYear = new Date(
        this.currentYear,
        this.currentMonth
      ).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      this.container.find(".ex-calendar-month-year").text(monthYear);
    }

    isSameDate(date1, date2) {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    }

    formatTime(timeString) {
      if (!timeString) return "";
      // Convert 24-hour format to 12-hour format with am/pm (no space)
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "pm" : "am";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes}${ampm}`;
    }
  }

  // Initialize calendar when DOM is ready
  $(document).ready(function () {
    $(".ex-calendar-container").each(function () {
      new EXCalendar($(this));
    });
  });
})(jQuery);
