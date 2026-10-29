/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    // Keep console.error in production so server failures show in Vercel logs.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Private, unlisted client workspace. Served as a standalone static document
  // from /public so it inherits none of the site chrome (navigation, footer,
  // global styles) and cannot affect any existing route.
  async rewrites() {
    return [{ source: '/noahs-consult', destination: '/noahs-consult.html' }];
  },
  async headers() {
    return [
      {
        source: '/noahs-consult',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/abide-agreement',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/noahs-consult.html',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
