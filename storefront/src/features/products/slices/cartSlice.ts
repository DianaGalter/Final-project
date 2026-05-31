import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '../services/cartApi';
import { loadCartBackup, saveCartBackup } from '../utils/cartHelpers';
import { getOrCreateGuestId } from '@/shared/utils/guestId';
import type { Product } from './productsSlice';

export interface CartItem {
  _id?: string;
  product: Product | string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  synced: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  synced: false,
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  getOrCreateGuestId();
  return cartApi.get();
});

export const addToCartApi = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    getOrCreateGuestId();
    return cartApi.addItem(productId, quantity);
  }
);

export const updateCartItemApi = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    return cartApi.updateItem(itemId, quantity);
  }
);

export const removeFromCartApi = createAsyncThunk('cart/remove', async (itemId: string) => {
  return cartApi.removeItem(itemId);
});

export const mergeCart = createAsyncThunk('cart/merge', async () => {
  const guestId = localStorage.getItem('guestId') || '';
  return cartApi.merge(guestId);
});

export const syncCartToServer = createAsyncThunk(
  'cart/sync',
  async (items: { productId: string; quantity: number }[]) => {
    getOrCreateGuestId();
    return cartApi.sync(items);
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateLocalCart: (state) => {
      state.items = loadCartBackup();
    },
    addItemLocal: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (i) => (typeof i.product === 'string' ? i.product : i.product._id) === product._id
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      saveCartBackup(state.items);
    },
    setCartFromServer: (state, action: PayloadAction<{ items: CartItem[] }>) => {
      state.items = action.payload.items || [];
      state.synced = true;
      saveCartBackup(state.items);
    },
    clearCartLocal: (state) => {
      state.items = [];
      saveCartBackup([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.synced = true;
        saveCartBackup(s.items);
      })
      .addCase(addToCartApi.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        saveCartBackup(s.items);
      })
      .addCase(updateCartItemApi.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        saveCartBackup(s.items);
      })
      .addCase(removeFromCartApi.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        saveCartBackup(s.items);
      })
      .addCase(mergeCart.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.synced = true;
        saveCartBackup(s.items);
      })
      .addCase(syncCartToServer.fulfilled, (s, a) => {
        s.items = a.payload.items || [];
        s.synced = true;
      });
  },
});

export const { hydrateLocalCart, addItemLocal, setCartFromServer, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
