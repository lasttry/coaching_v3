import type { NextConfig } from "next";

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;


module.exports = withNextIntl(nextConfig);