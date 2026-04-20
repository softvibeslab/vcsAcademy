import { ContentItem, QuickWin, TourResult, User } from '../types';
import {
  createDemoCoachingResponse,
  createDemoOfflineContent,
  DEMO_AUTH_TOKEN,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  demoUser,
} from './data';
import {
  ensureDemoProgressState,
  getDemoDailyGoal,
  getDemoQuickWinsState,
  getDemoReadinessScore,
  recordDemoAiCoachSession,
  recordDemoTourResult,
  toggleDemoQuickWinFavorite,
} from './progress';

type DemoRequestOptions = Pick<RequestInit, 'method' | 'body'> & {
  authenticated?: boolean;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseJsonBody<T>(body?: BodyInit | null): T | null {
  if (typeof body !== 'string') {
    return null;
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

function matchesDemoCredentials(body?: BodyInit | null) {
  const payload = parseJsonBody<{ email?: string; password?: string }>(body);

  return (
    payload?.email?.trim().toLowerCase() === DEMO_EMAIL &&
    payload?.password === DEMO_PASSWORD
  );
}

export function isDemoToken(token: string | null) {
  return token === DEMO_AUTH_TOKEN;
}

export function shouldUseDemoApi(
  path: string,
  options: DemoRequestOptions,
  token: string | null
) {
  if (path === '/mobile/auth/login') {
    return matchesDemoCredentials(options.body);
  }

  return isDemoToken(token);
}

async function buildDemoLoginResponse(): Promise<User & { session_token: string }> {
  await ensureDemoProgressState();

  return {
    ...clone(demoUser),
    session_token: DEMO_AUTH_TOKEN,
  };
}

async function getFilteredQuickWins(path: string): Promise<QuickWin[]> {
  const url = new URL(path, 'https://demo.vcsa.local');
  const category = url.searchParams.get('category');
  const limitValue = Number(url.searchParams.get('limit'));
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : null;

  const quickWins = await getDemoQuickWinsState();
  const filtered =
    category && category !== 'All'
      ? quickWins.filter((quickWin) => quickWin.category === category)
      : quickWins;

  return clone(limit ? filtered.slice(0, limit) : filtered);
}

export async function getDemoApiResponse<T>(
  path: string,
  options: DemoRequestOptions,
  token: string | null
): Promise<T | null> {
  if (!shouldUseDemoApi(path, options, token)) {
    return null;
  }

  if (path === '/mobile/auth/login') {
    return (await buildDemoLoginResponse()) as T;
  }

  if (path === '/auth/me') {
    await ensureDemoProgressState();
    return clone(demoUser) as T;
  }

  if (path === '/auth/logout') {
    await ensureDemoProgressState();
    return null;
  }

  if (path.startsWith('/mobile/performance/readiness')) {
    return clone(await getDemoReadinessScore()) as T;
  }

  if (path.startsWith('/mobile/performance/daily-goal')) {
    return clone(await getDemoDailyGoal()) as T;
  }

  if (path.startsWith('/mobile/quick-wins/') && options.method === 'POST') {
    const match = path.match(/^\/mobile\/quick-wins\/([^/]+)\/favorite$/);
    const quickWinId = match?.[1];

    if (!quickWinId) {
      return null;
    }

    return (await toggleDemoQuickWinFavorite(quickWinId)) as T;
  }

  if (path.startsWith('/mobile/quick-wins')) {
    return (await getFilteredQuickWins(path)) as T;
  }

  if (path.startsWith('/mobile/ai/coach') && options.method === 'POST') {
    const payload = parseJsonBody<{ content?: string }>(options.body);
    await recordDemoAiCoachSession();
    return createDemoCoachingResponse(payload?.content || '') as T;
  }

  if (path.startsWith('/mobile/sync/content')) {
    await ensureDemoProgressState();
    return clone(createDemoOfflineContent()) as T;
  }

  if (path.startsWith('/mobile/performance/tour') && options.method === 'POST') {
    const payload = parseJsonBody<Partial<TourResult>>(options.body);
    const tourResult: TourResult = {
      tour_id: payload?.tour_id || `demo_tour_${Date.now()}`,
      outcome: payload?.outcome || 'follow_up',
      duration_minutes: payload?.duration_minutes || 30,
      objections_handled: payload?.objections_handled || 2,
      ai_coach_used: payload?.ai_coach_used ?? true,
      confidence_before: payload?.confidence_before || 6,
      confidence_after: payload?.confidence_after || 8,
      notes: payload?.notes,
      client_profile: payload?.client_profile,
    };

    return (await recordDemoTourResult(tourResult)) as T;
  }

  return null;
}
