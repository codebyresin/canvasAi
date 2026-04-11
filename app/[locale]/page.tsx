import {getTranslations} from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
    </main>
  );
}
