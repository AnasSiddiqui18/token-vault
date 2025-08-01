import { authenticator } from "otplib";

export function generateTokenFromSecret(secret: string) {
    const response = authenticator.generate(secret);
    return response;
}
