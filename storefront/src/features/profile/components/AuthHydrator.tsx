'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../slices/authSlice';
import { fetchCart, mergeCart, hydrateLocalCart } from '@/features/products/slices/cartSlice';
import { getOrCreateGuestId } from '@/shared/utils/guestId';
import type { AppDispatch, RootState } from '@/shared/slices/store';
import { io } from 'socket.io-client';
import { updateProductStock } from '@/features/products/slices/productsSlice';

export function AuthHydrator() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    getOrCreateGuestId();
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchMe()).then(() => {
        dispatch(mergeCart()).then(() => dispatch(fetchCart()));
      });
    } else {
      dispatch(hydrateLocalCart());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl);
    socket.on('inventory:update', (data: { productId: string; stock: number }) => {
      dispatch(updateProductStock(data));
    });
    return () => { socket.disconnect(); };
  }, [dispatch]);

  useEffect(() => {
    if (user?.token) localStorage.setItem('token', user.token);
  }, [user]);

  return null;
}
