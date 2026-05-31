'use client';

import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchStats } from '@/features/profile/slices/statsSlice';
import { AdminGuard } from '@/features/profile/components/AdminGuard';
import { io } from 'socket.io-client';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((s) => s.stats);

  useEffect(() => {
    dispatch(fetchStats());
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    socket.on('inventory:update', () => dispatch(fetchStats()));
    return () => { socket.disconnect(); };
  }, [dispatch]);

  const stats = data as {
    userCount?: number;
    productCount?: number;
    orderCount?: number;
    totalRevenue?: number;
    recentOrders?: { _id: string; totalPrice: number; user?: { name: string } }[];
    lowStock?: { name: string; stock: number }[];
  } | null;

  const cards = [
    { label: 'Users', value: stats?.userCount ?? 0 },
    { label: 'Products', value: stats?.productCount ?? 0 },
    { label: 'Orders', value: stats?.orderCount ?? 0 },
    { label: 'Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}` },
  ];

  return (
    <AdminGuard>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {loading && <Typography>Loading...</Typography>}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent>
              <Typography color="text.secondary">{c.label}</Typography>
              <Typography variant="h4">{c.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            <List dense>
              {(stats?.recentOrders || []).map((o) => (
                <ListItem key={o._id}>
                  <ListItemText
                    primary={`#${o._id.slice(-6)} — $${o.totalPrice.toFixed(2)}`}
                    secondary={o.user?.name}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Low Stock</Typography>
            <List dense>
              {(stats?.lowStock || []).map((p) => (
                <ListItem key={p.name}>
                  <ListItemText primary={p.name} secondary={`${p.stock} left`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </AdminGuard>
  );
}
