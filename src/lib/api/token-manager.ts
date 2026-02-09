/**
 * Token Manager
 * Next Auth session'dan token yönetimi
 * Client-side only
 */

import { getSession } from "next-auth/react";
import { TokenRefreshError } from "./errors";
import type { Session } from "next-auth";

export interface ITokenManager {
    getAccessToken(): Promise<string | null>;
    refreshToken(): Promise<string | null>;
}

export class TokenManager implements ITokenManager {
    private refreshPromise: Promise<string | null> | null = null;

    async getAccessToken(): Promise<string | null> {
        if (typeof window === "undefined") {
            return null;
        }
        try {
            const session = await getSession();
            return (session as Session)?.accessToken || null;
        } catch (error) {
            console.error("[TokenManager] getAccessToken error:", error);
            return null;
        }
    }

    async refreshToken(): Promise<string | null> {
        if (typeof window === "undefined") {
            throw new TokenRefreshError("Token refresh server-side yapılamaz");
        }
        if (this.refreshPromise) {
            return this.refreshPromise;
        }
        this.refreshPromise = this._doRefreshToken();
        try {
            return await this.refreshPromise;
        } finally {
            this.refreshPromise = null;
        }
    }

    private async _doRefreshToken(): Promise<string | null> {
        try {
            const session = await getSession();
            if (!session) {
                throw new TokenRefreshError("Session bulunamadı");
            }
            const accessToken = (session as Session)?.accessToken;
            if (!accessToken) {
                throw new TokenRefreshError("Token bulunamadı");
            }
            if ((session as Session)?.error) {
                throw new TokenRefreshError(`Token yenileme hatası: ${(session as Session).error}`);
            }
            return accessToken;
        } catch (error) {
            if (error instanceof TokenRefreshError) throw error;
            throw new TokenRefreshError("Token yenileme başarısız");
        }
    }
}

export const tokenManager: TokenManager | null =
    typeof window !== "undefined" ? new TokenManager() : null;
