/**
 * Mobile navigation drawer module.
 *
 * Manages the hamburger menu toggle for mobile viewports. On screens below
 * the mobile breakpoint (768px), the nav list collapses into a slide-down
 * drawer. This module handles:
 *   - Toggle on hamburger button click
 *   - Auto-close when a nav link is tapped (mobile only)
 *   - Auto-close when clicking outside the nav
 *   - Escape key to close and return focus to the toggle
 *   - Auto-close when resizing up to desktop
 */
(function () {
  'use strict';

  /* Viewport width below which the mobile drawer is active.
     Must match the CSS @media (max-width: 767px) breakpoint. */
  var MOBILE_BREAKPOINT_PX = 768;

  var navToggle = document.querySelector('.nav-toggle');
  var navList = document.getElementById('primary-nav');

  /* Guard clause — bail early if this page has no nav toggle */
  if (!navToggle || !navList) {
    return;
  }

  function isMobileViewport() {
    return window.innerWidth < MOBILE_BREAKPOINT_PX;
  }

  /**
   * Sets the open/closed state by updating ARIA and data attributes.
   * CSS reads [data-open] and [aria-expanded] to show/hide the drawer.
   */
  function setMenuOpen(isOpen) {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navList.setAttribute('data-open', String(isOpen));
  }

  function toggleMenu() {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  /* Hamburger button toggles the drawer */
  navToggle.addEventListener('click', toggleMenu);

  /* Close the drawer when a nav link is clicked on mobile.
     On desktop the links are always visible, so no auto-close needed. */
  navList.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && isMobileViewport()) {
      closeMenu();
    }
  });

  /* Close when clicking anywhere outside the nav drawer */
  document.addEventListener('click', function (event) {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) {
      return;
    }
    var clickedInsideNav = navList.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav) {
      closeMenu();
    }
  });

  /* Escape key closes the drawer and returns focus to the toggle button */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Close the drawer if the user resizes up to desktop.
     Prevents a stale open state when the layout switches. */
  window.addEventListener('resize', function () {
    if (!isMobileViewport()) {
      closeMenu();
    }
  });
})();
