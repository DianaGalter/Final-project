'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStore, AppStore } from '@/shared/slices/store';
import { AuthHydrator } from '@/features/profile/components/AuthHydrator';

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator />
      {children}
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
    </Provider>
  );
}
