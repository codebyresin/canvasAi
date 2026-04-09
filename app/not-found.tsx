import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold text-foreground">页面不存在</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          你访问的页面可能已被移动、删除，或者链接地址写错了。
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
