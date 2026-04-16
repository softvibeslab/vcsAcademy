/**
 * ═══════════════════════════════════════════════════════════════
 * Utility Functions Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Tests for utility functions and helpers
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

// Email validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password strength calculator
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

// Format date utilities
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

// String utilities
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Number utilities
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value, decimals = 0) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Array utilities
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object utilities
export const omit = (obj, keys) => {
  const newObj = { ...obj };
  keys.forEach(key => delete newObj[key]);
  return newObj;
};

export const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

// Validation utilities
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const isPositiveNumber = (value) => {
  return typeof value === 'number' && value > 0;
};

export const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

describe('Utility Functions', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('Password Strength Calculator', () => {
    it('should calculate weak password', () => {
      const result = calculatePasswordStrength('weak');

      expect(result.score).toBeLessThanOrEqual(2);
      expect(result.strength).toBe('weak');
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should calculate strong password', () => {
      const result = calculatePasswordStrength('Str0ng!Pass@word');

      expect(result.score).toBe(5);
      expect(result.strength).toBe('strong');
      expect(result.feedback.length).toBe(0);
    });

    it('should handle empty password', () => {
      const result = calculatePasswordStrength('');

      expect(result.score).toBe(0);
      expect(result.strength).toBe('weak');
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should give appropriate feedback', () => {
      const result = calculatePasswordStrength('short');

      expect(result.feedback).toContain('At least 8 characters');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-04-16');
      const formatted = formatDate(date);

      expect(formatted).toContain('April');
      expect(formatted).toContain('16');
      expect(formatted).toContain('2026');
    });

    it('should format relative time for minutes', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 5);

      const formatted = formatRelativeTime(date);

      expect(formatted).toBe('5 minutes ago');
    });

    it('should format relative time for hours', () => {
      const date = new Date();
      date.setHours(date.getHours() - 3);

      const formatted = formatRelativeTime(date);

      expect(formatted).toBe('3 hours ago');
    });

    it('should format relative time for days', () => {
      const date = new Date();
      date.setDate(date.getDate() - 2);

      const formatted = formatRelativeTime(date);

      expect(formatted).toBe('2 days ago');
    });

    it('should handle just now', () => {
      const date = new Date();

      const formatted = formatRelativeTime(date);

      expect(formatted).toBe('just now');
    });
  });

  describe('String Utilities', () => {
    it('should truncate long text', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Hi', 10)).toBe('Hi');
    });

    it('should slugify text', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test   Multiple   Spaces')).toBe('test-multiple-spaces');
      expect(slugify('Special@#$Characters')).toBe('specialcharacters');
    });

    it('should handle empty strings', () => {
      expect(truncateText('', 5)).toBe('');
      expect(slugify('')).toBe('');
    });
  });

  describe('Number Utilities', () => {
    it('should format numbers', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should format currency', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(99.99)).toBe('$99.99');
    });

    it('should format percentage', () => {
      expect(formatPercentage(0.5)).toBe('50%');
      expect(formatPercentage(0.75, 1)).toBe('75.0%');
      expect(formatPercentage(1)).toBe('100%');
    });
  });

  describe('Array Utilities', () => {
    it('should shuffle array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(array);

      expect(shuffled).toHaveLength(5);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(5);
      // Order should be different (most likely)
      expect(shuffled).not.toEqual(array);
    });

    it('should chunk array', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const chunks = chunkArray(array, 3);

      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toEqual([1, 2, 3]);
      expect(chunks[1]).toEqual([4, 5, 6]);
      expect(chunks[2]).toEqual([7, 8, 9]);
    });

    it('should handle empty array', () => {
      expect(shuffleArray([])).toEqual([]);
      expect(chunkArray([], 3)).toEqual([]);
    });
  });

  describe('Object Utilities', () => {
    it('should omit keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b', 'c']);

      expect(result).toEqual({ a: 1 });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('c');
    });

    it('should pick keys from object', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(result).not.toHaveProperty('b');
      expect(result).not.toHaveProperty('d');
    });

    it('should handle empty object', () => {
      expect(omit({}, ['a', 'b'])).toEqual({});
      expect(pick({}, ['a', 'b'])).toEqual({});
    });
  });

  describe('Validation Utilities', () => {
    it('should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.com')).toBe(true);
      expect(isValidUrl('ftp://files.com')).toBe(true);
      expect(isValidUrl('invalid-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should check for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100)).toBe(true);
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber(1.5)).toBe(true);
      expect(isPositiveNumber(null)).toBe(false);
    });

    it('should check for non-empty strings', () => {
      expect(isNonEmptyString('test')).toBe(true);
      expect(isNonEmptyString('  test  ')).toBe(true);
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });
});

describe('Performance Tests', () => {
  it('should format large numbers quickly', () => {
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      formatNumber(i * 1000);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100); // Should be fast
  });

  it('should validate emails quickly', () => {
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
      validateEmail('test@example.com');
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });

  it('should calculate password strength quickly', () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      calculatePasswordStrength('TestPassword123!');
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});
