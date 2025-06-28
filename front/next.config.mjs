/** @type {import('next').NextConfig} */
const nextConfig = {};
nextConfig.images = {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '/api/v1/product/product-photo/**',
    },
    {
      protocol: 'https',
      hostname: 'hennahub-backend.onrender.com',
      pathname: '/api/v1/product/product-photo/**',
    },
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
  ],
};

export default nextConfig;

