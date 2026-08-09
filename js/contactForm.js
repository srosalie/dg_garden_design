/**
 * Contact form validation and submission module.
 *
 * Handles client-side validation for the contact form on the Contact page.
 * On valid submit, sends the form data to FormSubmit.co via AJAX (fetch),
 * which forwards the submission to the business email without requiring a
 * backend server. Displays inline success/error status messages.
 */
(function () {
  'use strict';

  /* Email pattern — basic shape check (local@domain.tld).
     Not RFC-exhaustive but catches common typos. */
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Form fields that require non-empty values */
  var REQUIRED_TEXT_FIELDS = ['first-name', 'last-name', 'message'];

  var form = document.getElementById('contact-form');

  /* Guard clause — bail early if this page has no contact form */
  if (!form) {
    return;
  }

  var statusMessage = document.getElementById('form-status');
  var submitButton = form.querySelector('button[type="submit"]');

  function getFieldByName(fieldName) {
    return form.querySelector('[name="' + fieldName + '"]');
  }

  function markFieldInvalid(fieldName) {
    var field = getFieldByName(fieldName);
    if (!field) {
      return;
    }
    field.closest('.form__field').setAttribute('data-invalid', 'true');
  }

  function clearFieldError(fieldName) {
    var field = getFieldByName(fieldName);
    if (!field) {
      return;
    }
    field.closest('.form__field').removeAttribute('data-invalid');
  }

  function clearAllErrors() {
    var invalidFields = form.querySelectorAll('.form__field[data-invalid="true"]');
    invalidFields.forEach(function (field) {
      field.removeAttribute('data-invalid');
    });
  }

  function isEmailValid(email) {
    return EMAIL_PATTERN.test(email);
  }

  function isFieldEmpty(value) {
    return value.trim().length === 0;
  }

  /**
   * Validates all required fields. Returns true if the form is valid.
   * Marks invalid fields with data-invalid so CSS can show error messages.
   */
  function validateForm() {
    var isValid = true;

    /* Validate required text fields (first name, last name, message) */
    REQUIRED_TEXT_FIELDS.forEach(function (fieldName) {
      var fieldValue = getFieldByName(fieldName).value;
      if (isFieldEmpty(fieldValue)) {
        markFieldInvalid(fieldName);
        isValid = false;
      }
    });

    /* Validate email — must be non-empty AND match the pattern */
    var email = getFieldByName('email').value;
    if (isFieldEmpty(email) || !isEmailValid(email)) {
      markFieldInvalid('email');
      isValid = false;
    }

    return isValid;
  }

  function showStatus(state, message) {
    statusMessage.setAttribute('data-state', state);
    statusMessage.textContent = message;
  }

  function disableSubmit(isDisabled) {
    submitButton.disabled = isDisabled;
    submitButton.textContent = isDisabled ? 'Sending\u2026' : 'Send message';
  }

  /**
   * Builds the FormData payload from the form.
   * Hidden FormSubmit fields (_subject, _captcha, _template) are already
   * in the HTML, so FormData picks them up automatically.
   */
  function buildFormData() {
    return new FormData(form);
  }

  /**
   * Submits the form to FormSubmit.co via AJAX.
   * FormSubmit responds with JSON when the Accept header is set.
   */
  async function submitForm() {
    var response = await fetch(form.action, {
      method: 'POST',
      body: buildFormData(),
      headers: { Accept: 'application/json' }
    });

    if (response.ok) {
      showStatus('success', 'Thank you! Your message has been sent. We\u2019ll be in touch soon.');
      form.reset();
    } else {
      showStatus('error', 'Something went wrong. Please email us directly at dirtgirlsdesigns@gmail.com.');
    }
  }

  /**
   * Submit handler — validates, then submits via AJAX.
   * Prevents default form submission so the page does not navigate away.
   */
  async function handleSubmit(event) {
    event.preventDefault();
    clearAllErrors();

    if (!validateForm()) {
      showStatus('error', 'Please correct the highlighted fields and try again.');
      return;
    }

    disableSubmit(true);
    try {
      await submitForm();
    } catch (networkError) {
      showStatus('error', 'Could not reach the server. Please email us at dirtgirlsdesigns@gmail.com.');
    } finally {
      disableSubmit(false);
    }
  }

  /* Clear individual field errors as the user corrects them */
  REQUIRED_TEXT_FIELDS.concat(['email']).forEach(function (fieldName) {
    var field = getFieldByName(fieldName);
    if (field) {
      field.addEventListener('input', function () {
        clearFieldError(fieldName);
      });
    }
  });

  form.addEventListener('submit', handleSubmit);
})();
