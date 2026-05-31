import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Product | ShopVerse' };
    const product = await res.json();
    return {
      title: product.name,
      description: product.description?.slice(0, 160) || `Buy ${product.name} at ShopVerse`,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return { title: 'Product | ShopVerse' };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
