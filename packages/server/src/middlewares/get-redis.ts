import { os } from "@orpc/server";
import type { Env } from "..";
import { createRedis } from "@/upstash/upstash";
import type { Logger } from "pino";

export const getRedis = os
    .$context<{
        env: Env;
        console: Logger;
        req: Request;
    }>()
    .middleware(async ({ context, next }) => {
        const { env } = context;
        const redis = createRedis(env);
        return next({ context: { ...context, redis } });
    });
