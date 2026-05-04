/**
 * GeoGuessr Game Module
 * Interactive location guessing game for the Wanderings page
 */

(function() {
  'use strict';

  let map = null;
  let marker = null;
  let currentTrip = null;
  let resultLine = null;

  // ==========================================================================
  // Haversine Distance Calculation
  // ==========================================================================

  /**
   * Calculate distance between two points using Haversine formula
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lng1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lng2 - Longitude of point 2
   * @returns {number} Distance in miles
   */
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // ==========================================================================
  // Game State Management
  // ==========================================================================

  /**
   * Open the game overlay for a specific trip
   * @param {Object} trip - Trip data object
   */
  function openGame(trip) {
    currentTrip = trip;

    const overlay = document.getElementById('geoguessr-overlay');
    const image = document.getElementById('geoguessr-image');
    const submitBtn = document.getElementById('geoguessr-submit');
    const resultSection = document.getElementById('geoguessr-result');
    const tripContent = document.getElementById('trip-content');

    // Reset state
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    if (resultLine) {
      map.removeLayer(resultLine);
      resultLine = null;
    }
    submitBtn.disabled = true;
    submitBtn.classList.remove('hidden');
    resultSection.classList.add('hidden');
    tripContent.classList.add('hidden');

    // Set image
    image.src = trip.main_image;
    image.alt = 'Mystery travel photo - guess the location!';

    // Show overlay
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Initialize or reset map
    setTimeout(() => {
      initMap();
    }, 100);
  }

  /**
   * Close the game overlay
   */
  function closeGame() {
    const overlay = document.getElementById('geoguessr-overlay');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    currentTrip = null;

    // Clean up map
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }
    if (resultLine) {
      map.removeLayer(resultLine);
      resultLine = null;
    }
  }

  // ==========================================================================
  // Map Initialization & Interaction
  // ==========================================================================

  /**
   * Initialize Leaflet map
   */
  function initMap() {
    const mapContainer = document.getElementById('geoguessr-map');

    if (!mapContainer) return;

    // If map already exists, just reset the view
    if (map) {
      map.setView([20, 0], 2);
      map.invalidateSize();
      return;
    }

    // Create map
    map = L.map('geoguessr-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
      worldCopyJump: true
    });

    // Add tile layer (OpenStreetMap - free and sustainable)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Handle map clicks
    map.on('click', handleMapClick);
  }

  /**
   * Handle map click - place or move marker
   * @param {Object} e - Leaflet click event
   */
  function handleMapClick(e) {
    const { lat, lng } = e.latlng;

    // Remove existing marker
    if (marker) {
      map.removeLayer(marker);
    }

    // Create custom marker icon
    const guessIcon = L.divIcon({
      className: 'guess-marker',
      html: '<div class="guess-marker__pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    // Add new marker
    marker = L.marker([lat, lng], { icon: guessIcon }).addTo(map);

    // Enable submit button
    const submitBtn = document.getElementById('geoguessr-submit');
    submitBtn.disabled = false;
  }

  // ==========================================================================
  // Game Logic
  // ==========================================================================

  /**
   * Submit the guess and reveal results
   */
  function submitGuess() {
    if (!marker || !currentTrip) return;

    const guessLat = marker.getLatLng().lat;
    const guessLng = marker.getLatLng().lng;
    const actualLat = currentTrip.location.lat;
    const actualLng = currentTrip.location.lng;

    // Calculate distance
    const distance = calculateDistance(guessLat, guessLng, actualLat, actualLng);

    // Show result
    showResult(distance, actualLat, actualLng);
  }

  /**
   * Display the result of the guess
   * @param {number} distance - Distance in miles
   * @param {number} actualLat - Actual latitude
   * @param {number} actualLng - Actual longitude
   */
  function showResult(distance, actualLat, actualLng) {
    const submitBtn = document.getElementById('geoguessr-submit');
    const resultSection = document.getElementById('geoguessr-result');
    const resultMessage = document.getElementById('result-message');
    const resultDistance = document.getElementById('result-distance');
    const resultLocation = document.getElementById('result-location');

    // Hide submit button
    submitBtn.classList.add('hidden');

    // Add actual location marker
    const actualIcon = L.divIcon({
      className: 'actual-marker',
      html: '<div class="actual-marker__pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    L.marker([actualLat, actualLng], { icon: actualIcon }).addTo(map);

    // Draw line between guess and actual
    const guessLatLng = marker.getLatLng();
    resultLine = L.polyline(
      [[guessLatLng.lat, guessLatLng.lng], [actualLat, actualLng]],
      {
        color: '#58a6ff',
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.8
      }
    ).addTo(map);

    // Fit map to show both points
    const bounds = L.latLngBounds([
      [guessLatLng.lat, guessLatLng.lng],
      [actualLat, actualLng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Set result content
    const roundedDistance = Math.round(distance);
    const isSuccess = distance <= 100;

    if (isSuccess) {
      resultMessage.textContent = 'Excellent guess!';
      resultMessage.className = 'result-message result-message--success';
      // Simple success celebration (no heavy confetti library)
      celebrateSuccess();
    } else {
      resultMessage.textContent = 'Not quite!';
      resultMessage.className = 'result-message result-message--miss';
    }

    resultDistance.textContent = `You were ${roundedDistance.toLocaleString()} miles away`;
    resultLocation.textContent = currentTrip.location.name;

    // Show result section
    resultSection.classList.remove('hidden');
  }

  /**
   * Simple success celebration animation
   */
  function celebrateSuccess() {
    const overlay = document.getElementById('geoguessr-overlay');
    overlay.classList.add('celebrate');

    setTimeout(() => {
      overlay.classList.remove('celebrate');
    }, 1500);
  }

  /**
   * Reveal full trip content
   */
  function revealTripContent() {
    const tripContent = document.getElementById('trip-content');
    const tripTitle = document.getElementById('trip-title');
    const tripDate = document.getElementById('trip-date');
    const tripDescription = document.getElementById('trip-description');
    const tripHighlight = document.getElementById('trip-highlight');
    const tripGallery = document.getElementById('trip-gallery');

    if (!currentTrip) return;

    // Set content
    tripTitle.textContent = currentTrip.title;
    tripDate.textContent = currentTrip.date;
    tripDescription.textContent = currentTrip.description;
    tripHighlight.textContent = currentTrip.highlight;

    // Build gallery
    tripGallery.innerHTML = '';
    if (currentTrip.gallery && currentTrip.gallery.length > 0) {
      currentTrip.gallery.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${currentTrip.title} - Photo ${index + 1}`;
        img.className = 'trip-gallery__image';
        img.loading = 'lazy';
        tripGallery.appendChild(img);
      });
    }

    // Show content
    tripContent.classList.remove('hidden');

    // Scroll to content
    tripContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==========================================================================
  // Card Click Handlers
  // ==========================================================================

  /**
   * Initialize trip cards with click handlers
   */
  function initTripCards() {
    const tripCards = document.querySelectorAll('.trip-card');

    tripCards.forEach(card => {
      card.addEventListener('click', async () => {
        const tripId = card.dataset.tripId;

        // Load trip data
        const data = await window.loadJSON('/data/travels.json');
        if (!data || !data.trips) return;

        const trip = data.trips.find(t => t.id === tripId);
        if (trip) {
          openGame(trip);
        }
      });
    });
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  function initEventListeners() {
    // Close button
    const closeBtn = document.getElementById('geoguessr-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeGame);
    }

    // Submit button
    const submitBtn = document.getElementById('geoguessr-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', submitGuess);
    }

    // See story button
    const storyBtn = document.getElementById('see-story-btn');
    if (storyBtn) {
      storyBtn.addEventListener('click', revealTripContent);
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeGame();
      }
    });

    // Close on backdrop click
    const overlay = document.getElementById('geoguessr-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeGame();
        }
      });
    }
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    // Check if we're on the wanderings page
    if (!document.getElementById('geoguessr-overlay')) return;

    initTripCards();
    initEventListeners();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose functions globally for potential external use
  window.geoGuessr = {
    open: openGame,
    close: closeGame
  };
})();
