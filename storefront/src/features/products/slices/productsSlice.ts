import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../services/productsApi';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  featured?: boolean;
}

interface ProductsState {
  items: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  product: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params?: { featured?: boolean; category?: string; search?: string }) => {
    return productsApi.getAll(params);
  }
);

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id: string) => {
  return productsApi.getById(id);
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateProductStock: (state, action) => {
      const { productId, stock } = action.payload;
      const p = state.items.find((i) => i._id === productId);
      if (p) p.stock = stock;
      if (state.product && state.product._id === productId) state.product.stock = stock;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message || null; })
      .addCase(fetchProductById.pending, (s) => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProductById.rejected, (s) => { s.loading = false; });
  },
});

export const { updateProductStock } = productsSlice.actions;
export default productsSlice.reducer;
