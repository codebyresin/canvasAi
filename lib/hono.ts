import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";
//类型
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
//client 对象拥有与服务器完全对应的类型结构
//!使用rpc获取类型提示
