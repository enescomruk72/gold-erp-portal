import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

/**
 * Next Auth tip genişletmeleri - B2B Portal
 * Cari bilgisi session'da tutulur (carinin kullanıcıları için)
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
            cari: {
                id: string;
                cariAdi: string;
            };
            isActive: boolean;
            lastLogin: string;
            roles: string[];
        } & Omit<DefaultSession["user"], "emailVerified">;
        accessToken: string;
        error?:
        | "RefreshAccessTokenError"
        | "TokenExpiredError"
        | "VerificationError"
        | "default";
    }

    interface User extends Omit<DefaultUser, "emailVerified"> {
        id: string;
        email: string;
        userName: string;
        firstName: string;
        lastName: string;
        phone?: string;
        cari: {
            id: string;
            cariAdi: string;
        };
        isActive: boolean;
        lastLogin: string;
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        roles: string[];
        accessToken: string;
        refreshToken: string;
        cari?: { id: string; cariAdi: string };
        error?:
        | "RefreshAccessTokenError"
        | "TokenExpiredError"
        | "VerificationError"
        | "default";
    }
}
