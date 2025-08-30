import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@repo/database/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { db, Env, TBetterAuth } from "@/types/index";

type TAuth = {
    auth: TBetterAuth;
    db: db;
};

export const _auth = (env: Env): TAuth => {
    const sql = neon(env.POSTGRES_URL);
    const db = drizzle(sql, { schema });

    return {
        auth: betterAuth({
            database: drizzleAdapter(db, { provider: "pg", schema }),
            session: { freshAge: 0 },
            advanced: {
                cookies: {
                    session_token: {
                        name: "session",
                        attributes: {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        },
                    },
                },
            },
            trustedOrigins: [
                "chrome-extension://pndhdgalmfifjidaboddbjepcjkmmaea",
            ],
            emailAndPassword: {
                enabled: true,
            },
        }),
        db,
    };
};
