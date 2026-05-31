'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/redux';
import { updateCartItemApi, removeFromCartApi } from '@/features/products/slices/cartSlice';
import { Button } from '@/shared/components/ui/button';
import type { Product } from '@/features/products/slices/productsSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);

  const getProduct = (item: (typeof items)[0]): Product =>
    typeof item.product === 'string' ? ({} as Product) : item.product;

  const total = items.reduce((sum, i) => {
    const p = getProduct(i);
    return sum + (p.price || 0) * i.quantity;
  }, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      {!items.length ? (
        <p className="mt-8 text-zinc-600">
          Your cart is empty. <Link href="/products" className="underline">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => {
              const p = getProduct(item);
              const itemId = item._id;
              return (
                <li key={itemId || p._id} className="flex gap-4 rounded-lg border p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-100">
                    <Image src={p.images?.[0] || '/placeholder.svg'} alt={p.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <Link href={`/products/${p._id}`} className="font-semibold hover:underline">{p.name}</Link>
                      <p className="text-zinc-600">${p.price?.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => itemId && dispatch(updateCartItemApi({ itemId, quantity: Math.max(1, item.quantity - 1) }))}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => itemId && dispatch(updateCartItemApi({ itemId, quantity: item.quantity + 1 }))}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => itemId && dispatch(removeFromCartApi(itemId))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <Link href="/checkout">
              <Button size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
