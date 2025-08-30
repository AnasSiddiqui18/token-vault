import { Redis } from "@upstash/redis/cloudflare";
import "dotenv/config";
import type { Env } from "@/types/index";

export function createRedis(env: Env) {
    return new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
}
