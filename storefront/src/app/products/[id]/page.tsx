'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { fetchProductById } from '@/features/products/slices/productsSlice';
import { addToCartApi, addItemLocal } from '@/features/products/slices/cartSlice';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading || !product) {
    return <p className="p-8 text-center text-zinc-500">Loading product...</p>;
  }

  const handleAdd = async () => {
    try {
      await dispatch(addToCartApi({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch {
      dispatch(addItemLocal({ product, quantity: 1 }));
      toast.success('Added to cart');
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div>
        <p className="text-sm uppercase text-zinc-500">{product.category}</p>
        <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-3xl font-bold">${product.price.toFixed(2)}</p>
        <p className="mt-2 text-sm text-zinc-500">{product.stock} in stock</p>
        <p className="mt-6 text-zinc-600">{product.description}</p>
        <Button className="mt-8" size="lg" onClick={handleAdd} disabled={product.stock < 1}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
