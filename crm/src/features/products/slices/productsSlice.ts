import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../services/productsApi';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  return productsApi.getAll();
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (data: Record<string, unknown>) => {
    return productsApi.create(data);
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
    return productsApi.update(id, data);
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: string) => {
  await productsApi.remove(id);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] as Record<string, unknown>[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (s, a) => { s.items = a.payload; })
      .addCase(createProduct.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => (p as { _id: string })._id === a.payload._id);
        if (i >= 0) s.items[i] = a.payload;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => (p as { _id: string })._id !== a.payload);
      });
  },
});

export default productsSlice.reducer;
