import type { Env } from "@/types/index";
import type { Logger } from "pino";
import "dotenv/config";
import { os } from "@orpc/server";
import { createRedis } from "@/upstash/upstash";
import { _auth } from "@/auth/auth";

export const initResources = os
    .$context<{
        env: Env;
        console: Logger;
        req: Request;
    }>()
    .middleware(async ({ context, next }) => {
        const { env } = context;
        const redis = createRedis(env);
        const { auth, db } = _auth(env);
        return next({ context: { ...context, redis, db, auth } });
    });
