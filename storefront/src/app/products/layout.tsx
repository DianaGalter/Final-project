import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full product catalog.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
