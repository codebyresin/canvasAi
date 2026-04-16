import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.ai)["remove-bg"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.ai)["remove-bg"]["$post"]
>["json"];

type ErrorResponse = {
  error?: string;
};

/**
 * 背景移除 Mutation Hook
 * 负责调用 `/api/ai/remove-bg` 接口并统一处理错误响应。
 */
export const useRemoveBg = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai["remove-bg"].$post({ json });

      if (!response.ok) {
        const errorBody = (await response
          .json()
          .catch(() => null)) as ErrorResponse | null;

        throw new Error(errorBody?.error || "Failed to remove background");
      }

      return await response.json();
    },
  });

  return mutation;
};
