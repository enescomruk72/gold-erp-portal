import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// 1. Korumalı Rotalar (Giriş zorunlu)
const protectedRoutes = ["/"];
const publicFilesRegex = /.*\.(png|jpg|jpeg|webp|svg|gif)/;

// 2. Auth Rotaları (Giriş yapmışsa erişilemez)
const authRoutes = ["/auth/login"];

// 3. Public Rotalar (Herkes erişebilir)
const publicRoutes = ["/api/auth", "/_next", "/static", "/favicon.ico"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (publicFilesRegex.test(pathname)) {
        return NextResponse.next();
    }

    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;

    // Giriş sayfasına gelen kullanıcı
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Korumalı rotalar
    const isProtectedRoute =
        protectedRoutes.some((route) => pathname.startsWith(route)) ||
        pathname === "/";

    if (isProtectedRoute) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Hangi yollarda çalışacağını belirle (Optimizasyon için önemli)
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
