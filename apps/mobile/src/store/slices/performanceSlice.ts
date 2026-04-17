import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReadinessScore, DailyGoal, TourResult } from '../../types';
import { apiFetch } from '../../services/fetch';

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
    return apiFetch<ReadinessScore>('/mobile/performance/readiness');
  }
);

export const fetchDailyGoal = createAsyncThunk(
  'performance/fetchDailyGoal',
  async () => {
    return apiFetch<DailyGoal>('/mobile/performance/daily-goal');
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
      .addCase(fetchDailyGoal.fulfilled, (state, action) => {
        state.dailyGoal = action.payload;
      })
      .addCase(recordTourResult.fulfilled, (state, action) => {
        state.tourHistory.push(action.payload);
      });
  },
});

export const { updateStreak } = performanceSlice.actions;
export default performanceSlice.reducer;
