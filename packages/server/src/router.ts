import { implement } from "@orpc/server";
import { contract } from "@/contracts";
import { serviceRouter } from "@/modules/services/service.controller";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import type { Env } from "./index";
import { getRedis } from "./middlewares/get-redis";

export const router = implement(contract)
    .$context<{ req: Request; env: Env }>()
    .use(loggerMiddleware)
    .use(getRedis)
    .router({ service: serviceRouter });
