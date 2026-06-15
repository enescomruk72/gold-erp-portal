import type { NextAuthConfig, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { nextAuthSchema } from "@/features/iam/schemas/auth.schemas";
import { env } from "./env";

type AuthUser = User & {
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
};

export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            authorize: async (
                credentials: Partial<Record<string, unknown>>
            ): Promise<User | null> => {
                try {
                    if (!credentials?.id) return null;

                    const accessTokenExpiresIn = Number(
                        credentials.accessTokenExpiresIn
                    );
                    const refreshTokenExpiresIn = Number(
                        credentials.refreshTokenExpiresIn
                    );

                    const normalizedCredentials = {
                        id: String(credentials.id),
                        userName: String(credentials.userName || ""),
                        firstName: String(credentials.firstName || ""),
                        lastName: String(credentials.lastName || ""),
                        email: String(credentials.email || ""),
                        phone: String(credentials.phone || ""),
                        cari:
                            typeof credentials.cari === "string"
                                ? JSON.parse(credentials.cari)
                                : typeof credentials.cari === "object" &&
                                    credentials.cari !== null
                                  ? credentials.cari
                                  : { id: "", cariAdi: "" },
                        isActive:
                            typeof credentials.isActive === "string"
                                ? credentials.isActive === "true"
                                : Boolean(credentials.isActive),
                        lastLogin: String(credentials.lastLogin || ""),
                        roles:
                            typeof credentials.roles === "string"
                                ? JSON.parse(credentials.roles)
                                : Array.isArray(credentials.roles)
                                  ? credentials.roles
                                  : [],
                        accessToken: String(credentials.accessToken || ""),
                        refreshToken: String(credentials.refreshToken || ""),
                        accessTokenExpiresIn,
                        refreshTokenExpiresIn,
                    };

                    const validatedCredentials =
                        nextAuthSchema.safeParse(normalizedCredentials);
                    if (!validatedCredentials.success) {
                        console.error(
                            "AuthorizeError",
                            validatedCredentials.error
                        );
                        return null;
                    }

                    const { data } = validatedCredentials;

                    const user: AuthUser = {
                        id: data.id,
                        userName: data.userName,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        cari: {
                            id: data.cari.id,
                            cariAdi: data.cari.cariAdi,
                        },
                        isActive: data.isActive,
                        lastLogin: data.lastLogin,
                        roles: Array.isArray(data.roles) ? data.roles : [],
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        accessTokenExpiresIn: data.accessTokenExpiresIn,
                        refreshTokenExpiresIn: data.refreshTokenExpiresIn,
                    };

                    return user;
                } catch (error) {
                    console.error("AuthorizeError", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const authUser = user as AuthUser;
                token.id = authUser.id;
                token.roles = authUser.roles;
                token.accessToken = authUser.accessToken;
                token.refreshToken = authUser.refreshToken;
                token.isActive = authUser.isActive;
                token.lastLogin = authUser.lastLogin;
                token.email = authUser.email;
                token.phone = authUser.phone;
                token.userName = authUser.userName;
                token.firstName = authUser.firstName;
                token.lastName = authUser.lastName;
                token.cari = { ...authUser.cari };
                token.accessTokenExpires =
                    Date.now() + authUser.accessTokenExpiresIn * 1000;
                token.refreshTokenExpires =
                    Date.now() + authUser.refreshTokenExpiresIn * 1000;
                token.error = undefined;
                return token;
            }

            if (
                token.refreshTokenExpires &&
                Date.now() >= (token.refreshTokenExpires as number)
            ) {
                return { ...token, error: "RefreshAccessTokenError" };
            }

            if (
                token.accessTokenExpires &&
                Date.now() < (token.accessTokenExpires as number) - 10_000
            ) {
                return token;
            }

            if (token.refreshToken) {
                return refreshAccessToken(token);
            }

            return token;
        },
        async session({ session, token }) {
            const user: User = {
                id: token.id,
                userName: token.userName as string,
                firstName: token.firstName as string,
                lastName: token.lastName as string,
                email: token.email as string,
                phone: token.phone as string,
                isActive: token.isActive as boolean,
                lastLogin: token.lastLogin as string,
                roles: token.roles as string[],
                refreshToken: token.refreshToken as string,
                cari: token.cari as { id: string; cariAdi: string },
            } as User;
            session.accessToken = token.accessToken as string;
            session.user = user as User & { emailVerified: Date };
            if (token.error) session.error = token.error;
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    session: {
        strategy: "jwt",
        /** Cookie üst sınırı; gerçek oturum süresi backend refreshTokenExpiresIn ile belirlenir */
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/auth/login",
    },
    debug: env.isDevelopment,
    secret: env.authSecret,
    trustHost: true,
} satisfies NextAuthConfig;

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const response = await fetch(
            `${env.nextPublicApiUrl}/b2b/refresh-token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: token.refreshToken }),
            }
        );

        const data = await response.json();
        if (!response.ok || !data?.data?.accessToken) {
            throw new Error(data?.message ?? "Refresh failed");
        }

        const { accessToken, refreshToken: newRefresh, expiresIn } = data.data;
        if (typeof expiresIn !== "number" || expiresIn <= 0) {
            throw new Error("Refresh response missing expiresIn");
        }

        return {
            ...token,
            accessToken,
            refreshToken: newRefresh ?? token.refreshToken,
            accessTokenExpires: Date.now() + expiresIn * 1000,
            error: undefined,
        };
    } catch (error) {
        console.error("RefreshAccessTokenError", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}
