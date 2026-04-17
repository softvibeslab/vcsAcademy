// User Types
export interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string | null;
  level: number;
  points: number;
  membership: 'free' | 'vip';
  role: 'member' | 'admin';
  team_id: string | null;
  manager_id: string | null;
  created_at: string;
}

// AI Coach Types
export interface SalesContext {
  client_type?: 'vip' | 'family' | 'investor';
  tour_number?: number;
  previous_objections?: string[];
  time_constraint?: number;
}

export interface CoachingInput {
  input_type: 'text' | 'voice';
  content: string;
  context: SalesContext;
  preference?: {
    tone: 'motivational' | 'technical' | 'friendly';
    length: 'short' | 'medium' | 'detailed';
  };
}

export interface CoachingResponse {
  interaction_id: string;
  responses: ResponseApproach[];
  key_move: string;
  confidence_score: number;
  estimated_impact: 'high' | 'medium' | 'low';
  suggested_next_steps: string[];
}

export interface ResponseApproach {
  approach: 'emotional' | 'logical' | 'story-based';
  script: string;
  talking_points: string[];
  risk_factors: string[];
  expected_outcome: string;
}

// Quick Wins Types
export interface QuickWin {
  id: string;
  title: string;
  category: string;
  one_liner: string;
  action_steps: string[];
  timing: string;
  video_url?: string;
  audio_url?: string;
  estimated_impact: number;
  favorite_count: number;
  is_favorite: boolean;
}

// Performance Types
export interface TourResult {
  tour_id: string;
  outcome: 'sale' | 'no_sale' | 'follow_up';
  duration_minutes: number;
  objections_handled: number;
  ai_coach_used: boolean;
  confidence_before: number;
  confidence_after: number;
  notes?: string;
  client_profile?: {
    type: string;
    budget: string;
    timeline: string;
  };
}

export interface ReadinessScore {
  score: number;
  components: {
    training: number;
    performance: number;
    streak: number;
    ai_usage: number;
    quick_wins: number;
    mental_game: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  recommended_actions: string[];
}

export interface DailyGoal {
  goal_id: string;
  user_id: string;
  date: string;
  goals: {
    tours: number;
    sales: number;
    ai_coach_sessions: number;
    quick_wins_applied: number;
  };
  progress: {
    tours_completed: number;
    sales_closed: number;
    ai_sessions_used: number;
    quick_wins_used: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Dashboard: undefined;
  PreTourMode: undefined;
  AICoachChat: undefined;
  QuickWinsLibrary: undefined;
  PostTourDebrief: { tourId?: string };
  GoalSheet: undefined;
  PlayRole: undefined;
  Profile: undefined;
};

export type NavigationProp = <T extends keyof RootStackParamList>(
  route: T
) => void;

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Content Types
export interface ContentItem {
  id: string;
  title: string;
  type: 'quick_win' | 'video' | 'audio';
  category: string;
  content: string;
  url?: string;
  local_path?: string;
  cached_at?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}
