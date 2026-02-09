import { z } from "zod";

/**
 * Server-side only environment variables
 * Bu değişkenler sadece server tarafında erişilebilir
 */
const serverEnvSchema = z.object({
    APP_NAME: z.string().default("gold-erp-portal"),
    PORT: z.coerce.number().default(5174),
    NEXTAUTH_SECRET: z
        .string()
        .min(32, { message: "NEXTAUTH_SECRET must be at least 32 characters long" }),
    NEXTAUTH_URL: z.string().url().default("http://localhost:5174"),
});

const isServer = typeof window === "undefined";

if (!isServer) {
    throw new Error("server.env.config.ts should only be imported on the server side");
}

const _serverEnv = serverEnvSchema.safeParse(process.env);

if (!_serverEnv.success) {
    console.error(
        "Invalid server environment variables",
        JSON.stringify(_serverEnv.error.format(), null, 2)
    );
    process.exit(1);
}

export const serverEnv = {
    app: _serverEnv.data.APP_NAME,
    port: _serverEnv.data.PORT,
    authSecret: _serverEnv.data.NEXTAUTH_SECRET,
    nextauthUrl: _serverEnv.data.NEXTAUTH_URL,
} as const;
