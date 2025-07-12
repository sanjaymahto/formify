import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppThemeProvider } from '@/components/app-theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'formify - Visual Form Builder',
  description: 'Create beautiful forms with drag and drop interface',
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
