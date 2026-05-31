'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../slices/productsSlice';
import { Button } from '@/shared/components/ui/button';

export function ProductCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const featured = products.filter((p) => p.featured);

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (!featured.length) return null;
  const current = featured[index];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white">
      <div className="grid min-h-[320px] md:grid-cols-2">
        <div className="relative hidden md:block">
          <Image
            src={current.images?.[0] || '/placeholder.svg'}
            alt={current.name}
            fill
            className="object-cover opacity-80"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm uppercase tracking-widest text-zinc-400">Featured</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">{current.name}</h2>
          <p className="mt-4 line-clamp-2 text-zinc-300">{current.description}</p>
          <p className="mt-4 text-2xl font-bold">${current.price.toFixed(2)}</p>
          <Link href={`/products/${current._id}`} className="mt-6">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-900">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
      {featured.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
            onClick={() => setIndex((i) => (i - 1 + featured.length) % featured.length)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
            onClick={() => setIndex((i) => (i + 1) % featured.length)}
          >
            <ChevronRight />
          </Button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
