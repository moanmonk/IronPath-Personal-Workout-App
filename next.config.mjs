/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '.next-dev',
};

export default nextConfig;
