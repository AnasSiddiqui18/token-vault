import type { InitialContext } from "@/types/index";
import { ORPCError, os } from "@orpc/server";

export const authMiddleware = os
    .$context<InitialContext>()
    .middleware(async ({ context, next }) => {
        const { req, auth } = context;

        if (!req)
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Request is required in contexts",
            });

        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session)
            throw new ORPCError("UNAUTHORIZED", {
                message: "session is null",
            });

        return next({
            context: { ...context, user: session.user },
        });
    });
