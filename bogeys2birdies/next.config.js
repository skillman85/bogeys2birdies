/** @type {import('next').NextConfig} */
const nextConfig = {
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
