import { auth } from "@/auth/auth";
import type { InitialContext } from "@/types";
import { ORPCError, os } from "@orpc/server";

export const authMiddleware = os
    .$context<InitialContext>()
    .middleware(async ({ context, next }) => {
        if (!context.req)
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Request is required in contexts",
            });

        const session = await auth.api.getSession({
            headers: context.req.headers,
        });

        if (!session)
            throw new ORPCError("UNAUTHORIZED", { message: "Unauthorized" });

        return next({
            context: { ...context, user: session.user },
        });
    });
