'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchProducts } from '@/features/products/slices/productsSlice';
import { ProductCarousel } from '@/features/products/components/ProductCarousel';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Button } from '@/shared/components/ui/button';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Welcome to ShopVerse</h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
          Curated products, seamless checkout, and real-time inventory updates.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button size="lg">Browse All Products</Button>
        </Link>
      </section>

      <ProductCarousel products={items} />

      <section>
        <h2 className="mb-6 text-2xl font-bold">Latest Products</h2>
        {loading ? (
          <p className="text-zinc-500">Loading products...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
