import type { Metadata } from 'next';
import { Providers } from '@/shared/components/Providers';

export const metadata: Metadata = {
  title: 'ShopVerse CRM',
  description: 'Admin dashboard for ShopVerse e-commerce',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
