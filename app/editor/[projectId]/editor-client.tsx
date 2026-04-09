"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const Editor = dynamic(() => import("@/features/editor/components/editor"), {
  ssr: false,
  loading: () => <Loading />,
});

const EditorClient = () => {
  return <Editor />;
};

export default EditorClient;
