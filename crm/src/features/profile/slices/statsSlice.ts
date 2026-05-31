import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { statsApi } from '../services/statsApi';

export const fetchStats = createAsyncThunk('stats/fetch', async () => {
  return statsApi.getDashboard();
});

const statsSlice = createSlice({
  name: 'stats',
  initialState: { data: null as Record<string, unknown> | null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (s) => { s.loading = true; })
      .addCase(fetchStats.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(fetchStats.rejected, (s) => { s.loading = false; });
  },
});

export default statsSlice.reducer;
