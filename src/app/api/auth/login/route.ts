import { NextResponse } from "next/server";
import { loginSchema } from "@/features/iam/schemas/auth.schemas";
import { env } from "@/config/env";
import { signIn } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        let requestBody: unknown;
        try {
            const bodyText = await request.text();
            if (!bodyText || bodyText.trim() === "") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "ValidationError",
                        message: "Request body is required",
                    },
                    { status: 400 }
                );
            }
            requestBody = JSON.parse(bodyText);
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: "ValidationError",
                    message: "Invalid JSON format",
                },
                { status: 400 }
            );
        }

        const validatedRequest = loginSchema.safeParse(requestBody);
        if (!validatedRequest.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ValidationError",
                    message: "Validation failed",
                    details: validatedRequest.error.issues,
                },
                { status: 400 }
            );
        }

        const { userNameOrEmail, password } = validatedRequest.data;

        const response = await fetch(`${env.nextPublicApiUrl}/b2b/login`, {
            method: "POST",
            body: JSON.stringify({ userNameOrEmail, password }),
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!responseData.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: responseData.type ?? responseData.error,
                    message: responseData.message,
                },
                { status: response.status >= 400 ? response.status : 400 }
            );
        }

        const { user, accessToken, refreshToken } = responseData.data;

        const cariObj = {
            id: String(user.cari.id),
            cariAdi: String(user.cari.cariAdi),
        };

        const nextAuthUser: Record<string, unknown> = {
            id: String(user.id),
            userName: String(user.userName),
            firstName: String(user.firstName),
            lastName: String(user.lastName),
            email: String(user.email),
            phone: String(user.phone || ""),
            cari: JSON.stringify(cariObj),
            isActive: String(Boolean(user.isActive)),
            lastLogin: String(user.lastLogin || ""),
            roles: JSON.stringify(
                Array.isArray(user.roles) ? user.roles.map((r: unknown) => String(r)) : []
            ),
            accessToken: String(accessToken),
            refreshToken: String(refreshToken),
            expiresIn: String(user.expiresIn || 0),
        };

        const nextAuthSession = await signIn("credentials", {
            redirectTo: "/",
            ...nextAuthUser,
            redirect: false,
        });

        if (nextAuthSession?.error) {
            return NextResponse.json(
                {
                    success: false,
                    error: nextAuthSession.error,
                    message:
                        typeof nextAuthSession.error === "string"
                            ? nextAuthSession.error
                            : "Authentication failed",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: responseData.message });
    } catch (error) {
        console.error("LoginError", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
                message: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
