import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CoachingInput, CoachingResponse, ChatMessage } from '../../types';
import { apiFetch } from '../../services/fetch';

interface AICoachState {
  messages: ChatMessage[];
  isLoading: boolean;
  isListening: boolean;
  currentResponse: CoachingResponse | null;
  error: string | null;
  suggestions: string[];
}

const initialState: AICoachState = {
  messages: [],
  isLoading: false,
  isListening: false,
  currentResponse: null,
  error: null,
  suggestions: [
    "How do I handle price objections?",
    "Client wants to think about it",
    "They say it's too expensive"
  ],
};

// Async thunks
export const generateCoachingResponse = createAsyncThunk(
  'aiCoach/generateResponse',
  async (input: CoachingInput) => {
    return apiFetch<CoachingResponse>('/mobile/ai/coach', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
);

const aiCoachSlice = createSlice({
  name: 'aiCoach',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setListening: (state, action) => {
      state.isListening = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCoachingResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateCoachingResponse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResponse = action.payload;

        // Add assistant message
        state.messages.push({
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: action.payload.responses[0]?.script || 'Here are some suggestions...',
          timestamp: new Date().toISOString(),
          suggestions: action.payload.suggested_next_steps,
        });
      })
      .addCase(generateCoachingResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate response';
      });
  },
});

export const {
  addMessage,
  clearMessages,
  setListening,
  setSuggestions,
  clearError,
} = aiCoachSlice.actions;

export default aiCoachSlice.reducer;
