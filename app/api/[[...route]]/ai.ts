import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const DASHSCOPE_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const DASHSCOPE_MODEL = "qwen-image-2.0";
const DASHSCOPE_IMAGE_EDIT_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/image-synthesis";
const DASHSCOPE_TASKS_URL = "https://dashscope.aliyuncs.com/api/v1/tasks";
const DASHSCOPE_IMAGE_EDIT_MODEL = "wan2.5-i2i-preview";
const REMOVE_BG_POLL_INTERVAL = 3000;
const REMOVE_BG_MAX_ATTEMPTS = 40;

type DashScopeMessageContent = {
  image?: string;
  text?: string;
};

type DashScopeResponse = {
  output?: {
    choices?: Array<{
      message?: {
        content?: DashScopeMessageContent[];
      };
    }>;
  };
  code?: string;
  message?: string;
};

type DashScopeTaskResult = {
  url?: string;
  code?: string;
  message?: string;
};

type DashScopeTaskOutput = {
  task_id?: string;
  task_status?: string;
  results?: DashScopeTaskResult[];
  code?: string;
  message?: string;
};

type DashScopeAsyncResponse = {
  output?: DashScopeTaskOutput;
  code?: string;
  message?: string;
};

/**
 * 清理图片 URL 末尾多余的标点，避免第三方服务拉图失败。
 */
const sanitizeImageUrl = (value: string) => {
  return value.trim().replace(/[):\]}>,.;]+$/g, "");
};

/**
 * 创建适用于背景移除的万相图像编辑提示词。
 */
const createRemoveBackgroundPrompt = () => {
  return [
    "移除图片主体背景，保留主体完整细节。",
    "输出透明背景PNG。",
    "不要添加新元素，不要改变主体颜色、比例、角度和构图。",
  ].join("");
};

/**
 * 轮询等待前的简单延迟工具。
 */
const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 创建阿里百炼万相图像编辑异步任务。
 */
const createRemoveBackgroundTask = async (apiKey: string, image: string) => {
  const normalizedImage = sanitizeImageUrl(image);

  const response = await fetch(DASHSCOPE_IMAGE_EDIT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-DashScope-Async": "enable",
    },
    body: JSON.stringify({
      model: DASHSCOPE_IMAGE_EDIT_MODEL,
      input: {
        prompt: createRemoveBackgroundPrompt(),
        images: [normalizedImage],
      },
      parameters: {
        n: 1,
        prompt_extend: true,
        watermark: false,
      },
    }),
  });

  const result = (await response.json()) as DashScopeAsyncResponse;

  if (!response.ok || !result.output?.task_id) {
    throw new Error(
      result.message || "Failed to create remove background task",
    );
  }

  return result.output.task_id;
};

/**
 * 轮询异步任务直到成功、失败或超时。
 */
const waitForTaskResult = async (apiKey: string, taskId: string) => {
  for (let attempt = 0; attempt < REMOVE_BG_MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(`${DASHSCOPE_TASKS_URL}/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const result = (await response.json()) as DashScopeAsyncResponse;

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch remove background task",
      );
    }

    const status = result.output?.task_status;

    if (status === "SUCCEEDED") {
      const imageUrl = result.output?.results?.find(
        (item) => typeof item.url === "string",
      )?.url;

      if (!imageUrl) {
        throw new Error("Failed to remove background");
      }

      return imageUrl;
    }

    if (status === "FAILED" || status === "CANCELED" || status === "UNKNOWN") {
      throw new Error(
        result.output?.message ||
          result.message ||
          "Failed to remove background",
      );
    }

    await sleep(REMOVE_BG_POLL_INTERVAL);
  }

  throw new Error("Remove background timed out");
};

const app = new Hono()
  .post(
    "/remove-bg",
    zValidator(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    /**
     * 调用阿里百炼万相图像编辑接口，为输入图片移除背景。
     */
    async (c) => {
      try {
        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
          console.error("remove-bg failed: missing DASHSCOPE_API_KEY");
          return c.json({ error: "DASHSCOPE_API_KEY is not configured" }, 500);
        }

        const { image } = c.req.valid("json");
        const taskId = await createRemoveBackgroundTask(apiKey, image);
        const imageUrl = await waitForTaskResult(apiKey, taskId);

        return c.json({ data: imageUrl });
      } catch (error) {
        console.error("remove-bg failed:", error);
        return c.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove background",
          },
          500,
        );
      }
    },
  )
  .post(
    "/generate-image",
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      }),
    ),
    async (c) => {
      try {
        const apiKey = process.env.DASHSCOPE_API_KEY;

        if (!apiKey) {
          console.error("generate-image failed: missing DASHSCOPE_API_KEY");
          return c.json({ error: "DASHSCOPE_API_KEY is not configured" }, 500);
        }

        const { prompt } = c.req.valid("json");
        const response = await fetch(DASHSCOPE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: DASHSCOPE_MODEL,
            input: {
              messages: [
                {
                  role: "user",
                  content: [{ text: prompt }],
                },
              ],
            },
            parameters: {
              result_format: "message",
              n: 1,
              watermark: true,
              negative_prompt: "",
            },
          }),
        });

        const result = (await response.json()) as DashScopeResponse;

        if (!response.ok) {
          console.error("generate-image failed:", result);
          return c.json(
            { error: result.message || "Failed to generate image" },
            500,
          );
        }

        const imageUrl = result.output?.choices?.[0]?.message?.content?.find(
          (item) => typeof item.image === "string",
        )?.image;

        if (!imageUrl) {
          console.error("generate-image failed: invalid response", result);
          return c.json({ error: "Failed to generate image" }, 500);
        }

        return c.json({ data: imageUrl });
      } catch (error) {
        console.error("generate-image failed:", error);
        return c.json({ error: "Failed to generate image" }, 500);
      }
    },
  );

export default app;
