'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { AdminLayout } from '@/shared/components/AdminLayout';
import { setUser } from '@/features/profile/slices/authSlice';
import api from '@/shared/services/api';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (!user) {
      api
        .get('/auth/me')
        .then((res) => {
          if (res.data.role !== 'admin') {
            localStorage.removeItem('crm_token');
            router.push('/login');
          } else {
            dispatch(setUser(res.data));
            setReady(true);
          }
        })
        .catch(() => {
          localStorage.removeItem('crm_token');
          router.push('/login');
        });
    } else {
      setReady(true);
    }
  }, [user, router, dispatch]);

  if (!ready && !user) return null;

  return <AdminLayout>{children}</AdminLayout>;
}
