import {
  CoachingResponse,
  DailyGoal,
  QuickWin,
  ReadinessScore,
  ResponseApproach,
} from '../types';

export function normalizeReadinessScore(payload: any): ReadinessScore {
  if (payload?.score !== undefined) {
    return payload as ReadinessScore;
  }

  return {
    score: payload?.readiness_score ?? 0,
    components: {
      training: payload?.components?.training ?? 0,
      performance: payload?.components?.performance ?? 0,
      streak: payload?.components?.streak ?? 0,
      ai_usage: payload?.components?.ai_usage ?? 0,
      quick_wins: payload?.components?.quick_wins ?? 0,
      mental_game: payload?.components?.mental_game ?? 0,
    },
    trend: payload?.trend ?? 'stable',
    recommended_actions: payload?.recommended_actions ?? [],
  };
}

export function normalizeDailyGoal(payload: any): DailyGoal {
  if (payload?.goals) {
    return payload as DailyGoal;
  }

  const targets = payload?.targets ?? {};
  const progress = payload?.progress ?? {};

  return {
    goal_id: payload?.goal_id ?? 'goal_unavailable',
    user_id: payload?.user_id ?? 'demo_user_id',
    date: payload?.date ?? new Date().toISOString().slice(0, 10),
    goals: {
      tours: targets.tours ?? 0,
      sales: targets.sales ?? 0,
      ai_coach_sessions: targets.ai_coach_sessions ?? targets.ai_coach_uses ?? 0,
      quick_wins_applied: targets.quick_wins_applied ?? 0,
    },
    progress: {
      tours_completed: progress.tours_completed ?? progress.tours ?? 0,
      sales_closed: progress.sales_closed ?? progress.sales ?? 0,
      ai_sessions_used:
        progress.ai_sessions_used ??
        progress.ai_coach_sessions ??
        progress.ai_coach_uses ??
        0,
      quick_wins_used: progress.quick_wins_used ?? progress.quick_wins_applied ?? 0,
    },
    status: payload?.status ?? 'pending',
  };
}

export function normalizeQuickWins(payload: any): QuickWin[] {
  if (Array.isArray(payload)) {
    return payload as QuickWin[];
  }

  if (Array.isArray(payload?.quick_wins)) {
    return payload.quick_wins as QuickWin[];
  }

  return [];
}

export function normalizeCoachingResponse(payload: any): CoachingResponse {
  if (payload?.responses) {
    return payload as CoachingResponse;
  }

  const responses: ResponseApproach[] = Array.isArray(payload?.approaches)
    ? payload.approaches.map((approach: any) => ({
        approach: mapApproachType(approach?.type),
        script: approach?.response ?? 'Here is a coaching direction you can use.',
        talking_points: approach?.key_move ? [approach.key_move] : [],
        risk_factors: [],
        expected_outcome: 'Keep the conversation moving with confidence.',
      }))
    : [];

  const fallbackResponse =
    responses[0] ??
    {
      approach: 'emotional' as const,
      script: 'Acknowledge the concern, slow the pace, and reframe the value.',
      talking_points: ['Lead with empathy and one clear next step.'],
      risk_factors: [],
      expected_outcome: 'The client stays engaged long enough for a stronger close.',
    };

  return {
    interaction_id: payload?.interaction_id ?? `coach_${Date.now()}`,
    responses: responses.length > 0 ? responses : [fallbackResponse],
    key_move:
      payload?.key_move ??
      fallbackResponse.talking_points[0] ??
      'Acknowledge the concern before reframing.',
    confidence_score: payload?.confidence_score ?? 0.7,
    estimated_impact: payload?.estimated_impact ?? 'medium',
    suggested_next_steps:
      payload?.suggested_next_steps ??
      [
        'Ask one clarifying question.',
        'Reconnect the offer to their travel goals.',
        'Close on the next smallest yes.',
      ],
  };
}

function mapApproachType(value: string | undefined): ResponseApproach['approach'] {
  if (value === 'logical' || value === 'story-based' || value === 'emotional') {
    return value;
  }

  return 'emotional';
}
