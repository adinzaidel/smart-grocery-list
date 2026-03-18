import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Smart Groceries - Manage Shopping Together',
  description: 'Share grocery lists with family & friends, get AI recommendations, and track your budget in real time.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
