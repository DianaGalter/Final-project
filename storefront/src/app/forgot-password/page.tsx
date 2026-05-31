'use client';

import { useState } from 'react';
import api from '@/shared/services/api';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/forgot-password', { email });
    toast.success('If that email exists, a reset link was sent');
  };

  return (
    <div className="px-4 py-12">
      <Card className="mx-auto max-w-md">
        <CardHeader><CardTitle>Forgot Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
