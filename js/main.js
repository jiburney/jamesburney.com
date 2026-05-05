/**
 * Main JavaScript Module
 * Core functionality for the James Burney personal website
 */

(function() {
  'use strict';

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================

  function initMobileNav() {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    if (!navToggle || !navList) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('is-open');

      navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', !isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const navLinks = navList.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // Scroll Animations (Intersection Observer)
  // ==========================================================================

  function initScrollAnimations() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Make all elements visible immediately
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optionally unobserve after animation
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // Page Weight Calculator
  // ==========================================================================

  function calculatePageWeight() {
    const pageWeightElement = document.querySelector('.footer__page-weight');
    if (!pageWeightElement) return;

    if (window.performance && window.performance.getEntriesByType) {
      window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];

        let totalBytes = 0;

        // Add the HTML document size
        if (navigation && navigation.decodedBodySize) {
          totalBytes += navigation.decodedBodySize;
        }

        // Add all resources, preferring decodedBodySize so cached resources
        // still report their real size. Fall back to transferSize for
        // cross-origin resources where decodedBodySize may be 0.
        resources.forEach(resource => {
          const size = resource.decodedBodySize || resource.transferSize || 0;
          totalBytes += size;
        });

        const totalKB = (totalBytes / 1024).toFixed(1);
        pageWeightElement.textContent = `This page weighs ~${totalKB} KB`;
      });
    } else {
      pageWeightElement.textContent = 'Page weight: calculating...';
    }
  }

  // ==========================================================================
  // Lazy Loading Images
  // ==========================================================================

  function initLazyLoading() {
    // Use native lazy loading with fallback
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without scrolling
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ==========================================================================
  // Coordinate Easter Egg (Navigation Hover)
  // ==========================================================================

  function initCoordinateEasterEgg() {
    const coordinates = {
      'home': { lat: '38.8816', lng: '-77.0910', name: 'Arlington, VA' },
      'experience': { lat: '37.5407', lng: '-77.4360', name: 'Richmond, VA' },
      'projects': { lat: '37.7749', lng: '-122.4194', name: 'San Francisco, CA' },
      'about': { lat: '35.7796', lng: '-83.9207', name: 'Clingmans Dome, AT' }
    };

    const navLinks = document.querySelectorAll('.nav__link[data-page]');

    navLinks.forEach(link => {
      const page = link.dataset.page;
      if (coordinates[page]) {
        link.setAttribute('title', `${coordinates[page].lat}°N, ${coordinates[page].lng}°W`);
      }
    });
  }

  // ==========================================================================
  // JSON Data Loader Utility
  // ==========================================================================

  async function loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading JSON from ${url}:`, error);
      return null;
    }
  }

  // Expose utility globally
  window.loadJSON = loadJSON;

  // ==========================================================================
  // Service Worker Registration
  // ==========================================================================

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registered:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }

  // ==========================================================================
  // External Link Handler
  // ==========================================================================

  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      // Skip internal links
      if (link.hostname === window.location.hostname) return;

      // Add external link attributes
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      // Add visual indicator (sr-only text)
      if (!link.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = ' (opens in new tab)';
        link.appendChild(srText);
      }
    });
  }

  // ==========================================================================
  // Current Year (Footer)
  // ==========================================================================

  function updateCurrentYear() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ==========================================================================
  // Active Navigation Link
  // ==========================================================================

  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');

    // Normalize a path: strip trailing slash, treat empty as '/'
    const normalize = (path) => path.replace(/\/$/, '') || '/';

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (normalize(currentPath) === normalize(linkPath)) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  // ==========================================================================
  // Website Carbon Badge — sync dark/light class to theme
  // ==========================================================================

  function syncCarbonBadge() {
    const badge = document.getElementById('wcb');
    if (!badge) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    badge.classList.toggle('wcb-d', isDark);
  }

  function initCarbonBadge() {
    // Run once on load
    syncCarbonBadge();
    // Watch for future theme changes via the data-theme attribute
    new MutationObserver(syncCarbonBadge).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ['data-theme'] }
    );
  }

  // ==========================================================================
  // Initialize All Modules
  // ==========================================================================

  function init() {
    initMobileNav();
    initScrollAnimations();
    initLazyLoading();
    initSmoothScroll();
    initCoordinateEasterEgg();
    initExternalLinks();
    updateCurrentYear();
    setActiveNavLink();
    calculatePageWeight();
    registerServiceWorker();
    initCarbonBadge();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
