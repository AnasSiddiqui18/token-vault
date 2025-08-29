import { implement } from "@orpc/server";
import { contract } from "@/contracts";
import { serviceRouter } from "@/modules/services/service.controller";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import type { Env } from "./types/index";
import { initResources } from "./middlewares/init-resources";

export const router = implement(contract)
    .$context<{ req: Request; env: Env }>()
    .use(loggerMiddleware)
    .use(initResources)
    .router({ service: serviceRouter });
