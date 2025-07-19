// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { GlobalThemeProvider } from '@/components/providers/GlobalThemeProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coaching V3',
  description: 'Sistema de coaching com gestão de clubes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <GlobalThemeProvider>
            {children}
          </GlobalThemeProvider>
        </SessionProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}