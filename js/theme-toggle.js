/**
 * Theme Toggle Module
 * Handles dark/light mode switching with localStorage persistence
 * and system preference detection
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
  };

  /**
   * Get the user's preferred theme
   * Priority: localStorage > dark (default)
   *
   * Note: We intentionally don't auto-apply the OS color scheme preference.
   * The site defaults to dark mode for everyone (a small but real energy
   * savings on OLED screens, plus aesthetic intent), and remembers the
   * user's choice if they toggle to light mode.
   */
  function getPreferredTheme() {
    // Check localStorage first
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
      return storedTheme;
    }

    // Default to dark for everyone
    return THEMES.DARK;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === THEMES.DARK ? '#0d1117' : '#f6f8fa');
    }

    // Update toggle button aria-label
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      const label = theme === THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode';
      toggleButton.setAttribute('aria-label', label);
    }
  }

  /**
   * Save theme preference to localStorage
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage might be unavailable in private mode
      console.warn('Could not save theme preference:', e);
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEMES.DARK;
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  /**
   * Initialize theme system
   */
  function init() {
    // Apply preferred theme immediately (before DOM is ready to prevent flash)
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);

    // Set up toggle button once DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupToggleButton);
    } else {
      setupToggleButton();
    }
  }

  /**
   * Set up the toggle button click handler
   */
  function setupToggleButton() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
  }

  // Expose toggle function globally for inline onclick handlers if needed
  window.toggleTheme = toggleTheme;

  // Initialize immediately
  init();
})();
