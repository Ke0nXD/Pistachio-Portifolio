import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Pistachio Creations — Furry Art Commissions',
  description: 'Cute furry art commissions with personality, charm and care. Icons, Half Body, Full Body, Reference Sheets.',
  keywords: 'furry art, commissions, pixel art, anthro, feral, cat, icon commission',
  openGraph: {
    title: 'Pistachio Creations',
    description: 'Cute furry art commissions open!',
    type: 'website',
  },
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
