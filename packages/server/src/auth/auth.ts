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
            trustedOrigins: ["*"],
            advanced: {
                cookies: {
                    session_token: {
                        name: "session",
                        attributes: {
                            maxAge: 60 * 60 * 24 * 365 * 100, // infinite session
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                        },
                    },
                },
            },
            emailAndPassword: {
                enabled: true,
            },
        }),
        db,
    };
};
