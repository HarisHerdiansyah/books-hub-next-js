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
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY,
    CLOUDFRONT: process.env.CLOUDFRONT,
    MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
    MAILTRAP_TEMPLATE: process.env.MAILTRAP_TEMPLATE,
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
