import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">ShopVerse</p>
            <p className="mt-2 text-sm text-zinc-600">Modern e-commerce for everyone.</p>
          </div>
          <div>
            <p className="font-semibold">Shop</p>
            <Link href="/products" className="mt-2 block text-sm text-zinc-600 hover:text-zinc-900">
              All Products
            </Link>
          </div>
          <div>
            <p className="font-semibold">Account</p>
            <Link href="/login" className="mt-2 block text-sm text-zinc-600 hover:text-zinc-900">
              Sign In
            </Link>
            <Link href="/register" className="mt-2 block text-sm text-zinc-600 hover:text-zinc-900">
              Register
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} ShopVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
