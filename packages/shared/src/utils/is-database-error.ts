import { DrizzleQueryError } from "drizzle-orm/errors";

export function isDatabaseError(error: unknown): error is DrizzleQueryError & {
    cause: { code: string };
} {
    return (
        error instanceof DrizzleQueryError &&
        error.cause !== undefined &&
        typeof error.cause === "object" &&
        "code" in error.cause
    );
}
