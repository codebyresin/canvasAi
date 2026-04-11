import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

const NotFound = async () => {
  const t = await getTranslations("NotFound");
  const common = await getTranslations("Common");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{t("description")}</p>
        <div className="pt-2">
          <Link
            href={`/${routing.defaultLocale}`}
            className="inline-flex rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            {common("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
