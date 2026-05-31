'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { updateProfile, logout } from '@/features/profile/slices/authSlice';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem('token');
      if (!token) router.push('/login');
    } else {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user, router]);

  const handleSave = async () => {
    const result = await dispatch(updateProfile({ name, phone }));
    if (updateProfile.fulfilled.match(result)) toast.success('Profile updated');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <Link href="/profile/orders" className="font-medium hover:underline">
            View Order History
          </Link>
          <Button variant="outline" onClick={() => { dispatch(logout()); router.push('/'); }}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
