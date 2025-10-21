const { config } = require("dotenv");

config();

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix: isProduction ? "https://dashboard.collector.crm" : undefined,
  outputFileTracingRoot: "/Users/darioristic/Cursor/CRM-ERP-NEW",
  env: {
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "https",
        hostname: "bundui-images.netlify.app"
      }
    ]
  },
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  }
};

module.exports = nextConfig;
