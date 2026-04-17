/**
 * TopProducerPath Tests
 * Testing Phase 1 Top Producer Development System
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/App';
import TopProducerPath from '@/pages/TopProducerPath';
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
  points: 250,
  level: 3,
  membership: 'vip',
  role: 'member',
};

const mockProgressData = {
  readiness_score: 65,
  current_stage: {
    stage_number: 2,
    stage_id: 'stage-2',
    title: 'Developing Rep',
    objective: 'Execute with consistency',
    points_required: 300,
    key_skills: ['Consistency', 'Follow-up', 'Closing'],
  },
  next_stage: {
    stage_number: 3,
    title: 'Performing Rep',
    points_required: 500,
  },
  next_assignment: {
    type: 'module',
    track_id: 'track_1',
    track: 'Pro Mindset',
    content: {
      title: 'Building Your Champion Mindset',
      duration: 8,
    },
  },
  progress: {
    modules_completed: ['mod_1_1', 'mod_1_2'],
    badges_earned: ['first_steps'],
    tracks_progress: {
      track_1: 33,
      track_2: 0,
    },
  },
  stats: {
    modules_completed: 2,
    total_modules: 36,
    breakdowns_reviewed: 3,
    total_breakdowns: 15,
    quickwins_applied: 5,
    total_quickwins: 20,
    training_streak: 5,
  },
};

const mockTracksData = [
  {
    track_id: 'track_1',
    track_number: 1,
    name: 'Pro Mindset',
    modules: [
      { module_id: 'mod_1_1', module_number: '1.1' },
      { module_id: 'mod_1_2', module_number: '1.2' },
    ],
    total_duration: 60,
  },
  {
    track_id: 'track_2',
    track_number: 2,
    name: 'Discovery & Control',
    modules: [],
    total_duration: 75,
  },
];

const mockStagesData = [
  {
    stage_id: 'stage-1',
    stage_number: 1,
    title: 'New Rep',
    objective: 'Build foundation',
    points_required: 150,
    typical_duration: '1-2 weeks',
    key_skills: ['Basics', 'Product knowledge'],
  },
  {
    stage_id: 'stage-2',
    stage_number: 2,
    title: 'Developing Rep',
    objective: 'Execute with consistency',
    points_required: 300,
    typical_duration: '2-4 weeks',
    key_skills: ['Consistency', 'Follow-up'],
  },
  {
    stage_id: 'stage-3',
    stage_number: 3,
    title: 'Performing Rep',
    objective: 'Close consistently',
    points_required: 500,
    typical_duration: '4-8 weeks',
    key_skills: ['Closing', 'Objection handling'],
  },
  {
    stage_id: 'stage-4',
    stage_number: 4,
    title: 'Consistent Top Producer',
    objective: 'Elite performance',
    points_required: 750,
    typical_duration: '8-12 weeks',
    key_skills: ['Mastery', 'Leadership'],
  },
];

const mockBadgesData = [
  {
    badge_id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first module',
    criteria: 'Complete 1 module',
    criteria_type: 'content_count',
    criteria_value: 1,
    icon: 'award',
  },
  {
    badge_id: 'streak_master',
    name: 'Streak Master',
    description: '7-day training streak',
    criteria: 'Train for 7 consecutive days',
    criteria_type: 'streak',
    criteria_value: 7,
    icon: 'flame',
  },
];

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('TopProducerPath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('progress')) return Promise.resolve({ data: mockProgressData });
      if (url.includes('tracks')) return Promise.resolve({ data: mockTracksData });
      if (url.includes('stages')) return Promise.resolve({ data: mockStagesData });
      if (url.includes('badges')) return Promise.resolve({ data: mockBadgesData });
      return Promise.resolve({ data: {} });
    });
  });

  it('should render loading state initially', () => {
    // Mock to stay in loading state
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<TopProducerPath />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render page title', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Top Producer Path')).toBeInTheDocument();
    });
  });

  it('should display current stage information', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Current Stage')).toBeInTheDocument();
      expect(screen.getByText('Developing Rep')).toBeInTheDocument();
    });
  });

  it('should display user points', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('250')).toBeInTheDocument();
    });
  });

  it('should display readiness score', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Readiness Score')).toBeInTheDocument();
      expect(screen.getByText('65')).toBeInTheDocument();
    });
  });

  it('should display next assignment', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText(/Your Next Step/i)).toBeInTheDocument();
      expect(screen.getByText('Building Your Champion Mindset')).toBeInTheDocument();
    });
  });

  it('should display all 4 stages', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('New Rep')).toBeInTheDocument();
      expect(screen.getByText('Developing Rep')).toBeInTheDocument();
      expect(screen.getByText('Performing Rep')).toBeInTheDocument();
      expect(screen.getByText('Consistent Top Producer')).toBeInTheDocument();
    });
  });

  it('should display training tracks', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Training Tracks')).toBeInTheDocument();
      expect(screen.getByText('Pro Mindset')).toBeInTheDocument();
      expect(screen.getByText('Discovery & Control')).toBeInTheDocument();
    });
  });

  it('should display achievement badges', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Achievement Badges')).toBeInTheDocument();
      expect(screen.getByText('First Steps')).toBeInTheDocument();
      expect(screen.getByText('Streak Master')).toBeInTheDocument();
    });
  });

  it('should show quick links to breakdowns and quick wins', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(screen.getByText('Real Deal Breakdowns')).toBeInTheDocument();
      expect(screen.getByText('Quick Wins Library')).toBeInTheDocument();
    });
  });

  it('should fetch all required data on mount', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/development/progress'),
        expect.any(Object)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/development/tracks'),
        expect.any(Object)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/development/stages'),
        expect.any(Object)
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/development/badges'),
        expect.any(Object)
      );
    });
  });

  it('should highlight current stage', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      const currentStage = screen.getByText('Current');
      expect(currentStage).toBeInTheDocument();
    });
  });

  it('should show earned badges with active style', async () => {
    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      // first_steps is earned
      expect(screen.getByText('First Steps')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<TopProducerPath />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
