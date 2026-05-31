'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../slices/productsSlice';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useAppDispatch } from '@/shared/hooks/redux';
import { addToCartApi, addItemLocal } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { ProductQuickView } from './ProductQuickView';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const image = product.images?.[0] || '/placeholder.svg';

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
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square bg-zinc-100">
          <Image src={image} alt={product.name} fill className="object-cover" unoptimized />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold hover:underline">{product.name}</h3>
        </Link>
        <p className="mt-1 text-lg font-bold">${product.price.toFixed(2)}</p>
        <p className="text-xs text-zinc-500">{product.stock} in stock</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <ProductQuickView product={product} />
        <Button className="w-full" onClick={handleAdd} disabled={product.stock < 1}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
