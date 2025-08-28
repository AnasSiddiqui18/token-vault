import { Redis } from "@upstash/redis";
import "dotenv/config";
import type { Env } from "..";

export function createRedis(env: Env) {
    console.log("env inside redis", env);
    return new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
}
