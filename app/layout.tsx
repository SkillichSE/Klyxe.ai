import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Klyxe — AI Hub',
  description: 'Daily automated benchmark of the best free AI models. Compare quality, speed, and reasoning across Groq, OpenRouter, and Google.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="icon" href="/media/L_Logo.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
