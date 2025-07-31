import { z } from "zod";

const email = z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(128, "Email cannot exceed 127 characters.");

const password = z
    .string()
    .min(6, { message: "Password must be at least of 6 characters." })
    .max(128, "Password cannot exceed 128 characters.");

export const signin_schema = z.object({
    email: email,
    password: password,
});

export const signup_schema = z.object({
    name: z.string().min(3).max(15, {
        message: "To long",
    }),
    email: email,
    password: password,
});
