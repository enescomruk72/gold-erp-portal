import type { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { nextAuthSchema } from "@/features/iam/schemas/auth.schemas";
import { env } from "./env";

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
                        expiresIn:
                            typeof credentials.expiresIn === "string"
                                ? Number(credentials.expiresIn)
                                : Number(credentials.expiresIn || 0),
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

                    const user: User = {
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
                    } as User;

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
                token.id = user.id;
                token.roles = user.roles;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.isActive = user.isActive;
                token.lastLogin = user.lastLogin;
                token.email = user.email;
                token.phone = user.phone;
                token.userName = user.userName;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.cari = { ...user.cari };
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
        maxAge: 24 * 60 * 60, // 24 saat
    },
    pages: {
        signIn: "/auth/login",
    },
    redirectProxyUrl: "/auth/login",
    debug: env.isDevelopment,
    secret: env.authSecret,
    trustHost: true,
} satisfies NextAuthConfig;
