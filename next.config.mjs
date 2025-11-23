/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["sql.js"],
  },
  output: 'standalone'
};

export default nextConfig;
