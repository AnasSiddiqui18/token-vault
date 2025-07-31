import type { ContractProcedure } from "@orpc/server";
import { hash, verify } from "argon2";

export const hashPassword = async (password: string) => await hash(password);

export const verifyPassword = async (password_hash: string, password: string) =>
    await verify(password_hash, password);

export function procedureToSchema<
    T extends ContractProcedure<any, any, any, any>,
>(procedure: T) {
    const _input = procedure["~orpc"].inputSchema;
    const _output = procedure["~orpc"].inputSchema;
    return { _input, _output };
}
