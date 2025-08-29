import type { InitialContext } from "@/types/index";
import { ORPCError, os } from "@orpc/server";

export const authMiddleware = os
    .$context<InitialContext>()
    .middleware(async ({ context, next }) => {
        try {
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
                    message: "Unauthorized",
                });

            return next({
                context: { ...context, user: session.user },
            });
        } catch (error) {
            throw new Error(`Something went wrong in auth middleware `);
        }
    });
