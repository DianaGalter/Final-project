'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { login, verify2FA } from '../slices/authSlice';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, requires2FA, pendingUserId, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result) && !(result.payload as { requires2FA?: boolean }).requires2FA) {
      toast.success('Welcome back!');
      router.push('/');
    } else if (login.rejected.match(result)) {
      toast.error(error || 'Login failed');
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserId) return;
    const result = await dispatch(verify2FA({ userId: pendingUserId, code }));
    if (verify2FA.fulfilled.match(result)) {
      toast.success('Verified!');
      router.push('/');
    } else {
      toast.error('Invalid code');
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{requires2FA ? 'Verify 2FA' : 'Sign In'}</CardTitle>
      </CardHeader>
      <CardContent>
        {requires2FA ? (
          <form onSubmit={handle2FA} className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Verify
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-center text-sm">
              <Link href="/forgot-password" className="text-zinc-600 hover:underline">
                Forgot password?
              </Link>
            </p>
            <p className="text-center text-sm">
              No account?{' '}
              <Link href="/register" className="font-medium hover:underline">
                Register
              </Link>
            </p>
            <a
              href={`${apiUrl}/api/auth/google`}
              className="block w-full rounded-md border py-2 text-center text-sm hover:bg-zinc-50"
            >
              Continue with Google
            </a>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
