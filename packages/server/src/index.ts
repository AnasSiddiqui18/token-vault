import { router } from "./router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { ORPCError } from "@orpc/client";
import { serve } from "@hono/node-server";
import { auth } from "./auth/auth";

const PORT = 3001;
const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null;
    };
}>();

const handler = new OpenAPIHandler(router);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

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

app.use("/api/*", async (c) => {
    const { response } = await handler.handle(c.req.raw, {
        prefix: "/api",
        context: {
            session: c.get("session")!,
            user: c.get("user")!,
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

serve(
    {
        fetch: app.fetch,
        port: PORT,
    },
    (info) => {
        console.log(`Server is running at port ${info.port}`);
    },
);
