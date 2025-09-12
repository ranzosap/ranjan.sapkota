/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add basePath configuration for GitHub Pages project repositories
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` 
    : '',
  // Add assetPrefix for proper asset loading
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_REPOSITORY 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` 
    : '',
}

export default nextConfig
