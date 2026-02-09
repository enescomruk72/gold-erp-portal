import {
    isServer,
    MutationCache,
    QueryCache,
    QueryClient,
    defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { signOut } from "next-auth/react";

let globalSessionManager: { handleBackendSessionExpired: () => void } | null = null;

export const setGlobalSessionManager = (manager: {
    handleBackendSessionExpired: () => void;
}) => {
    globalSessionManager = manager;
};

function isUnauthorized(error: unknown): boolean {
    const err = error as Error & {
        status?: number;
        statusCode?: number;
        cause?: { status?: number };
        response?: { status?: number };
    };
    if (err?.status === 401 || err?.statusCode === 401) return true;
    if (err?.cause?.status === 401) return true;
    if (err?.response?.status === 401) return true;
    return false;
}

function handleGlobalError(error: unknown) {
    if (isServer) return;
    if (isUnauthorized(error)) {
        if (globalSessionManager) {
            globalSessionManager.handleBackendSessionExpired();
        } else {
            signOut({ callbackUrl: "/auth/login" });
        }
        return;
    }
}

function makeQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => handleGlobalError(error),
        }),
        mutationCache: new MutationCache({
            onError: (error) => handleGlobalError(error),
        }),
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: false,
                throwOnError: false,
            },
            dehydrate: {
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) &&
                    query.state.status === "success",
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
