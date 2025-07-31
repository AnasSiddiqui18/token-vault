import { db } from "@repo/database/index";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@repo/database/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    trustedOrigins: ["chrome-extension://lkjdanigodcdlahamhjchakefdlpkjak"],

    emailAndPassword: {
        enabled: true,
    },
});
