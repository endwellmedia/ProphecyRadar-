import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { NavShell } from '@/components/nav-shell';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['500', '600'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Prophecy Radar',
  description: "Your daily source for fresh Nigeria prophecy content."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body bg-base text-ink min-h-screen antialiased">
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
