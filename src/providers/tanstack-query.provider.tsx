"use client";

import {
    HydrationBoundary,
    HydrationBoundaryProps,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/config/tanstack-query.config";

export function TanstackQueryProvider({
    children,
    state,
}: HydrationBoundaryProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={state}>
                {children}
            </HydrationBoundary>
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
