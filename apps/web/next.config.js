const { config } = require("dotenv");

config();

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix: isProduction ? "https://dashboard.collector.crm" : undefined,
  env: {
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003',
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
  }
};

module.exports = nextConfig;
