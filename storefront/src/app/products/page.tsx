'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchProducts } from '@/features/products/slices/productsSlice';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Input } from '@/shared/components/ui/input';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.products);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts(search ? { search } : undefined));
  }, [dispatch, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">All Products</h1>
      <Input
        className="mt-4 max-w-md"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <p className="mt-8 text-zinc-500">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
