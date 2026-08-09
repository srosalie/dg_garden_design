/**
 * Gallery lightbox module.
 *
 * Wires up the portfolio gallery grid to a full-screen lightbox viewer.
 * Clicking a gallery item opens the lightbox with the full-resolution image.
 * Supports keyboard navigation (arrows + Escape), backdrop click to close,
 * and focus management for accessibility (saves and restores focus).
 */
(function () {
  'use strict';

  /* Keyboard codes for lightbox navigation */
  var KEYCODE_ESCAPE = 27;
  var KEYCODE_ARROW_LEFT = 37;
  var KEYCODE_ARROW_RIGHT = 39;

  var gallery = document.getElementById('gallery');
  var lightbox = document.getElementById('lightbox');

  /* Guard clause — bail early if this page has no gallery or lightbox markup */
  if (!gallery || !lightbox) {
    return;
  }

  var lightboxImage = document.getElementById('lightbox-image');
  var closeButton = document.getElementById('lightbox-close');
  var prevButton = document.getElementById('lightbox-prev');
  var nextButton = document.getElementById('lightbox-next');

  /* Convert NodeList to array for easier indexing */
  var galleryItems = Array.prototype.slice.call(
    gallery.querySelectorAll('.gallery__item')
  );
  var currentIndex = 0;

  /* Saved focus target so we can restore it when the lightbox closes */
  var lastFocusedElement = null;

  /**
   * Displays the image at the given index in the lightbox.
   * Wraps around so navigation past either end loops to the other side.
   */
  function showImage(index) {
    if (galleryItems.length === 0) {
      return;
    }

    /* Modulo wrap — handles negative indices from showPreviousImage */
    var wrappedIndex = (index + galleryItems.length) % galleryItems.length;
    currentIndex = wrappedIndex;

    var item = galleryItems[wrappedIndex];
    lightboxImage.src = item.getAttribute('data-full');

    /* Use the thumbnail's alt text for the lightbox image description */
    var thumbnailImage = item.querySelector('.gallery__image');
    lightboxImage.alt = thumbnailImage ? thumbnailImage.getAttribute('alt') : '';
  }

  /**
   * Opens the lightbox at the given index.
   * Saves the currently focused element so it can be restored on close.
   */
  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    showImage(index);
    lightbox.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden'; /* Prevent background scroll */
    closeButton.focus();
  }

  /**
   * Closes the lightbox and restores focus to the element that opened it.
   */
  function closeLightbox() {
    lightbox.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function showNextImage() {
    showImage(currentIndex + 1);
  }

  function showPreviousImage() {
    showImage(currentIndex - 1);
  }

  /* Keyboard handler — only active while the lightbox is open */
  function handleKeydown(event) {
    if (lightbox.getAttribute('data-open') !== 'true') {
      return;
    }
    if (event.keyCode === KEYCODE_ESCAPE) {
      closeLightbox();
    } else if (event.keyCode === KEYCODE_ARROW_LEFT) {
      showPreviousImage();
    } else if (event.keyCode === KEYCODE_ARROW_RIGHT) {
      showNextImage();
    }
  }

  /* Close when the user clicks the backdrop (not the dialog content) */
  function handleBackdropClick(event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  }

  /* Wire up each gallery item to open the lightbox at its index */
  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
  }
  if (prevButton) {
    prevButton.addEventListener('click', showPreviousImage);
  }
  if (nextButton) {
    nextButton.addEventListener('click', showNextImage);
  }

  lightbox.addEventListener('click', handleBackdropClick);
  document.addEventListener('keydown', handleKeydown);
})();
