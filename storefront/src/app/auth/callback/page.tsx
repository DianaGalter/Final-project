'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/shared/hooks/redux';
import { fetchMe } from '@/features/profile/slices/authSlice';
import { mergeCart } from '@/features/products/slices/cartSlice';

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      dispatch(fetchMe()).then(() => {
        dispatch(mergeCart());
        router.push('/');
      });
    } else {
      router.push('/login');
    }
  }, [params, router, dispatch]);

  return <p className="p-8 text-center">Completing sign in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <CallbackInner />
    </Suspense>
  );
}
