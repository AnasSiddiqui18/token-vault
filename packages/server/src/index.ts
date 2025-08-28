import { router } from "./router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { ORPCError } from "@orpc/client";
import { auth } from "./auth/auth";
import type { Session, User } from "./types/index";

export type Env = {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    POSTGRES_URL: string;
    BETTER_AUTH_SECRET: string;
};

const app = new Hono<{
    Bindings: Env;
    Variables: {
        user: User | null;
        session: Session | null;
    };
}>();

const handler = new OpenAPIHandler(router);

app.use("*", async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
});

app.use("/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.get("/", (c) => {
    console.log("env", { ...c.env });
    return c.json({ status: "Server is working" });
});

app.use("/api/*", async (c) => {
    const { response } = await handler.handle(c.req.raw, {
        prefix: "/api",
        context: {
            req: c.req.raw,
            env: c.env,
        },
    });

    if (!response) {
        return Response.json(
            new ORPCError("NOT_FOUND", {
                message: "Endpoint not found",
            }),
            {
                status: 404,
            },
        );
    }

    return response;
});

export default app;
