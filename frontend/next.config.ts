import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export as fully static HTML/CSS/JS — required for GitHub Pages
  output: 'export',

  // GitHub Pages serves your site at: https://<username>.github.io/<repo-name>/
  // basePath tells Next.js all links and assets are under that subfolder.
  // If your repo is named "ai-resume-analyzer", set it to '/ai-resume-analyzer'
  // We read it from an env var so the same code works locally (no basePath) and on Pages.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Static export doesn't support Next.js Image Optimization
  images: { unoptimized: true },

  // Adds trailing slashes so GitHub Pages serves index.html correctly
  trailingSlash: true,
};

export default nextConfig;
