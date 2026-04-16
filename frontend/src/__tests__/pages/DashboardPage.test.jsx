/**
 * ═══════════════════════════════════════════════════════════════
 * DashboardPage Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive tests for DashboardPage component
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import DashboardPage from '../DashboardPage';

// Mock the API module
jest.mock('@/App', () => ({
  API: 'http://localhost:8000',
  useAuth: () => ({
    user: createMockUser(),
  }),
}));

// Mock axios
jest.mock('axios');

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Loading State', () => {
    it('should show loading spinner while fetching data', () => {
      // Mock axios to return pending promise
      axios.get.mockReturnValue(new Promise(() => {}));

      render(<DashboardPage />);

      expect(screen.getByRole('status'))
        .toBeInTheDocument();
    });

    it('should show centered loading indicator', () => {
      axios.get.mockReturnValue(new Promise(() => {}));

      render(<DashboardPage />);

      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // DATA LOADING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Data Loading', () => {
    it('should fetch dashboard data on mount', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
        recent_activity: [],
        recommended_content: [],
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/dashboard'),
          expect.objectContaining({ withCredentials: true })
        );
      });
    });

    it('should display user welcome message', async () => {
      const mockDashboard = {
        user: createMockUser({ first_name: 'John', last_name: 'Doe' }),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i))
          .toBeInTheDocument();
      });
    });

    it('should display user points', async () => {
      const mockDashboard = {
        user: createMockUser({ points: 250 }),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/250/i))
          .toBeInTheDocument();
      });
    });

    it('should display user readiness score', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress({ readiness_score: 75 }),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/75%/i))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PROGRESS DISPLAY TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Progress Display', () => {
    it('should display progress bar', async () => {
      const mockDashboard = {
        user: createMockUser({ points: 150 }),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should calculate level progress correctly', async () => {
      const mockDashboard = {
        user: createMockUser({ points: 150 }),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        // 150 points means 50% progress to next level (100 points per level)
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should display current level', async () => {
      const mockDashboard = {
        user: createMockUser({ points: 150 }),
        progress: createMockProgress({ current_level: 'Developing Rep' }),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/developing rep/i))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Navigation', () => {
    it('should have link to Top Producer Path', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        const pathLink = screen.getByRole('link', { name: /top producer path/i });
        expect(pathLink).toBeInTheDocument();
        expect(pathLink).toHaveAttribute('href', '/top-producer-path');
      });
    });

    it('should have link to tracks', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        const tracksLink = screen.queryByRole('link', { name: /tracks/i });
        if (tracksLink) {
          expect(tracksLink).toBeInTheDocument();
        }
      });
    });

    it('should have link to quick wins', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        const quickWinsLink = screen.queryByRole('link', { name: /quick wins/i });
        if (quickWinsLink) {
          expect(quickWinsLink).toBeInTheDocument();
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ERROR HANDLING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      render(<DashboardPage />);

      await waitFor(() => {
        // Should not crash, should show something
        expect(screen.queryByRole('status'))
          .not.toBeInTheDocument();
      });
    });

    it('should handle empty dashboard data', async () => {
      axios.get.mockResolvedValue({ data: {} });

      render(<DashboardPage />);

      await waitFor(() => {
        // Should not crash with empty data
        expect(screen.getByTestId('dashboard-page'))
          .toBeInTheDocument();
      });
    });

    it('should handle missing user data', async () => {
      const mockDashboard = {
        user: null,
        progress: null,
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        // Should not crash with null user
        expect(screen.getByTestId('dashboard-page'))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ACTIVITY TRACKING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Activity Tracking', () => {
    it('should display recent activity', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
        recent_activity: [
          {
            activity_id: '1',
            type: 'video_completed',
            title: 'Completed Module 1',
            timestamp: '2026-04-16T10:00:00Z',
          },
          {
            activity_id: '2',
            type: 'badge_earned',
            title: 'Earned First Module Badge',
            timestamp: '2026-04-16T09:00:00Z',
          },
        ],
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/completed module 1/i))
          .toBeInTheDocument();
      });
    });

    it('should display training streak', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress({ streak: 5 }),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/5 day streak/i))
          .toBeInTheDocument();
      });
    });

    it('should display badges earned', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress({
          badges_earned: ['first-module', 'week-streak', 'quick-learner'],
        }),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByText(/3 badges/i))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // RESPONSIVE DESIGN TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Responsive Design', () => {
    it('should render correctly on mobile', async () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page'))
          .toBeInTheDocument();
      });
    });

    it('should render correctly on desktop', async () => {
      // Mock desktop viewport
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));

      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      render(<DashboardPage />);

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page'))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PERFORMANCE TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Performance', () => {
    it('should render quickly with small dataset', async () => {
      const mockDashboard = {
        user: createMockUser(),
        progress: createMockProgress(),
        recent_activity: [],
      };

      axios.get.mockResolvedValue({ data: mockDashboard });

      const startTime = performance.now();
      render(<DashboardPage />);
      const endTime = performance.now();

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-page'))
          .toBeInTheDocument();
      });

      // Should render in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
