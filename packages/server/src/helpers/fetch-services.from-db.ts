import type { db } from "@/types/index";
import { service } from "@repo/database/db/schema";
import { desc, eq } from "@repo/database/exports";

export async function fetchServiceFromDB(user_id: string, db: db) {
    try {
        const services = await db.query.service.findMany({
            where: eq(service.userId, user_id),
            columns: { id: true, label: true, secret: true, createdAt: true },
            orderBy: desc(service.createdAt),
        });

        return services;
    } catch (error) {
        throw new Error("Service fetch failed");
    }
}
