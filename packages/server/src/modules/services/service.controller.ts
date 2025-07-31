import { implement, ORPCError } from "@orpc/server";
import { serviceContract } from "./service.contract";
import { db } from "@repo/database/index";
import { service } from "@repo/database/db/schema";
import { eq } from "@repo/database/exports";
import type { auth } from "@/auth/auth";

export const serviceRouter = implement(serviceContract)
    .$context<{
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    }>()
    .router({
        create: implement(serviceContract.create)
            .$context<{
                user: typeof auth.$Infer.Session.user;
                session: typeof auth.$Infer.Session.session;
            }>()
            .handler(async ({ input, context }) => {
                try {
                    const userId = context.user.id;
                    const data = { ...input, userId };
                    await db.insert(service).values(data);
                } catch (error) {
                    throw new ORPCError("INTERNAL_SERVER_ERROR", {
                        message: "Service creation failed",
                    });
                }
            }),

        list: implement(serviceContract.list)
            .$context<{
                user: typeof auth.$Infer.Session.user;
                session: typeof auth.$Infer.Session.session;
            }>()
            .handler(async ({ context }) => {
                try {
                    const { user } = context;

                    const response = await db.query.service.findMany({
                        where: eq(service.userId, user.id),
                    });

                    return response;
                } catch (error) {
                    throw new ORPCError("INTERNAL_SERVER_ERROR", {
                        message: "Service creation failed",
                    });
                }
            }),
    });
