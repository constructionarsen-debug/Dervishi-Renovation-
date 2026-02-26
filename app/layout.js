import './globals.css';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import Nav from '@/components/Nav';

// app/layout.js

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),

  title: {
    default: "Dervishi Renovation - Renovim Apartamentesh & Interiere në Shqipëri",
    template: "%s | Dervishi Renovation",
  },

  description:
    "Renovim apartamentesh, shtëpish, zyrash dhe interiere moderne në Tiranë dhe Shqipëri. Punime cilësore, planifikim i saktë, transparencë dhe garanci. Shërbim online, eBooks dhe projekte të realizuara.",

  applicationName: "Dervishi Renovation",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  keywords: [
    "dervishi renovation",
    "renovim tirane",
    "renovim apartamentesh tirane",
    "renovim shtepish",
    "rinovim banese",
    "interier tirane",
    "dizajn interieri",
    "punime gipsi",
    "bojatisje",
    "elektrike hidraulike",
    "parket pllake",
    "punime ndertimi tirane",
    "kompani renovimi shqiperi",
    "restaurim apartamenti",
    "kontraktor renovimi",
    "renovim zyra",
    "renovim lokali",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "sq_AL",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "Dervishi Renovation",
    title: "Dervishi Renovation - Renovim & Interiere Moderne në Shqipëri",
    description:
      "Renovim apartamentesh, shtëpish, zyrash dhe interiere moderne në Tiranë dhe Shqipëri. Punime cilësore, transparencë dhe garanci.",
    images: [
      {
        url: "/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Dervishi Renovation - Renovim dhe Interier",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Dervishi Renovation - Renovim & Interiere Moderne",
    description:
      "Renovim apartamentesh, shtëpish, zyrash dhe interiere moderne në Tiranë dhe Shqipëri. Punime cilësore, transparencë dhe garanci.",
    images: ["/og-image-v2.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  other: {
    "geo.region": "AL",
    "geo.placename": "Tiranë",
    "geo.position": "41.3275;19.8187",
    ICBM: "41.3275, 19.8187",
  },

  category: "construction",

  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  manifest: "/site.webmanifest",
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
            <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 mt-20">{children}</main>
            <Footer />
          </div>
                  </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
