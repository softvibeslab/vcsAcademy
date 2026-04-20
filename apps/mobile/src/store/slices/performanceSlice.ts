import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReadinessScore, DailyGoal, TourResult } from '../../types';
import { apiFetch } from '../../services/fetch';
import {
  normalizeDailyGoal,
  normalizeReadinessScore,
} from '../../services/mobileApiTransforms';

interface PerformanceState {
  readinessScore: ReadinessScore | null;
  dailyGoal: DailyGoal | null;
  weeklyProgress: any;
  tourHistory: TourResult[];
  streak: number;
  isLoading: boolean;
}

const initialState: PerformanceState = {
  readinessScore: null,
  dailyGoal: null,
  weeklyProgress: null,
  tourHistory: [],
  streak: 0,
  isLoading: false,
};

// Async thunks
export const fetchReadinessScore = createAsyncThunk(
  'performance/fetchReadinessScore',
  async () => {
    const response = await apiFetch<any>('/mobile/performance/readiness');
    return normalizeReadinessScore(response);
  }
);

export const fetchDailyGoal = createAsyncThunk(
  'performance/fetchDailyGoal',
  async () => {
    const response = await apiFetch<any>('/mobile/performance/daily-goal');
    return normalizeDailyGoal(response);
  }
);

export const recordTourResult = createAsyncThunk(
  'performance/recordTour',
  async (result: TourResult) => {
    return apiFetch<TourResult>('/mobile/performance/tour', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    updateStreak: (state, action) => {
      state.streak = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadinessScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReadinessScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readinessScore = action.payload;
      })
      .addCase(fetchReadinessScore.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchDailyGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDailyGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyGoal = action.payload;
      })
      .addCase(fetchDailyGoal.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(recordTourResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(recordTourResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tourHistory.unshift(action.payload);

        if (state.dailyGoal) {
          state.dailyGoal.progress.tours_completed += 1;

          if (action.payload.outcome === 'sale') {
            state.dailyGoal.progress.sales_closed += 1;
          }

          if (action.payload.ai_coach_used) {
            state.dailyGoal.progress.ai_sessions_used += 1;
          }

          const goal = state.dailyGoal.goals;
          const progress = state.dailyGoal.progress;
          const completed =
            progress.tours_completed >= goal.tours &&
            progress.sales_closed >= goal.sales &&
            progress.ai_sessions_used >= goal.ai_coach_sessions;

          state.dailyGoal.status = completed ? 'completed' : 'in_progress';
        }

        state.streak += 1;
      })
      .addCase(recordTourResult.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { updateStreak } = performanceSlice.actions;
export default performanceSlice.reducer;
