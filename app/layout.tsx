import type { Metadata, Viewport } from 'next';
import './globals.css';
import Sidebar from './components/Sidebar';

const SITE_NAME = 'Klyxe — AI Model Benchmark';
const SITE_DESC = 'Daily automated benchmark of AI models. Compare quality, speed, and reasoning across Groq, OpenRouter, Cerebras, Together AI, Google, and SambaNova.';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klyxe.ai';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: '%s | Klyxe' },
  description: SITE_DESC,
  icons: { icon: '/favicon.ico', apple: '/media/L_logo.png' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Klyxe',
    title: SITE_NAME,
    description: SITE_DESC,
    url: SITE_URL,
    images: [{ url: '/media/og-image.png', width: 1200, height: 630, alt: 'Klyxe AI Benchmark' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESC,
    images: ['/media/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f14' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Klyxe',
              url: SITE_URL,
              description: SITE_DESC,
              applicationCategory: 'Benchmark',
              operatingSystem: 'All',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
        {/* inline theme script to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: '(function(){document.documentElement.setAttribute("data-theme",localStorage.getItem("theme")||"dark");})();' }} />
      </head>
      <body>
        <div className="sidebar-overlay" id="sidebar-overlay" />
        <div className="app-layout">
          <Sidebar />
          <div className="sidebar-main">{children}</div>
        </div>
      </body>
    </html>
  );
}
