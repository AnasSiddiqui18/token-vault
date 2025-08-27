import { implement } from "@orpc/server";
import { contract } from "@/contracts";
import { serviceRouter } from "@/modules/services/service.controller";
import type { InitialContext } from "./types";
import { loggerMiddleware } from "./middlewares/logger.middleware";

export const router = implement(contract)
    .$context<{
        req: Request;
    }>()
    .use(loggerMiddleware)
    .router({
        service: serviceRouter,
    });
