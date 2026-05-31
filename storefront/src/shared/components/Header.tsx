'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/shared/hooks/redux';
import { Button } from '@/shared/components/ui/button';

export function Header() {
  const [open, setOpen] = useState(false);
  const { items } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/cart', label: 'Cart' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ShopVerse
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative rounded-md p-2 hover:bg-zinc-100">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href={user ? '/profile' : '/login'} className="rounded-md p-2 hover:bg-zinc-100">
            <User className="h-5 w-5" />
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href={user ? '/profile' : '/login'} className="block py-2 text-sm font-medium" onClick={() => setOpen(false)}>
            {user ? 'Profile' : 'Login'}
          </Link>
        </nav>
      )}
    </header>
  );
}
