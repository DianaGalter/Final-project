import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/shared/components/Providers';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'ShopVerse | Modern E-Commerce', template: '%s | ShopVerse' },
  description: 'Discover quality products with fast checkout and secure shopping.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-zinc-900`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
