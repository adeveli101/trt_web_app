// next.config.js
import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Diğer Next.js ayarlarınızı buraya ekleyebilirsiniz (örneğin, experimental, images, compiler vb.)
  // ÖNEMLİ: Burada manuel olarak i18n objesi TANIMLAMAYIN!

  // Environment variables güvenliği
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 gün
  },

  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/api/gemini',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // API route güvenliği
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-markdown'],
  },

  // Server external packages
  serverExternalPackages: ['@google/genai'],

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default withNextIntl({
  // `next-intl`'in `requestConfig` ayarı burada kalmalı, bu doğru.
  requestConfig: './src/i18n/request.ts'
})(nextConfig);