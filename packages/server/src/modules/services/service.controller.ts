import { implement, ORPCError } from "@orpc/server";
import { serviceContract } from "@/modules/services/service.contract";
import { db } from "@repo/database/index";
import { service } from "@repo/database/db/schema";
import { generateTokenFromSecret } from "@/helpers/generate-token-from-secret";
import { redis } from "@/upstash/upstash";
import { fetchServiceFromDB } from "@/helpers/fetch-services.from-db";
import type { Session, User } from "@/types/index";

export const serviceRouter = implement(serviceContract)
    .$context<{
        user: User;
        session: Session;
    }>()
    .router({
        create: implement(serviceContract.create)
            .$context<{
                user: User;
                session: Session;
            }>()
            .handler(async ({ input, context }) => {
                try {
                    const userId = context.user.id;
                    const data = { ...input, userId };

                    const [response] = await db
                        .insert(service)
                        .values(data)
                        .returning();

                    // marking service as cache to retrieve fresh database records

                    await redis.set(`service-cache-${userId}`, "stale");

                    await redis.lpush(
                        `index-service-${userId}`,
                        `service-${response!.id}`,
                    );
                } catch (error) {
                    throw new ORPCError("INTERNAL_SERVER_ERROR", {
                        message: "Service creation failed",
                    });
                }
            }),

        list: implement(serviceContract.list)
            .$context<{
                user: User;
                session: Session;
            }>()
            .handler(async ({ context }) => {
                try {
                    const { user } = context;

                    // getting service ids

                    const service_ids = await redis.lrange(
                        `index-service-${user.id}`,
                        0,
                        -1,
                    );

                    const is_record_present = await redis.keys("service-*");

                    const cacheStatus = await redis.get(
                        `service-cache-${user.id}`,
                    );

                    if (cacheStatus === "stale") {
                        const services = await fetchServiceFromDB(user.id);

                        services.map(async (e) => {
                            await redis.set(
                                `service-${e.id}`,
                                JSON.stringify({
                                    id: e.id,
                                    label: e.label,
                                    secret: e.secret,
                                    created_at: e.createdAt,
                                }),
                            );
                        });

                        await redis.del(`service-cache-${user.id}`);

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

                    // redis db is empty

                    if (!is_record_present.length) {
                        const services = await fetchServiceFromDB(user.id);

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

                    // if redis db contains records

                    const response = service_ids.map(async (key) => {
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
                    throw new ORPCError("INTERNAL_SERVER_ERROR", {
                        message: "Failed to list services.",
                    });
                }
            }),
    });
