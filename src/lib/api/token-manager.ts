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
    invalidateCache(): void;
}

const SESSION_CACHE_TTL_MS = 2000;

export class TokenManager implements ITokenManager {
    private refreshPromise: Promise<string | null> | null = null;
    private getSessionPromise: Promise<Session | null> | null = null;
    private sessionCache: { session: Session | null; expiresAt: number } | null =
        null;

    invalidateCache(): void {
        this.sessionCache = null;
        this.getSessionPromise = null;
    }

    async getAccessToken(): Promise<string | null> {
        if (typeof window === "undefined") {
            return null;
        }

        try {
            const now = Date.now();
            if (this.sessionCache && now < this.sessionCache.expiresAt) {
                const cached = this.sessionCache.session as Session | null;
                if (cached?.error) return null;
                return cached?.accessToken ?? null;
            }

            if (!this.getSessionPromise) {
                this.getSessionPromise = getSession()
                    .then((session) => {
                        this.sessionCache = {
                            session: session as Session | null,
                            expiresAt: Date.now() + SESSION_CACHE_TTL_MS,
                        };
                        this.getSessionPromise = null;
                        return session as Session | null;
                    })
                    .catch((err) => {
                        this.getSessionPromise = null;
                        throw err;
                    });
            }

            const session = await this.getSessionPromise;
            if ((session as Session)?.error) return null;
            return (session as Session)?.accessToken ?? null;
        } catch (error) {
            console.error("[TokenManager] getAccessToken error:", error);
            this.getSessionPromise = null;
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
            this.invalidateCache();
            const session = await getSession();

            if (!session) {
                throw new TokenRefreshError("Session bulunamadı");
            }

            if ((session as Session)?.error) {
                throw new TokenRefreshError(
                    `Token yenileme hatası: ${(session as Session).error}`
                );
            }

            const accessToken = (session as Session)?.accessToken;
            if (!accessToken) {
                throw new TokenRefreshError("Token bulunamadı");
            }

            this.sessionCache = {
                session: session as Session,
                expiresAt: Date.now() + SESSION_CACHE_TTL_MS,
            };

            return accessToken;
        } catch (error) {
            if (error instanceof TokenRefreshError) throw error;
            throw new TokenRefreshError("Token yenileme başarısız");
        }
    }
}

export const tokenManager: TokenManager | null =
    typeof window !== "undefined" ? new TokenManager() : null;
