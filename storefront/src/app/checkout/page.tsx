'use client';

import { CheckoutFlow } from '@/features/profile/components/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <div className="px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
