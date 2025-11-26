// Footer Component JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const footerForm = document.querySelector('.footer__form');
  const emailInput = document.querySelector('.footer__input');
  const submitButton = document.querySelector('.footer__submit');

  // Add focus and blur event listeners for input styling
  emailInput?.addEventListener('focus', () => {
    emailInput.parentElement?.classList.add('footer__form-group--focused');
  });

  emailInput?.addEventListener('blur', () => {
    emailInput.parentElement?.classList.remove('footer__form-group--focused');
  });

  // Handle form submission
  footerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic email validation
    const email = emailInput?.value;
    if (!email || !isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      // Disable form while submitting
      setFormState(false);

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showSuccess('Thank you for subscribing!');
        footerForm.reset();
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      showError('Failed to subscribe. Please try again later.');
    } finally {
      setFormState(true);
    }
  });

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show error message with proper ARIA attributes
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'footer__form-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    const existingError = footerForm?.querySelector('.footer__form-error');
    if (existingError) {
      existingError.remove();
    }

    footerForm?.appendChild(errorDiv);
    emailInput?.setAttribute('aria-invalid', 'true');
    emailInput?.setAttribute('aria-describedby', 'footer-error');
  }

  // Show success message with proper ARIA attributes
  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'footer__form-success';
    successDiv.setAttribute('role', 'status');
    successDiv.textContent = message;

    const existingMessage = footerForm?.querySelector('.footer__form-success, .footer__form-error');
    if (existingMessage) {
      existingMessage.remove();
    }

    footerForm?.appendChild(successDiv);
    emailInput?.removeAttribute('aria-invalid');
    emailInput?.removeAttribute('aria-describedby');
  }

  // Enable/disable form elements during submission
  function setFormState(enabled) {
    if (emailInput && submitButton) {
      emailInput.disabled = !enabled;
      submitButton.disabled = !enabled;

      if (!enabled) {
        submitButton.innerHTML = `
          <span class="footer__submit-text">Subscribing...</span>
          <span class="footer__submit-spinner" aria-hidden="true"></span>
        `;
      } else {
        submitButton.innerHTML = `
          Subscribe
          <img src="../assets/images/footer/arrow-right.svg" alt="" class="footer__submit-arrow ms-2" aria-hidden="true">
        `;
      }
    }
  }

  // Add keyboard navigation for social media links
  const socialLinks = document.querySelectorAll('.footer__social-link');
  socialLinks.forEach(link => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
});
