/**
 * validation.js - Form validation logic
 * Contains general rules, inputs checks, error render hooks and validation events triggers.
 */

const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[0-9]{10}$/
};

/**
 * Validate email string format
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

/**
 * Validate phone number format (10 digits)
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return VALIDATION_PATTERNS.PHONE.test(phone.replace(/[\s-()]/g, ''));
}

/**
 * Display form input error message
 * @param {HTMLElement} inputElement 
 * @param {string} message 
 */
function showInputError(inputElement, message) {
  if (!inputElement) return;
  inputElement.classList.add('invalid');
  
  // Find or create error element
  let errorEl = inputElement.parentElement.querySelector('.form-error-msg');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error-msg';
    inputElement.parentElement.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

/**
 * Clear form input error state
 * @param {HTMLElement} inputElement 
 */
function clearInputError(inputElement) {
  if (!inputElement) return;
  inputElement.classList.remove('invalid');
  const errorEl = inputElement.parentElement.querySelector('.form-error-msg');
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }
}

/**
 * Attach live-validation change triggers to form inputs
 * @param {HTMLFormElement} formElement 
 */
function initLiveValidation(formElement) {
  if (!formElement) return;
  
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Clear on input changes
    input.addEventListener('input', () => {
      clearInputError(input);
    });
    
    input.addEventListener('blur', () => {
      // Basic checks on blur
      if (input.hasAttribute('required') && !input.value.trim()) {
        showInputError(input, `${input.previousElementSibling ? input.previousElementSibling.textContent.replace('*', '').trim() : 'This field'} is required`);
      } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value.trim())) {
        showInputError(input, 'Please enter a valid email address');
      } else if (input.id === 'mobile' && input.value.trim() && !isValidPhone(input.value.trim())) {
        showInputError(input, 'Please enter a valid 10-digit mobile number');
      }
    });
  });
}

/**
 * Perform manual validate checks on a form submission
 * @param {HTMLFormElement} formElement 
 * @returns {boolean} True if form validates successfully
 */
function validateFormOnSubmit(formElement) {
  if (!formElement) return false;
  
  let isValid = true;
  const inputs = formElement.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const value = input.value.trim();
    clearInputError(input);
    
    // Required check
    if (input.hasAttribute('required') && !value) {
      const label = input.previousElementSibling ? input.previousElementSibling.textContent.replace('*', '').trim() : '';
      showInputError(input, `${label || 'This field'} is required`);
      isValid = false;
    }
    // Email check
    else if (input.type === 'email' && value && !isValidEmail(value)) {
      showInputError(input, 'Please enter a valid email address');
      isValid = false;
    }
    // Mobile number check
    else if (input.id === 'mobile' && value && !isValidPhone(value)) {
      showInputError(input, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    }
    // Password length check
    else if (input.type === 'password' && input.id === 'password' && value.length < 8) {
      showInputError(input, 'Password must be at least 8 characters long');
      isValid = false;
    }
    // Confirm password matching check
    else if (input.id === 'confirmPassword') {
      const passwordInput = formElement.querySelector('#password');
      if (passwordInput && value !== passwordInput.value) {
        showInputError(input, 'Passwords do not match');
        isValid = false;
      }
    }
  });
  
  return isValid;
}
