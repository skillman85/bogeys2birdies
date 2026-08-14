/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests; block-all-mixed-content' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://bogeys2birdies.sanity.studio',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
