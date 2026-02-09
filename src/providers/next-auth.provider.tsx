"use client";

import {
    SessionProvider as NextAuthSessionProvider,
    SessionProviderProps,
} from "next-auth/react";

export function NextAuthProvider({ children, ...props }: SessionProviderProps) {
    return <NextAuthSessionProvider {...props}>{children}</NextAuthSessionProvider>;
}
