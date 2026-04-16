/**
 * ═══════════════════════════════════════════════════════════════
 * VCSA Test Utilities
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive test utilities for VCSA frontend testing
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════
// MOCK PROVIDERS
// ═══════════════════════════════════════════════════════════════

/**
 * Create a test QueryClient with custom configuration
 */
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress error logs in tests
    },
  });
};

/**
 * Mock Auth Provider with custom user state
 */
export const MockAuthProvider = ({ children, user = null }) => {
  const mockAuthValue = {
    user: user || {
      user_id: 'test-user-id',
      email: 'test@vcsa.com',
      first_name: 'Test',
      last_name: 'User',
      membership: 'basic',
      created_at: new Date().toISOString(),
    },
    token: 'mock-token-12345',
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    loading: false,
    isAuthenticated: !!user,
  };

  return (
    <AuthProvider value={mockAuthValue}>
      {children}
    </AuthProvider>
  );
};

// ═══════════════════════════════════════════════════════════════
// CUSTOM RENDER FUNCTION
// ═══════════════════════════════════════════════════════════════

interface AllTheProvidersProps {
  children: React.ReactNode;
  route?: string;
  user?: any;
  queryClient?: QueryClient;
  theme?: 'light' | 'dark';
}

const AllTheProviders = ({ children, route = '/', user, queryClient, theme = 'dark' }: AllTheProvidersProps) => {
  const testQueryClient = queryClient || createTestQueryClient();

  // Mock window.location for routing
  if (route) {
    window.history.pushState({}, 'Test page', route);
  }

  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
        <QueryClientProvider client={testQueryClient}>
          <MockAuthProvider user={user}>
            {children}
          </MockAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

/**
 * Custom render function with all providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    user = null,
    queryClient,
    theme = 'dark',
    ...renderOptions
  }: Omit<AllTheProvidersProps, 'children'> & RenderOptions = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AllTheProviders route={route} user={user} queryClient={queryClient} theme={theme}>
        {children}
      </AllTheProviders>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA FACTORIES
// ═══════════════════════════════════════════════════════════════

/**
 * Generate mock user data
 */
export const createMockUser = (overrides = {}) => ({
  user_id: 'test-user-id',
  email: 'test@vcsa.com',
  first_name: 'Test',
  last_name: 'User',
  membership: 'basic',
  created_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Generate mock progress data
 */
export const createMockProgress = (overrides = {}) => ({
  user_id: 'test-user-id',
  points: 150,
  readiness_score: 65,
  current_stage: 1,
  current_level: 'New Rep',
  streak: 5,
  videos_completed: 15,
  badges_earned: ['first-module', 'week-streak'],
  ...overrides,
});

/**
 * Generate mock stage data
 */
export const createMockStage = (stageId: number, overrides = {}) => ({
  stage_id: stageId,
  name: `Stage ${stageId}`,
  description: `Stage ${stageId} description`,
  points_required: stageId * 150,
  duration_weeks: stageId * 2,
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  ...overrides,
});

/**
 * Generate mock track data
 */
export const createMockTrack = (trackId: string, overrides = {}) => ({
  track_id: trackId,
  title: `Track ${trackId}`,
  description: `Track ${trackId} description`,
  stage_id: 1,
  order: 1,
  modules_count: 6,
  ...overrides,
});

/**
 * Generate mock module data
 */
export const createMockModule = (moduleId: string, overrides = {}) => ({
  content_id: moduleId,
  title: `Module ${moduleId}`,
  description: `Module ${moduleId} description`,
  track_id: 'track-1',
  video_url: 'https://youtube.com/watch?v=test',
  duration: 1800,
  key_move: 'Test key move',
  order: 1,
  ...overrides,
});

/**
 * Generate mock deal breakdown
 */
export const createMockBreakdown = (breakdownId: string, overrides = {}) => ({
  breakdown_id: breakdownId,
  title: `Breakdown ${breakdownId}`,
  scenario: `Test scenario for ${breakdownId}`,
  solution: `Test solution for ${breakdownId}`,
  key_tactics: ['Tactic 1', 'Tactic 2'],
  category: 'objection',
  ...overrides,
});

/**
 * Generate mock quick win
 */
export const createMockQuickWin = (quickWinId: string, overrides = {}) => ({
  quick_win_id: quickWinId,
  title: `Quick Win ${quickWinId}`,
  tactic: `Test tactic for ${quickWinId}`,
  category: 'closing',
  tags: ['before_tour', 'closing_help'],
  ...overrides,
});

// ═══════════════════════════════════════════════════════════════
// API MOCK HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Mock successful API response
 */
export const mockApiSuccess = (data: any) => {
  return jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response);
};

/**
 * Mock failed API response
 */
export const mockApiError = (error: string, status = 400) => {
  return jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error }),
  } as Response);
};

/**
 * Mock network error
 */
export const mockNetworkError = () => {
  return jest.fn().mockRejectedValue(new Error('Network error'));
};

// ═══════════════════════════════════════════════════════════════
// WAIT HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Wait for a specified amount of time
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Wait for element to appear in DOM
 */
export const waitForElement = async (querySelector: string) => {
  return await waitFor(() => {
    const element = document.querySelector(querySelector);
    if (element) return element;
    throw new Error(`Element ${querySelector} not found`);
  });
};

// ═══════════════════════════════════════════════════════════════
// FORM TESTING HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Fill out a form with data
 */
export const fillForm = async (form: HTMLFormElement, data: Record<string, string>) => {
  for (const [name, value] of Object.entries(data)) {
    const input = form.elements[name] as HTMLInputElement;
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
};

/**
 * Submit a form
 */
export const submitForm = async (form: HTMLFormElement) => {
  form.dispatchEvent(new Event('submit', { bubbles: true }));
  await waitFor(() => {
    // Wait for form submission to complete
  });
};

// ═══════════════════════════════════════════════════════════════
* STORAGE MOCKS
// ═══════════════════════════════════════════════════════════════

/**
 * Mock localStorage with custom data
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

/**
 * Setup localStorage mock
 */
export const setupLocalStorageMock = () => {
  const localStorageMock = mockLocalStorage();
  global.localStorage = localStorageMock as any;
  return localStorageMock;
};

// ═══════════════════════════════════════════════════════════════
// ROUTING HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Navigate to a specific route
 */
export const navigateTo = (path: string) => {
  window.history.pushState({}, 'Test page', path);
  window.dispatchEvent(new Event('popstate'));
};

/**
 * Get current route
 */
export const getCurrentRoute = () => {
  return window.location.pathname;
};

// ═══════════════════════════════════════════════════════════════
* EXPORTS
// ═══════════════════════════════════════════════════════════════

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
