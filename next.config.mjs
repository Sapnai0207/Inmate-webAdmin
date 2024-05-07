/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  transpilePackages: [
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "@ant-design/charts",
  ],
};

export default nextConfig;
