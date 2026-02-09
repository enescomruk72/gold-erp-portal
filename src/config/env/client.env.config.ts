import { z } from "zod";

/**
 * Client-side environment variables (NEXT_PUBLIC_* prefix)
 * Bu değişkenler hem client hem server tarafında erişilebilir
 */
const clientEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_BASE_URL: z.url().default("http://localhost:5174"),
    NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3001/api/v1"),
});

const _clientEnv = clientEnvSchema.safeParse(process.env);

if (!_clientEnv.success) {
    console.error("Invalid client environment variables", JSON.stringify(_clientEnv.error.format(), null, 2));
    if (typeof process !== "undefined" && process.exit) {
        process.exit(1);
    }
    throw new Error("Invalid client environment variables");
}

export const clientEnv = {
    nodeEnv: _clientEnv.data.NODE_ENV,
    isDevelopment: _clientEnv.data.NODE_ENV === "development",
    isProduction: _clientEnv.data.NODE_ENV === "production",
    isTest: _clientEnv.data.NODE_ENV === "test",
    nextPublicBaseUrl: _clientEnv.data.NEXT_PUBLIC_BASE_URL,
    nextPublicApiUrl: _clientEnv.data.NEXT_PUBLIC_API_URL,
} as const;
