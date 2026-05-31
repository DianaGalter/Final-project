'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/shared/services/api';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = params.get('token');
    if (!token) return toast.error('Invalid reset link');
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset! Please sign in.');
      router.push('/login');
    } catch {
      toast.error('Reset failed');
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader><CardTitle>Reset Password</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="px-4 py-12">
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
