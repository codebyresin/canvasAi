import { defineRouting } from "next-intl/routing";

//!国际化总配置

export const routing = defineRouting({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  localePrefix: "always", //表示 URL 必须带语言前缀。
});

export type AppLocale = (typeof routing.locales)[number];
