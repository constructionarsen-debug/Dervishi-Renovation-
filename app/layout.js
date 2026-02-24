import './globals.css';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'Dervishi Renovation',
  description: 'Rinovime & rikonstruksione profesionale në Shqipëri me standardin e UK.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <ThemeProvider>
          <AuthProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <div className="bg-grid">
            <Nav />
            <main className="mx-auto max-w-7xl px-4 pb-12 pt-8">{children}</main>
            <Footer />
          </div>
                  </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
