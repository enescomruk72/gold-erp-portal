"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const REFRESH_ERRORS = [
    "RefreshAccessTokenError",
    "TokenExpiredError",
    "VerificationError",
] as const;

/**
 * Refresh token süresi dolduğunda veya yenileme başarısız olduğunda
 * oturumu kapatır ve login sayfasına yönlendirir.
 */
export function SessionErrorHandler({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const didRedirect = useRef(false);

    useEffect(() => {
        if (status !== "authenticated" || !session?.error) return;
        if (
            REFRESH_ERRORS.includes(
                session.error as (typeof REFRESH_ERRORS)[number]
            ) &&
            !didRedirect.current
        ) {
            didRedirect.current = true;
            signOut({ callbackUrl: "/auth/login" });
        }
    }, [session?.error, status]);

    return <>{children}</>;
}
