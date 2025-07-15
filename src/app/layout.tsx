import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppThemeProvider } from '@/components/settings';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'formify - Visual Form Builder',
  description: 'Create beautiful forms with drag and drop interface',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
