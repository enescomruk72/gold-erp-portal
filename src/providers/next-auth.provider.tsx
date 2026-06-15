"use client";

import {
    SessionProvider as NextAuthSessionProvider,
    SessionProviderProps,
} from "next-auth/react";
import { SessionErrorHandler } from "./session-error-handler";

export function NextAuthProvider({ children, ...props }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider
            refetchInterval={0}
            refetchOnWindowFocus={false}
            {...props}
        >
            <SessionErrorHandler>{children}</SessionErrorHandler>
        </NextAuthSessionProvider>
    );
}
