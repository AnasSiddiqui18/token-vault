import { router } from "./router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { ORPCError } from "@orpc/client";
import { _auth } from "./auth/auth";
import type { Env, Session, User } from "./types/index";
import { cors } from "hono/cors";

const app = new Hono<{
    Bindings: Env;
    Variables: {
        user: User | null;
        session: Session | null;
    };
}>();

const handler = new OpenAPIHandler(router);

app.use(
    "*",
    cors({
        origin: "chrome-extension://pndhdgalmfifjidaboddbjepcjkmmaea",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    const { auth } = _auth(c.env);
    return auth.handler(c.req.raw);
});

app.get("/", (c) => {
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
            { status: 404 },
        );
    }

    return response;
});

export default app;
