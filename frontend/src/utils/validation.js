/**
 * ═══════════════════════════════════════════════════════════════
 * Validation Utilities
 * ═══════════════════════════════════════════════════════════════
 *
 * Common validation functions
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Password strength calculator
 */
export const calculatePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('One lowercase letter');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('One uppercase letter');

  if (/\d/.test(password)) score += 1;
  else feedback.push('One number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('One special character');

  return {
    score: Math.min(score, 5),
    feedback,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong'
  };
};

/**
 * URL validation
 */
export const validateUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Phone validation
 */
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Username validation
 */
export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

/**
 * File validation
 */
export const validateFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Form field validation
 */
export const validateField = (value, rules) => {
  const errors = [];

  if (rules.required && !value) {
    errors.push('This field is required');
    return { valid: false, errors };
  }

  if (!value) {
    return { valid: true, errors: [] };
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength}`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength}`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.message || 'Invalid format');
  }

  if (rules.email && !validateEmail(value)) {
    errors.push('Invalid email address');
  }

  if (rules.url && !validateUrl(value)) {
    errors.push('Invalid URL');
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.customMessage || 'Validation failed');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Password confirmation validation
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      valid: false,
      errors: ['Passwords do not match']
    };
  }
  return { valid: true, errors: [] };
};

/**
 * Age validation
 */
export const validateAge = (birthDate, minAge = 18) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return {
    valid: age >= minAge,
    age,
    errors: age < minAge ? [`Must be at least ${minAge} years old`] : []
  };
};

/**
 * Required fields validation
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = [];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Complete form validation
 */
export const validateForm = (data, schema) => {
  const errors = {};
  let valid = true;

  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];
    const result = validateField(value, rules);

    if (!result.valid) {
      errors[field] = result.errors;
      valid = false;
    }
  });

  return { valid, errors };
};
