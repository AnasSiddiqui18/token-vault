import { DrizzleQueryError } from "drizzle-orm/errors";

export function isDatabaseError(
    error: unknown,
): error is DrizzleQueryError & { cause: { code: string } } {
    return (
        error instanceof DrizzleQueryError &&
        typeof error.cause === "object" &&
        error.cause !== null &&
        "code" in error.cause
    );
}
