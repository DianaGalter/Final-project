'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ordersApi } from '@/features/profile/services/ordersApi';
import { cartApi } from '@/features/products/services/cartApi';
import { calcCheckoutTotals } from '@/features/profile/utils/checkoutHelpers';
import { getProductFromCartItem } from '@/features/products/utils/cartHelpers';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/redux';
import { clearCartLocal } from '@/features/products/slices/cartSlice';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
const steps = ['Shipping', 'Payment', 'Review'];

export function CheckoutFlow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState('mock_card');

  const subtotal = items.reduce((sum, i) => {
    const p = getProductFromCartItem(i);
    return sum + (p.price || 0) * i.quantity;
  }, 0);
  const { shippingPrice, tax, total } = calcCheckoutTotals(subtotal);

  const placeOrder = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => {
        const p = getProductFromCartItem(i);
        return {
          product: typeof i.product === 'string' ? i.product : p._id,
          name: p.name,
          price: p.price,
          quantity: i.quantity,
          image: p.images?.[0],
        };
      });
      await ordersApi.create({
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
      });
      await cartApi.clear();
      dispatch(clearCartLocal());
      toast.success('Order placed!');
      router.push('/profile/orders');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <p className="text-center text-zinc-600">Your cart is empty.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex justify-center gap-2">
        {steps.map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-4 py-1 text-sm ${i === step ? 'bg-zinc-900 text-white' : 'bg-zinc-100'}`}
          >
            {s}
          </span>
        ))}
      </div>

      {step === 0 && (
        <Card>
          <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {(['street', 'city', 'state', 'zip', 'country'] as const).map((field) => (
              <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  value={shipping[field]}
                  onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
                  required
                />
              </div>
            ))}
            <Button className="sm:col-span-2" onClick={() => setStep(1)}>
              Continue to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Mock Payment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600">This is a simulated payment step. No real charges.</p>
            <div>
              <Label>Payment method</Label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="mock_card">Mock Credit Card</option>
                <option value="mock_paypal">Mock PayPal</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Review Order</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Order Review</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {items.map((i) => {
                const p = getProductFromCartItem(i);
                return (
                  <li key={typeof i.product === 'string' ? i.product : p._id} className="flex justify-between">
                    <span>{p.name} x{i.quantity}</span>
                    <span>${((p.price || 0) * i.quantity).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="border-t pt-4 text-sm">
              <p className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></p>
              <p className="mt-2 flex justify-between font-bold"><span>Total</span><span>${total.toFixed(2)}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={placeOrder} disabled={loading}>
                {loading ? 'Placing...' : 'Place Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
