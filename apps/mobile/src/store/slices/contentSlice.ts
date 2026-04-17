import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { QuickWin, ContentItem } from '../../types';
import { apiFetch } from '../../services/fetch';

interface ContentState {
  quickWins: QuickWin[];
  favoriteQuickWins: QuickWin[];
  offlineContent: ContentItem[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  searchQuery: string;
  selectedCategory: string | null;
}

const initialState: ContentState = {
  quickWins: [],
  favoriteQuickWins: [],
  offlineContent: [],
  isLoading: false,
  isSyncing: false,
  lastSync: null,
  searchQuery: '',
  selectedCategory: null,
};

// Async thunks
export const fetchQuickWins = createAsyncThunk(
  'content/fetchQuickWins',
  async (filters?: { category?: string; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    return apiFetch<QuickWin[]>(`/mobile/quick-wins${query ? `?${query}` : ''}`);
  }
);

export const toggleFavorite = createAsyncThunk(
  'content/toggleFavorite',
  async (quickWinId: string) => {
    return apiFetch<QuickWin>(`/mobile/quick-wins/${quickWinId}/favorite`, {
      method: 'POST',
    });
  }
);

export const syncOfflineContent = createAsyncThunk(
  'content/syncOffline',
  async () => {
    return apiFetch<ContentItem[]>('/mobile/sync/content');
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuickWins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchQuickWins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quickWins = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedWin = action.payload;
        const index = state.quickWins.findIndex(w => w.id === updatedWin.id);
        if (index !== -1) {
          state.quickWins[index] = updatedWin;
        }
      })
      .addCase(syncOfflineContent.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncOfflineContent.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.offlineContent = action.payload;
        state.lastSync = new Date().toISOString();
      });
  },
});

export const { setSearchQuery, setSelectedCategory } = contentSlice.actions;
export default contentSlice.reducer;
