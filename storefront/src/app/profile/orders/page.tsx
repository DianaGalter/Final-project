'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/features/profile/services/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    ordersApi.getMyOrders().then(setOrders);
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Order History</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="text-zinc-600">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <Card key={o._id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Order #{o._id.slice(-6)} — ${o.totalPrice.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                </p>
                <ul className="mt-2 text-sm">
                  {o.items.map((item, i) => (
                    <li key={i}>{item.name} x{item.quantity}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
