import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// 1. 初始化 next-intl
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// 3. 基础配置
const nextConfig: NextConfig = {
  // 你的其他配置
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
    ],
  },
};

// 4. 组合多个插件（从内到外包裹）
export default withNextIntl(nextConfig);
