document.addEventListener('DOMContentLoaded', () => {
  let SHUTTLE_TRACKER_URL = null; // This will be updated when the link is ready
  // Example for testing the active state immediately:
  // SHUTTLE_TRACKER_URL = "https://www.google.com/maps";

  const fabButton = document.getElementById('shuttleTrackerBtn');
  const tooltip = document.getElementById('shuttleTrackerTooltip');
  const srStatus = document.getElementById('shuttleStatusSR');

  // Ensure elements exist before proceeding
  if (!fabButton || !tooltip || !srStatus) {
    console.error('Shuttle Tracker FAB elements not found. Aborting script.');
    return;
  }

  function showTooltip(message) {
    tooltip.textContent = message;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function updateFabState() {
    if (SHUTTLE_TRACKER_URL) {
      fabButton.dataset.status = 'active';
      fabButton.setAttribute('aria-label', 'Track shuttle location (opens in new tab)');
      if (document.body.contains(srStatus)) { // Check if srStatus is still in DOM
        srStatus.textContent = 'Shuttle tracking is now live.';
      }
    } else {
      fabButton.dataset.status = 'inactive';
      fabButton.setAttribute('aria-label', 'Track shuttle location (coming soon)');
       if (document.body.contains(srStatus)) {
        srStatus.textContent = 'Shuttle tracking is not yet available.';
      }
    }
  }

  fabButton.addEventListener('click', (event) => {
    if (fabButton.dataset.status === 'active' && SHUTTLE_TRACKER_URL) {
      window.open(SHUTTLE_TRACKER_URL, '_blank', 'noopener noreferrer');
    } else {
      showTooltip('Tracking not live yet. Check back near event time!');
      if (document.body.contains(srStatus)) {
        srStatus.textContent = 'Shuttle tracking is not yet available. Please check back later.';
      }
      // Keep tooltip visible for a bit longer on click, then hide
      setTimeout(hideTooltip, 3000);
    }
  });

  fabButton.addEventListener('mouseenter', () => {
    if (fabButton.dataset.status === 'active') {
      showTooltip('Track live shuttle location');
    } else {
      showTooltip('Shuttle tracking will be available soon!');
    }
  });

  fabButton.addEventListener('focus', () => {
    if (fabButton.dataset.status === 'active') {
      showTooltip('Track live shuttle location');
    } else {
      showTooltip('Shuttle tracking will be available soon!');
    }
  });

  fabButton.addEventListener('mouseleave', hideTooltip);
  fabButton.addEventListener('blur', hideTooltip);

  // Initial setup
  updateFabState();

  // --- How to update the URL dynamically later ---
  // You would call this function when the URL is known, for example:
  // window.setShuttleUrl = function(url) {
  //   SHUTTLE_TRACKER_URL = url;
  //   updateFabState();
  // };

  // Example: To activate the button after 5 seconds (for testing)
  // setTimeout(() => {
  //   console.log("Simulating URL update...");
  //   SHUTTLE_TRACKER_URL = "https://example.com/shuttle-tracker"; // Replace with your actual URL when ready
  //   updateFabState();
  //   // If you created setShuttleUrl globally:
  //   // window.setShuttleUrl("https://example.com/shuttle-tracker");
  // }, 5000);
}); 