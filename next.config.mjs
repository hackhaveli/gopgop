/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes and dynamic features
  images: { unoptimized: true },
};

export default nextConfig;
