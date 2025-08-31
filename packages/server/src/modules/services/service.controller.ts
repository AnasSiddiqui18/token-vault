import { implement, ORPCError } from "@orpc/server";
import { serviceContract } from "@/modules/services/service.contract";
import * as schema from "@repo/database/db/schema";
import type { ContextWithUser, InitialContext } from "@/types/index";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fetchServiceFromDB } from "@/helpers/fetch-services.from-db";
import { generateTokenFromSecret } from "@/helpers/generate-token-from-secret";
import type { Redis } from "@upstash/redis/cloudflare";
import { isDatabaseError } from "@/helpers/is-db-error";

const os = implement(serviceContract).$context<ContextWithUser>();

type Service = {
    label: string;
    secret: string;
    id: string;
    createdAt: Date;
};

async function insertDataInRedis(
    redis: Redis,
    service: Service,
    userId: string,
) {
    await redis.rpush(`services-user-${userId}`, JSON.stringify(service));
    await redis.expire(`services-user-${userId}`, 900);
}

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

                if (!service)
                    throw new ORPCError("UNPROCESSABLE_CONTENT", {
                        message: "Failed to create service",
                    });

                await insertDataInRedis(redis, service, userId);

                return { message: "Service created successfully" };
            } catch (error) {
                if (isDatabaseError(error) && error.cause.code === "23505") {
                    throw new ORPCError("CONFLICT", {
                        message: "Service already exists.",
                    });
                }

                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Service creation failed",
                });
            }
        }),

        list: os.list.handler(async ({ context }) => {
            try {
                const { user, redis, db } = context;

                const servicesLength = await redis.llen(
                    `services-user-${user.id}`,
                );

                if (!servicesLength) {
                    console.log("redis database is empty");

                    const services = await fetchServiceFromDB(user.id, db);

                    const record = services.map(async (service) => {
                        await insertDataInRedis(redis, service, user.id);
                        const token = generateTokenFromSecret(service.secret);
                        return {
                            label: service.label,
                            token,
                            id: service.id,
                        };
                    });

                    return await Promise.all(record);
                }

                const redisServices = (await redis.lrange(
                    `services-user-${user.id}`,
                    0,
                    -1,
                )) as Promise<{
                    label: string;
                    secret: string;
                    id: string;
                    created_at: string;
                }>[];

                const resolvedResponse = await Promise.all(redisServices);

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
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Failed to list services.",
                });
            }
        }),
    });
