import {
  CoachingResponse,
  ContentItem,
  DailyGoal,
  QuickWin,
  User,
} from '../types';

export const DEMO_EMAIL = 'demo@vcsa.com';
export const DEMO_PASSWORD = 'demo123';
export const DEMO_AUTH_TOKEN = 'demo-session-token';

export const demoUser: User = {
  user_id: 'demo_user_id',
  email: DEMO_EMAIL,
  name: 'Demo Rep',
  picture: null,
  level: 7,
  points: 2840,
  membership: 'vip',
  role: 'member',
  team_id: 'team_sunrise',
  manager_id: 'manager_ana',
  created_at: '2026-01-12T15:30:00.000Z',
};

export function createDemoQuickWins(): QuickWin[] {
  return [
    {
      id: 'qw_anchor_value',
      title: 'Anchor With Memory Value',
      category: 'closing_help',
      one_liner: 'Shift the conversation from monthly cost to annual family memory value.',
      action_steps: [
        'Acknowledge the budget concern first.',
        'Reframe the purchase around planned family trips.',
        'Ask what one missed vacation per year costs emotionally.',
      ],
      timing: 'When price objection appears',
      estimated_impact: 8,
      favorite_count: 21,
      is_favorite: true,
    },
    {
      id: 'qw_discovery_future',
      title: 'Ask the Future Vacation Question',
      category: 'before_tour',
      one_liner: 'Get them describing their ideal next getaway before you present.',
      action_steps: [
        'Ask where they want to travel next.',
        'Ask who they imagine bringing.',
        'Mirror their answer later in the close.',
      ],
      timing: 'First 5 minutes of discovery',
      estimated_impact: 7,
      favorite_count: 14,
      is_favorite: false,
    },
    {
      id: 'qw_spouse_alignment',
      title: 'Create Spouse Alignment Early',
      category: 'relationship',
      one_liner: 'Get both decision makers answering the same ownership question.',
      action_steps: [
        'Ask each person what a perfect vacation looks like.',
        'Highlight the overlap out loud.',
        'Return to that overlap during objections.',
      ],
      timing: 'Discovery and rapport stage',
      estimated_impact: 6,
      favorite_count: 9,
      is_favorite: false,
    },
    {
      id: 'qw_objection_pause',
      title: 'Pause Before Solving',
      category: 'objections',
      one_liner: 'Slow down and ask one clarifying question before answering the objection.',
      action_steps: [
        'Repeat the objection calmly.',
        'Ask what specifically feels expensive.',
        'Answer the real issue, not the surface objection.',
      ],
      timing: 'Immediately after an objection',
      estimated_impact: 9,
      favorite_count: 33,
      is_favorite: false,
    },
    {
      id: 'qw_micro_commitment',
      title: 'Close With a Micro-Commitment',
      category: 'closing_help',
      one_liner: 'Ask for the next smallest yes instead of the final yes.',
      action_steps: [
        'Ask if the package fits the way they travel.',
        'Confirm one favorite benefit.',
        'Move naturally into paperwork once they agree.',
      ],
      timing: 'Final close',
      estimated_impact: 8,
      favorite_count: 17,
      is_favorite: true,
    },
  ];
}

export function createDemoReadinessScore() {
  return {
    score: 84,
    components: {
      training: 88,
      performance: 81,
      streak: 92,
      ai_usage: 76,
      quick_wins: 85,
      mental_game: 82,
    },
    trend: 'improving' as const,
    recommended_actions: [
      'Practice one price-objection roleplay before your next tour.',
      'Use one closing quick win in your first presentation today.',
      'Log your post-tour debrief to keep the streak alive.',
    ],
  };
}

export function createDemoDailyGoal(): DailyGoal {
  const today = new Date().toISOString().slice(0, 10);

  return {
    goal_id: 'goal_demo_today',
    user_id: demoUser.user_id,
    date: today,
    goals: {
      tours: 4,
      sales: 1,
      ai_coach_sessions: 3,
      quick_wins_applied: 2,
    },
    progress: {
      tours_completed: 2,
      sales_closed: 1,
      ai_sessions_used: 1,
      quick_wins_used: 1,
    },
    status: 'in_progress',
  };
}

export function createDemoOfflineContent(): ContentItem[] {
  return [
    {
      id: 'content_qw_anchor_value',
      title: 'Anchor With Memory Value',
      type: 'quick_win',
      category: 'closing_help',
      content: 'Reframe price around long-term family use and emotional return.',
      cached_at: new Date().toISOString(),
    },
    {
      id: 'content_pre_tour_reset',
      title: 'Two-Minute Pre-Tour Reset',
      type: 'audio',
      category: 'before_tour',
      content: 'A short mental reset before stepping onto the floor.',
      url: 'https://example.com/demo-pre-tour-reset',
      cached_at: new Date().toISOString(),
    },
  ];
}

export function createDemoCoachingResponse(input: string): CoachingResponse {
  const objection = input.trim() || 'the client is hesitating on price';

  return {
    interaction_id: `demo_coach_${Date.now()}`,
    responses: [
      {
        approach: 'emotional',
        script:
          `I hear you. A lot of families pause here because they want to make the right decision, not a rushed one. ` +
          `What usually helps is looking at how ${objection.toLowerCase()} connects to the vacations you want to protect over the next few years.`,
        talking_points: [
          'Acknowledge the hesitation without pushing back immediately.',
          'Reconnect the decision to family use and future trips.',
          'Ask one narrowing question before presenting value.',
        ],
        risk_factors: [
          'Avoid defending the price too early.',
          'Do not stack too many benefits at once.',
        ],
        expected_outcome: 'Client stays engaged and moves from resistance into conversation.',
      },
      {
        approach: 'logical',
        script:
          'Let’s compare this against the trips you already plan to take. If the membership supports the vacations you are already budgeting for, the decision becomes about value and flexibility rather than just sticker price.',
        talking_points: [
          'Compare against existing travel habits.',
          'Translate the offer into annual use cases.',
          'Move toward one concrete next step.',
        ],
        risk_factors: [
          'Keep the math simple.',
        ],
        expected_outcome: 'Client sees the offer as a structured travel decision instead of an impulse buy.',
      },
    ],
    key_move: 'Slow the pace, validate the concern, then reframe around planned family travel.',
    confidence_score: 0.86,
    estimated_impact: 'high',
    suggested_next_steps: [
      'Ask what part feels most expensive to them.',
      'Tie one core benefit to their next vacation.',
      'Close on the next smallest yes, not the whole package.',
    ],
  };
}
