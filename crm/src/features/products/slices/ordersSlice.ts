import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from '../services/ordersApi';

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  return ordersApi.getAll();
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    return ordersApi.updateStatus(id, status);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [] as Record<string, unknown>[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (s, a) => { s.items = a.payload; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const i = s.items.findIndex((o) => (o as { _id: string })._id === a.payload._id);
        if (i >= 0) s.items[i] = a.payload;
      });
  },
});

export default ordersSlice.reducer;
