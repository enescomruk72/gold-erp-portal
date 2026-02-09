/**
 * TanStack Query Hooks for API Client
 */

import { useMemo } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions,
    type QueryKey,
} from "@tanstack/react-query";
import { apiClient, proxyApiClient } from "./index";
import type { ApiResponse, RequestOptions } from "./types";
import type { ApiClientError } from "./errors";

export function useApiQuery<TData = unknown>(
    endpoint: string,
    options?: {
        queryKey?: string[] | QueryKey;
        queryOptions?: Omit<
            UseQueryOptions<ApiResponse<TData>, ApiClientError>,
            "queryKey" | "queryFn"
        >;
        apiOptions?: Omit<RequestOptions, "method" | "body">;
        useProxy?: boolean;
    }
) {
    const { queryKey, queryOptions, apiOptions, useProxy = false } =
        options || {};
    const client = useProxy ? proxyApiClient : apiClient;

    const finalQueryKey = useMemo(() => {
        return queryKey
            ? [
                  ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
                  apiOptions ? JSON.stringify(apiOptions) : null,
              ].filter(Boolean)
            : [
                  endpoint,
                  apiOptions ? JSON.stringify(apiOptions) : null,
              ].filter(Boolean);
    }, [queryKey, endpoint, apiOptions]);

    return useQuery<ApiResponse<TData>, ApiClientError>({
        queryKey: finalQueryKey,
        queryFn: () => client.get<TData>(endpoint, apiOptions),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
    endpoint: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
    options?: {
        mutationOptions?: Omit<
            UseMutationOptions<ApiResponse<TData>, ApiClientError, TVariables>,
            "mutationFn"
        >;
        apiOptions?: Omit<RequestOptions, "method" | "body">;
        useProxy?: boolean;
    }
) {
    const { mutationOptions, apiOptions, useProxy = false } = options || {};
    const client = useProxy ? proxyApiClient : apiClient;

    return useMutation<ApiResponse<TData>, ApiClientError, TVariables>({
        mutationFn: async (variables: TVariables) => {
            if (method === "POST") {
                return client.post<TData>(endpoint, variables, apiOptions);
            } else if (method === "PUT") {
                return client.put<TData>(endpoint, variables, apiOptions);
            } else if (method === "PATCH") {
                return client.patch<TData>(endpoint, variables, apiOptions);
            } else {
                return client.delete<TData>(endpoint, apiOptions);
            }
        },
        ...mutationOptions,
    });
}

export function useInvalidateQuery() {
    const queryClient = useQueryClient();
    return {
        invalidate: (queryKey: string[]) => {
            queryClient.invalidateQueries({ queryKey });
        },
        invalidateAll: () => {
            queryClient.invalidateQueries();
        },
    };
}
