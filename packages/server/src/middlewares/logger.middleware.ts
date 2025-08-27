import { ORPCError, os } from "@orpc/server";
import pino from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
    },
});

export const loggerMiddleware = os.middleware(async ({ next, context }) => {
    try {
        return await next({
            context: {
                ...context,
                console: logger,
            },
        });
    } catch (error) {
        if (!(error instanceof ORPCError)) {
            console.error(error);
        }

        throw error;
    }
});
