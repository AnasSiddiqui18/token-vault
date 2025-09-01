import { implement, ORPCError } from "@orpc/server";
import { sessionContract } from "./session.contract";
import type { TBetterAuth } from "@/types/index";

const os = implement(sessionContract).$context<{
    auth: TBetterAuth;
    req: Request;
}>();

export const sessionRouter = os.router({
    getSession: os.getSession.handler(async ({ context }) => {
        try {
            const { auth, req } = context;

            const currentSession = await auth.api.getSession({
                headers: req.headers,
            });

            if (!currentSession?.session)
                throw new ORPCError("NOT_FOUND", {
                    message: "Session not found",
                });

            return {
                id: currentSession.session.id,
                token: currentSession.session.token,
                userId: currentSession.session.userId,
            };
        } catch (error) {
            throw new ORPCError("NOT_FOUND", {
                message: "Failed to get session",
            });
        }
    }),
});
