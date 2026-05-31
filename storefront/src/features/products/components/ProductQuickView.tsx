'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { Product } from '../slices/productsSlice';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useAppDispatch } from '@/shared/hooks/redux';
import { addToCartApi, addItemLocal } from '../slices/cartSlice';

export function ProductQuickView({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const image = product.images?.[0] || '/placeholder.svg';

  const handleAdd = async () => {
    try {
      await dispatch(addToCartApi({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
      setOpen(false);
    } catch {
      dispatch(addItemLocal({ product, quantity: 1 }));
      toast.success('Added to cart');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Eye className="h-4 w-4" />
          Quick View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg bg-zinc-100">
          <Image src={image} alt={product.name} fill className="object-cover" unoptimized />
        </div>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-zinc-600 line-clamp-3">{product.description}</p>
        <p className="text-xs text-zinc-500">{product.stock} in stock</p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleAdd} disabled={product.stock < 1}>
            Add to Cart
          </Button>
          <Link href={`/products/${product._id}`} className="flex-1" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full">
              Full Details
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
