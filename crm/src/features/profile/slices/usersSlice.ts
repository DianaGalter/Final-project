import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../services/usersApi';

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  return usersApi.getAll();
});

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
    return usersApi.update(id, data);
  }
);

export const deleteUser = createAsyncThunk('users/delete', async (id: string) => {
  await usersApi.remove(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [] as Record<string, unknown>[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (s, a) => { s.items = a.payload; })
      .addCase(updateUser.fulfilled, (s, a) => {
        const i = s.items.findIndex((u) => (u as { _id: string })._id === a.payload._id);
        if (i >= 0) s.items[i] = a.payload;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.items = s.items.filter((u) => (u as { _id: string })._id !== a.payload);
      });
  },
});

export default usersSlice.reducer;
