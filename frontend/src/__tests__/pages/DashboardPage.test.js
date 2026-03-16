/**
 * DashboardPage Tests
 * Testing main dashboard functionality
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/App';
import DashboardPage from '@/pages/DashboardPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock DashboardLayout
jest.mock('@/components/layout/DashboardLayout', () => ({
  DashboardLayout: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}));

// Mock components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }) => <div data-testid="progress" data-value={value} />,
}));

const mockUser = {
  user_id: '123',
  email: 'test@vcsa.com',
  name: 'Test User',
  points: 100,
  level: 2,
  membership: 'free',
  role: 'member',
};

const mockDashboardData = {
  progress: {
    completed_lessons: 5,
    total_lessons: 36,
  },
  recent_courses: [
    {
      course_id: '1',
      title: 'Pro Mindset',
      category: 'Mindset',
      thumbnail: null,
    },
  ],
  upcoming_events: [
    {
      event_id: '1',
      title: 'Live Training',
      event_type: 'Training',
      start_time: '2026-03-20T14:00:00Z',
    },
  ],
  recent_posts: [
    {
      post_id: '1',
      user_name: 'John Doe',
      user_picture: null,
      content: 'Great training session!',
      likes: [1, 2, 3],
      comments_count: 2,
    },
  ],
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockDashboardData });
  });

  it('should render loading state initially', () => {
    // Mock auth to be in loading state
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<DashboardPage />);

    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render welcome message with user name', async () => {
    const { result } = renderWithProviders(<DashboardPage />);

    // Wait for auth check to complete
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });

  it('should display user stats', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Current Level')).toBeInTheDocument();
      expect(screen.getByText('Total Points')).toBeInTheDocument();
      expect(screen.getByText('Lessons Done')).toBeInTheDocument();
      expect(screen.getByText('Membership')).toBeInTheDocument();
    });
  });

  it('should show upgrade button for free users', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      const upgradeButton = screen.getByText(/Upgrade to VIP/i);
      expect(upgradeButton).toBeInTheDocument();
    });
  });

  it('should not show upgrade button for VIP users', async () => {
    const vipUser = { ...mockUser, membership: 'vip' };
    axios.get.mockResolvedValueOnce({ data: vipUser });

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      const upgradeButton = screen.queryByText(/Upgrade to VIP/i);
      expect(upgradeButton).not.toBeInTheDocument();
    });
  });

  it('should display recent courses', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Continue Learning')).toBeInTheDocument();
    });
  });

  it('should display upcoming events', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    });
  });

  it('should display community highlights', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Community Highlights')).toBeInTheDocument();
    });
  });

  it('should fetch dashboard data on mount', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/dashboard'),
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
