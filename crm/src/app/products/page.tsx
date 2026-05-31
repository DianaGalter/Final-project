'use client';

import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
} from '@mui/material';
import { Trash2, Plus, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminGuard } from '@/features/profile/components/AdminGuard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/features/products/slices/productsSlice';

type Product = { _id: string; name: string; description: string; price: number; stock: number; category: string };

const empty = { name: '', description: '', price: 0, stock: 0, category: 'general' };

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.products);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const openCreate = () => {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      await dispatch(updateProduct({ id: editId, data: form }));
      toast.success('Product updated');
    } else {
      await dispatch(createProduct(form));
      toast.success('Product created');
    }
    setOpen(false);
  };

  return (
    <AdminGuard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
          Add Product
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(items as Product[]).map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>${p.price.toFixed(2)}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEdit(p)} size="small"><Pencil size={18} /></IconButton>
                <IconButton onClick={() => { dispatch(deleteProduct(p._id)); toast.success('Deleted'); }} size="small" color="error">
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Product' : 'New Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {(['name', 'description', 'category'] as const).map((f) => (
            <TextField key={f} label={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          ))}
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </AdminGuard>
  );
}
