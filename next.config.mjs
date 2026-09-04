/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "the-reporters-media-2026.s3.eu-central-003.backblazeb2.com",
      },
    ],
  },
};
export default nextConfig;
