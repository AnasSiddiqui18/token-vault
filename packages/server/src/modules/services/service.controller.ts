import { implement, ORPCError } from "@orpc/server";
import { serviceContract } from "@/modules/services/service.contract";
import * as schema from "@repo/database/db/schema";
import type { ContextWithUser, InitialContext } from "@/types/index";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fetchServiceFromDB } from "@/helpers/fetch-services.from-db";
import { generateTokenFromSecret } from "@/helpers/generate-token-from-secret";

const os = implement(serviceContract).$context<ContextWithUser>();

export const serviceRouter = implement(serviceContract)
    .$context<InitialContext>()
    .use(authMiddleware)
    .router({
        create: os.create.handler(async ({ input, context }) => {
            try {
                const { user, db, redis } = context;
                const userId = user.id;
                const data = { ...input, userId };

                const [service] = await db
                    .insert(schema.service)
                    .values(data)
                    .returning();

                await redis.set(
                    `service-${service?.id}`,
                    JSON.stringify(service),
                );

                return Response.json({
                    success: true,
                    message: "Service created",
                });
            } catch (error) {
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Service creation failed",
                });
            }
        }),

        list: os.list.handler(async ({ context }) => {
            try {
                const { user, redis, db } = context;

                const is_record_present = await redis.keys("service-*");

                if (!is_record_present.length) {
                    console.log("redis database is empty");

                    const services = await fetchServiceFromDB(user.id, db);

                    console.log("services", services);

                    services.map(
                        async (service) =>
                            await redis.set(
                                `service-${service.id}`,
                                JSON.stringify(service),
                            ),
                    );

                    const record = services.map((res) => {
                        const token = generateTokenFromSecret(res.secret);
                        return {
                            label: res.label,
                            token,
                            id: res.id,
                        };
                    });

                    return record;
                }

                const response = is_record_present.map(async (key) => {
                    const record = await redis.get(key);
                    return record;
                }) as Promise<{
                    label: string;
                    secret: string;
                    id: string;
                    created_at: string;
                }>[];

                const resolvedResponse = await Promise.all(response);

                const record = resolvedResponse.map((res) => {
                    const token = generateTokenFromSecret(res.secret);
                    return {
                        label: res.label,
                        token,
                        id: res.id,
                        created_at: res.created_at,
                    };
                });

                return record;
            } catch (error) {
                console.log("failed to list", error);

                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Failed to list services.",
                });
            }
        }),
    });
