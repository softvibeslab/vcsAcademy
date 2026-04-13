import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import aiCoachReducer from './slices/aiCoachSlice';
import performanceReducer from './slices/performanceSlice';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    aiCoach: aiCoachReducer,
    performance: performanceReducer,
    content: contentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
