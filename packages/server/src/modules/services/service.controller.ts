import { implement, ORPCError } from "@orpc/server";
import { serviceContract } from "@/modules/services/service.contract";
import * as schema from "@repo/database/db/schema";
import type { ContextWithUser, InitialContext } from "@/types/index";
import { authMiddleware } from "@/middlewares/auth.middleware";

const os = implement(serviceContract).$context<ContextWithUser>();

const mockServices = [
    {
        id: "1f3c9f22-bf11-4d49-bb7c-6c47f8d8a001",
        label: "AWS",
        token: "AKIAIOSFODNN7EXAMPLE",
    },
    {
        id: "2a5b0f88-cf13-4e61-bc6b-9a8f7d8b3002",
        label: "Netflix",
        token: "NF-SEC-29af72cdd17e3a9d",
        user_id: "a82e1f55-4c90-4a4d-892d-13e8d9f20002",
        created_at: "2025-01-12T08:45:00Z",
        updated_at: "2025-08-15T09:25:00Z",
    },
    {
        id: "3b9a7c55-af66-4a3f-bc31-7baf0e2f0003",
        label: "Spotify",
        token: "SPOT-KEY-87cfd12e98bc1234",
        user_id: "c91a23a4-97d1-4a38-9c4f-34a5d9e90003",
        created_at: "2025-03-04T14:10:00Z",
        updated_at: "2025-08-20T12:11:00Z",
    },
    {
        id: "4c6d88f1-9c55-4b6a-8c61-45fbe7a90004",
        label: "Google Cloud",
        token: "GCP-KEY-1298adbc2398efaa",
        user_id: "d71b87e2-45c6-4a89-b8f2-9182f7a60004",
        created_at: "2025-05-18T16:30:00Z",
        updated_at: "2025-08-25T08:05:00Z",
    },
    {
        id: "5d8f32aa-8a22-4e1a-98ab-18f92c7c0005",
        label: "Slack",
        token: "SLACK-TOKEN-9981dca92d",
    },
];

export const serviceRouter = implement(serviceContract)
    .$context<InitialContext>()
    .use(authMiddleware)
    .router({
        create: os.create.handler(async ({ input, context }) => {
            try {
                const { user, db } = context;
                const userId = user.id;
                const data = { ...input, userId };

                const [service] = await db
                    .insert(schema.service)
                    .values(data)
                    .returning();
            } catch (error) {
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Service creation failed",
                });
            }
        }),

        list: os.list.handler(async ({ context }) => {
            try {
                return mockServices;
            } catch (error) {
                console.log("catch runs");

                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "Failed to sdsdsdsdsdsdlist services.",
                });
            }
        }),
    });
