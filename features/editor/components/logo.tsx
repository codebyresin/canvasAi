"use client";

import {Link} from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const Logo = () => {
  const t = useTranslations("Editor.Logo");

  return (
    <Link href="/">
      <div className="size-8 relative shrink-0">
        <Image
          priority
          fetchPriority="high"
          src="/logo.svg"
          alt={t("alt")}
          fill
          className="hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};
