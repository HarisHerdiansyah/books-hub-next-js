import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    S3_BUCKET: process.env.S3_BUCKET,
    CLOUD_REGION: process.env.CLOUD_REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    CLOUDFRONT_DIST_ID: process.env.CLOUDFRONT_DIST_ID,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_RESET_PASSWORD:
      process.env.EMAILJS_TEMPLATE_RESET_PASSWORD,
    EMAILJS_TEMPLATE_CONFIRMATION: process.env.EMAILJS_TEMPLATE_CONFIRMATION,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY,
    CLOUDFRONT: process.env.CLOUDFRONT,
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1aa9ieorf4vom.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
