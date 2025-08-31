import type { Logger } from "pino";
import type { Redis } from "@upstash/redis";
import * as schema from "@repo/database/db/schema";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { betterAuth } from "better-auth";

export type User = typeof schema.user.$inferSelect;
export type Session = typeof schema.session.$inferSelect;
export type Env = {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    POSTGRES_URL: string;
};

export type db = NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
};

export type InitialContext = {
    req: Request;
    console: Logger;
    env: Env;
    redis: Redis;
    db: db;
    auth: TBetterAuth;
};

export type ContextWithUser = {
    user: User;
} & InitialContext;
export type TBetterAuth = ReturnType<typeof betterAuth>;
