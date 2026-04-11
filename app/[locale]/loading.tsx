import {getTranslations} from "next-intl/server";

const Loading = async () => {
  const t = await getTranslations("Loading");

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground [animation-delay:120ms]" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground [animation-delay:240ms]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{t("title")}</p>
          <p className="text-xs text-muted-foreground">{t("description")}</p>
        </div>
      </div>
    </main>
  );
};

export default Loading;
