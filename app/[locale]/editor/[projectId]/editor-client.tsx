"use client";

import dynamic from "next/dynamic";

const EditorLoading = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground [animation-delay:120ms]" />
          <span className="h-3 w-3 animate-pulse rounded-full bg-foreground [animation-delay:240ms]" />
        </div>
      </div>
    </main>
  );
};

const Editor = dynamic(() => import("@/features/editor/components/editor"), {
  ssr: false,
  loading: () => <EditorLoading />,
});

const EditorClient = () => {
  return <Editor />;
};

export default EditorClient;
