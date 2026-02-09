/**
 * Environment Configuration
 * Client ve server environment variables'ları birleştirir
 */

import { clientEnv } from "./client.env.config";

let serverEnv: (typeof import("./server.env.config"))["serverEnv"] | undefined;

try {
    if (typeof window === "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serverEnvModule = require("./server.env.config");
        serverEnv = serverEnvModule.serverEnv;
    }
} catch (error) {
    if (typeof window !== "undefined") {
        // Client-side'da normal
    } else {
        throw error;
    }
}

export const env = {
    ...clientEnv,
    app: serverEnv?.app,
    port: serverEnv?.port,
    authSecret: serverEnv?.authSecret,
    nextauthUrl: serverEnv?.nextauthUrl,
} as {
    nodeEnv: string;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    nextPublicBaseUrl: string;
    nextPublicApiUrl: string;
    app?: string;
    port?: number;
    authSecret?: string;
    nextauthUrl?: string;
};
