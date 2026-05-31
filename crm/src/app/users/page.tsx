'use client';

import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminGuard } from '@/features/profile/components/AdminGuard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchUsers, updateUser, deleteUser } from '@/features/profile/slices/usersSlice';

type UserRow = { _id: string; name: string; email: string; role: string; twoFactorEnabled?: boolean };

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.users);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', twoFactorEnabled: false });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openEdit = (user: UserRow) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled || false,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editUser) return;
    await dispatch(updateUser({ id: editUser._id, data: form }));
    toast.success('User updated');
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await dispatch(deleteUser(id));
    toast.success('User deleted');
  };

  return (
    <AdminGuard>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>2FA</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(items as UserRow[]).map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={user.role} size="small" color={user.role === 'admin' ? 'primary' : 'default'} />
              </TableCell>
              <TableCell>{user.twoFactorEnabled ? 'On' : 'Off'}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEdit(user)} size="small">
                  <Pencil size={18} />
                </IconButton>
                <IconButton onClick={() => handleDelete(user._id)} size="small" color="error">
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormControl>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>2FA</InputLabel>
            <Select
              value={form.twoFactorEnabled ? 'on' : 'off'}
              label="2FA"
              onChange={(e) => setForm({ ...form, twoFactorEnabled: e.target.value === 'on' })}
            >
              <MenuItem value="off">Disabled</MenuItem>
              <MenuItem value="on">Enabled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </AdminGuard>
  );
}
