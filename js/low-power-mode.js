/**
 * Low Power Mode Module
 * Automatically detects low battery and reduces resource usage
 */

(function() {
  'use strict';

  const LOW_BATTERY_THRESHOLD = 0.20; // 20%
  let isLowPowerMode = false;

  /**
   * Enable low power mode
   */
  function enableLowPowerMode() {
    if (isLowPowerMode) return;

    isLowPowerMode = true;
    document.body.classList.add('low-power-mode');

    // Show indicator
    const indicator = document.querySelector('.low-power-indicator');
    if (indicator) {
      indicator.classList.add('low-power-indicator--active');
    }

    // Pause any running animations
    pauseAnimations();

    // Disable lazy loading of non-essential images
    disableNonEssentialImages();

    console.log('Low power mode enabled');
  }

  /**
   * Disable low power mode
   */
  function disableLowPowerMode() {
    if (!isLowPowerMode) return;

    isLowPowerMode = false;
    document.body.classList.remove('low-power-mode');

    // Hide indicator
    const indicator = document.querySelector('.low-power-indicator');
    if (indicator) {
      indicator.classList.remove('low-power-indicator--active');
    }

    // Resume animations
    resumeAnimations();

    // Re-enable lazy loading
    enableNonEssentialImages();

    console.log('Low power mode disabled');
  }

  /**
   * Pause CSS animations
   */
  function pauseAnimations() {
    const style = document.createElement('style');
    style.id = 'low-power-animations';
    style.textContent = `
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Resume CSS animations
   */
  function resumeAnimations() {
    const style = document.getElementById('low-power-animations');
    if (style) {
      style.remove();
    }
  }

  /**
   * Disable loading of non-essential images
   */
  function disableNonEssentialImages() {
    const nonEssentialImages = document.querySelectorAll('img[data-non-essential="true"]');
    nonEssentialImages.forEach(img => {
      img.dataset.lowPowerSrc = img.src;
      img.src = '';
      img.style.display = 'none';
    });
  }

  /**
   * Re-enable non-essential images
   */
  function enableNonEssentialImages() {
    const nonEssentialImages = document.querySelectorAll('img[data-non-essential="true"]');
    nonEssentialImages.forEach(img => {
      if (img.dataset.lowPowerSrc) {
        img.src = img.dataset.lowPowerSrc;
        img.style.display = '';
        delete img.dataset.lowPowerSrc;
      }
    });
  }

  /**
   * Check battery status and update mode accordingly
   */
  function checkBattery(battery) {
    const isLowBattery = battery.level <= LOW_BATTERY_THRESHOLD && !battery.charging;

    if (isLowBattery && !isLowPowerMode) {
      enableLowPowerMode();
    } else if (!isLowBattery && isLowPowerMode) {
      disableLowPowerMode();
    }
  }

  /**
   * Initialize battery monitoring
   */
  async function init() {
    // Check if Battery API is available
    if (!('getBattery' in navigator)) {
      console.log('Battery API not supported');
      return;
    }

    try {
      const battery = await navigator.getBattery();

      // Initial check
      checkBattery(battery);

      // Listen for battery changes
      battery.addEventListener('levelchange', () => checkBattery(battery));
      battery.addEventListener('chargingchange', () => checkBattery(battery));
    } catch (error) {
      console.warn('Could not access battery status:', error);
    }
  }

  /**
   * Check if currently in low power mode
   */
  function isInLowPowerMode() {
    return isLowPowerMode;
  }

  /**
   * Manually toggle low power mode (for testing or user preference)
   */
  function toggleLowPowerMode() {
    if (isLowPowerMode) {
      disableLowPowerMode();
    } else {
      enableLowPowerMode();
    }
  }

  // Expose functions globally
  window.lowPowerMode = {
    isEnabled: isInLowPowerMode,
    enable: enableLowPowerMode,
    disable: disableLowPowerMode,
    toggle: toggleLowPowerMode
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
