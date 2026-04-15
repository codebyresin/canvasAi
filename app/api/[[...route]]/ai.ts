import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const DASHSCOPE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const DASHSCOPE_MODEL = "qwen-image-2.0";

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

const app = new Hono().post(
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
