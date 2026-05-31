import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/profile/slices/authSlice';
import productsReducer from '@/features/products/slices/productsSlice';
import ordersReducer from '@/features/products/slices/ordersSlice';
import usersReducer from '@/features/profile/slices/usersSlice';
import statsReducer from '@/features/profile/slices/statsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      orders: ordersReducer,
      users: usersReducer,
      stats: statsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
