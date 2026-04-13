"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

export const Logo = () => {
  const t = useTranslations("Editor.Logo");

  return (
    <Link href={`/${routing.defaultLocale}`}>
      <div className="size-8 relative shrink-0">
        <Image
          priority
          src="/logo.svg"
          alt={t("alt")}
          fill
          className="hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};
