'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStore, AppStore } from '@/shared/slices/store';

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#1e3a5f' } },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ToastContainer position="bottom-right" theme="colored" />
      </ThemeProvider>
    </Provider>
  );
}
