import { implement, ORPCError } from "@orpc/server";
import { userContract } from "@/modules/users/users.contract";
import { auth } from "@/auth/auth";
import { APIError } from "better-auth/api";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export const userRouter = implement(userContract).router({
    create: implement(userContract.create).handler(async ({ input }) => {
        try {
            const { email, name, password } = input;
            await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                },
            });

            console.log("user created 🎉 ");
        } catch (error) {
            if (error instanceof APIError) {
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: error.message,
                });
            }

            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Signup failed",
            });
        }
    }),

    login: implement(userContract.login).handler(async ({ input, context }) => {
        try {
            const { email, password } = input;
            const { hono_context } = context as {
                hono_context: Context;
            };

            const response = await auth.api.signInEmail({
                body: {
                    email,
                    password,
                },
            });

            return { token: response.token };
        } catch (error) {
            if (error instanceof APIError) {
                console.log("error in signin", error);

                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: error.message,
                });
            }

            console.log("login failed", error);

            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "Login failed",
            });
        }
    }),
});
