import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/profile/slices/authSlice';
import cartReducer from '@/features/products/slices/cartSlice';
import productsReducer from '@/features/products/slices/productsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
