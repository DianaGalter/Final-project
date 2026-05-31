'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { adminLogin, verify2FA } from '@/features/profile/slices/authSlice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, requires2FA, pendingUserId } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '');
  const [password, setPassword] = useState('admin123');
  const [code, setCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(adminLogin({ email, password }));
    if (adminLogin.fulfilled.match(result) && !(result.payload as { requires2FA?: boolean }).requires2FA) {
      toast.success('Welcome, Admin');
      router.push('/dashboard');
    } else if (adminLogin.rejected.match(result)) {
      toast.error(result.payload as string);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserId) return;
    const result = await dispatch(verify2FA({ userId: pendingUserId, code }));
    if (verify2FA.fulfilled.match(result)) {
      toast.success('Verified');
      router.push('/dashboard');
    } else {
      toast.error('Invalid code');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {requires2FA ? 'Admin 2FA' : 'CRM Login'}
          </Typography>
          {requires2FA ? (
            <form onSubmit={handle2FA}>
              <TextField fullWidth label="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} margin="normal" required />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
                Verify
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
