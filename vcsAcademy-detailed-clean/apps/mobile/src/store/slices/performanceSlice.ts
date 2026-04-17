import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReadinessScore, DailyGoal, TourResult } from '../../types';

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
    const response = await fetch('http://localhost:8001/api/mobile/performance/readiness');
    const data = await response.json();
    return data;
  }
);

export const fetchDailyGoal = createAsyncThunk(
  'performance/fetchDailyGoal',
  async () => {
    const response = await fetch('http://localhost:8001/api/mobile/performance/daily-goal');
    const data = await response.json();
    return data;
  }
);

export const recordTourResult = createAsyncThunk(
  'performance/recordTour',
  async (result: TourResult) => {
    const response = await fetch('http://localhost:8001/api/mobile/performance/tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    const data = await response.json();
    return data;
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
