'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('crm_token', token);
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [params, router]);

  return <p style={{ padding: 32, textAlign: 'center' }}>Completing sign in...</p>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p style={{ padding: 32, textAlign: 'center' }}>Loading...</p>}>
      <CallbackInner />
    </Suspense>
  );
}
