/**
 * Brewery Map Module
 * Easter egg brewery heat map on the Hobbies page
 */

(function() {
  'use strict';

  let breweryMap = null;
  let heatLayer = null;
  let markers = [];

  // ==========================================================================
  // Map Initialization
  // ==========================================================================

  /**
   * Initialize the brewery map
   */
  async function initBreweryMap() {
    const mapContainer = document.getElementById('brewery-map');
    if (!mapContainer || breweryMap) return;

    // Create map centered on US
    breweryMap = L.map('brewery-map', {
      center: [39.8283, -98.5795],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(breweryMap);

    // Load brewery data
    await loadBreweryData();
  }

  /**
   * Load brewery data from JSON and display on map
   */
  async function loadBreweryData() {
    try {
      const data = await window.loadJSON('/data/breweries.json');

      if (!data || !data.breweries) {
        console.warn('No brewery data found');
        return;
      }

      // Update stats
      updateStats(data);

      // Add markers or heat map based on data size
      if (data.breweries.length > 50) {
        addHeatMap(data.breweries);
      } else {
        addMarkers(data.breweries);
      }
    } catch (error) {
      console.error('Error loading brewery data:', error);
    }
  }

  /**
   * Update brewery statistics display
   */
  function updateStats(data) {
    const totalElement = document.getElementById('brewery-total');
    const statesElement = document.getElementById('brewery-states');

    if (totalElement) {
      totalElement.textContent = data.total_count || data.breweries.length;
    }

    if (statesElement) {
      statesElement.textContent = data.states_visited || '—';
    }
  }

  /**
   * Add heat map layer for large datasets
   */
  function addHeatMap(breweries) {
    // Check if Leaflet.heat is available
    if (typeof L.heatLayer === 'undefined') {
      // Fall back to marker clusters or simple markers
      addMarkerClusters(breweries);
      return;
    }

    const heatData = breweries.map(b => [b.lat, b.lng, 0.5]);

    heatLayer = L.heatLayer(heatData, {
      radius: 20,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: '#3fb950',
        0.6: '#58a6ff',
        0.8: '#ffd33d',
        1.0: '#f85149'
      }
    }).addTo(breweryMap);
  }

  /**
   * Add individual markers for smaller datasets
   */
  function addMarkers(breweries) {
    const breweryIcon = L.divIcon({
      className: 'brewery-marker',
      html: '<span class="brewery-marker__icon">🍺</span>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    breweries.forEach(brewery => {
      const marker = L.marker([brewery.lat, brewery.lng], { icon: breweryIcon })
        .bindPopup(`
          <strong>${brewery.name}</strong><br>
          ${brewery.city}, ${brewery.state}<br>
          <small>Visited: ${formatDate(brewery.date_visited)}</small>
        `)
        .addTo(breweryMap);

      markers.push(marker);
    });
  }

  /**
   * Add marker clusters for medium-sized datasets
   */
  function addMarkerClusters(breweries) {
    // If marker cluster plugin is available
    if (typeof L.markerClusterGroup !== 'undefined') {
      const cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="brewery-cluster">${count}</div>`,
            className: 'brewery-cluster-icon',
            iconSize: [40, 40]
          });
        }
      });

      const breweryIcon = L.divIcon({
        className: 'brewery-marker',
        html: '<span class="brewery-marker__icon">🍺</span>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      breweries.forEach(brewery => {
        const marker = L.marker([brewery.lat, brewery.lng], { icon: breweryIcon })
          .bindPopup(`
            <strong>${brewery.name}</strong><br>
            ${brewery.city}, ${brewery.state}
          `);
        cluster.addLayer(marker);
      });

      breweryMap.addLayer(cluster);
    } else {
      // Fall back to simple markers
      addMarkers(breweries);
    }
  }

  /**
   * Format date string
   */
  function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';

    const parts = dateStr.split('-');
    if (parts.length === 2) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    }
    return dateStr;
  }

  // ==========================================================================
  // Overlay Management
  // ==========================================================================

  /**
   * Open the brewery map overlay
   */
  function openBreweryMap() {
    const overlay = document.getElementById('brewery-overlay');
    if (!overlay) return;

    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Initialize map after overlay is visible
    setTimeout(() => {
      initBreweryMap();
      if (breweryMap) {
        breweryMap.invalidateSize();
      }
    }, 100);
  }

  /**
   * Close the brewery map overlay
   */
  function closeBreweryMap() {
    const overlay = document.getElementById('brewery-overlay');
    if (!overlay) return;

    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  function initEventListeners() {
    // Beer emoji trigger (Easter egg)
    const beerTrigger = document.getElementById('beer-trigger');
    if (beerTrigger) {
      beerTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openBreweryMap();
      });
    }

    // Close button
    const closeBtn = document.getElementById('brewery-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeBreweryMap);
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBreweryMap();
      }
    });

    // Close on backdrop click
    const overlay = document.getElementById('brewery-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeBreweryMap();
        }
      });
    }
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    // Check if we're on a page with brewery map
    if (!document.getElementById('brewery-overlay')) return;

    initEventListeners();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose functions globally
  window.breweryMap = {
    open: openBreweryMap,
    close: closeBreweryMap
  };
})();
