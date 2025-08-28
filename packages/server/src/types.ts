import type { Logger } from "pino";
import type { auth } from "./auth/auth";
import type { Env } from ".";
import type { Redis } from "@upstash/redis";

export type InitialContext = {
    req: Request;
    console: Logger;
    env: Env;
    redis: Redis;
};

export type ContextWithUser = {
    user: typeof auth.$Infer.Session.user;
} & InitialContext;
