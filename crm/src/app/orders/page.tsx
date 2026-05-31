'use client';

import { useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, MenuItem, Chip,
} from '@mui/material';
import { toast } from 'react-toastify';
import { AdminGuard } from '@/features/profile/components/AdminGuard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchOrders, updateOrderStatus } from '@/features/products/slices/ordersSlice';

type Order = {
  _id: string;
  totalPrice: number;
  status: string;
  user?: { name: string; email: string };
  createdAt: string;
};

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatus = async (id: string, status: string) => {
    await dispatch(updateOrderStatus({ id, status }));
    toast.success(`Order marked as ${status}`);
  };

  return (
    <AdminGuard>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(items as Order[]).map((o) => (
            <TableRow key={o._id}>
              <TableCell>#{o._id.slice(-6)}</TableCell>
              <TableCell>{o.user?.name || '—'}<br /><small>{o.user?.email}</small></TableCell>
              <TableCell>${o.totalPrice.toFixed(2)}</TableCell>
              <TableCell><Chip label={o.status} size="small" /></TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={o.status}
                  onChange={(e) => handleStatus(o._id, e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminGuard>
  );
}
