/**
 * ═══════════════════════════════════════════════════════════════
 * VCSA Jest Configuration
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive Jest configuration for VCSA frontend testing
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

module.exports = {
  // ═══════════════════════════════════════════════════════════════
  // TEST ENVIRONMENT
  // ═══════════════════════════════════════════════════════════════

  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // ═══════════════════════════════════════════════════════════════
  // COVERAGE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/main.{js,jsx}',
    '!src/reportWebVitals.{js,jsx}',
    '!src/test-utils/**',
    '!src/__tests__/**',
  ],

  // Coverage thresholds (improved from 50% to 70%)
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',

  // ═══════════════════════════════════════════════════════════════
  // TEST MATCH PATTERNS
  // ═══════════════════════════════════════════════════════════════

  // Test files
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/',
  ],

  // ═══════════════════════════════════════════════════════════════
  // MODULE NAME MAPPING
  // ═══════════════════════════════════════════════════════════════

  moduleNameMapper: {
    // Handle CSS modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Handle image imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',

    // Handle absolute imports
    '^@/(.*)$': '<rootDir>/src/$1',

    // Handle environment variables
    '^process$': 'process/browser',
  },

  // ═══════════════════════════════════════════════════════════════
  // TRANSFORM CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  // Maximum number of workers
  maxWorkers: '50%',

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout (ms)
  testTimeout: 10000,

  // ═══════════════════════════════════════════════════════════════
  // IGNORE PATTERNS
  // ═══════════════════════════════════════════════════════════════

  ignorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/',
    '/dist/',
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],
};
