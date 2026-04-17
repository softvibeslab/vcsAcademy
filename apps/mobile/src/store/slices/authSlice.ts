import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { apiFetch } from '../../services/fetch';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRestoredSession: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  hasRestoredSession: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const data = await apiFetch<User & { session_token: string }>('/mobile/auth/login', {
      method: 'POST',
      authenticated: false,
      body: JSON.stringify({
        ...credentials,
        device_info: {
          platform: 'expo',
        },
      }),
    });

    await AsyncStorage.setItem('auth_token', data.session_token);
    return {
      token: data.session_token,
      user: data as User,
    };
  }
);

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const token = await AsyncStorage.getItem('auth_token');

  if (!token) {
    return null;
  }

  try {
    const user = await apiFetch<User>('/auth/me');
    return { token, user };
  } catch {
    await AsyncStorage.removeItem('auth_token');
    return null;
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
    });
  } catch {
    // Local cleanup still matters when backend logout fails.
  }

  await AsyncStorage.removeItem('auth_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Restore session
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasRestoredSession = true;
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = !!action.payload?.token;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasRestoredSession = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.hasRestoredSession = true;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
