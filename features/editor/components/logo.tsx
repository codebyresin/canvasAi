import Link from "next/link";
import Image from "next/image";
import { routing } from "@/i18n/routing";

export const Logo = () => {
  return (
    <Link href={`/${routing.defaultLocale}`}>
      <div className="size-8 relative shrink-0">
        <Image
          priority
          src="/logo.svg"
          alt="logo"
          fill
          className="hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};
