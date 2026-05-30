/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; "
              + "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; "
              + "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; "
              + "connect-src 'self' https://openrouter.ai https://api.openai.com https://api.anthropic.com https://api.allorigins.win https://r.jina.ai; "
              + "worker-src 'self' blob: https://cdnjs.cloudflare.com; "
              + "img-src 'self' data:; "
              + "font-src 'self'; "
              + "frame-ancestors 'none'; "
              + "base-uri 'self'; "
              + "form-action 'self'",
          },
        ],
      },
      {
        source: '/data/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=60' },
        ],
      },
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;