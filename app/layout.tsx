import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Navbar } from '@/components/navbar';
import { Preloader } from '@/components/preloader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GopGop - Find & Close Micro-Influencer Deals Faster',
  description: 'Discover Indian creators by niche, city & views. See real reels. Shortlist. Contact instantly.',
  icons: {
    icon: '/logo.png',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Preloader />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}