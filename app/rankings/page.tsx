import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rankings',
  description: 'AI model benchmark rankings — quality and speed scores across all tested models.',
  openGraph: {
    title: 'AI Models Ranked — Klyxe',
    description: 'Compare real benchmark scores for 50+ AI models. Updated daily.',
  },
};

export default function RankingsPage() {
  return (
    <>
      {/* Load old frontend scripts that render the rankings UI */}
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />
      <Script src="/app.js" strategy="afterInteractive" />
      <Script src="/index.js" strategy="afterInteractive" />

      <div id="rankings-root" style={{ minHeight: '100vh' }}>
        <div className="hero">
          <div className="hero-inner">
            <h1 className="hero-headline" id="hero-headline">Klyxe</h1>
            <p className="hero-sub">
              Daily benchmark of <strong>AI models</strong> — quality, speed, reasoning.
              Updated every 24 hours.
            </p>
            <div className="hero-stats" id="hero-stats"></div>
          </div>
        </div>
        <main className="container" id="main-content">
          <div className="board" id="board"></div>
        </main>
      </div>
    </>
  );
}
