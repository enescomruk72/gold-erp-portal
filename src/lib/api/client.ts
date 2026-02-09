/**
 * API Client
 * Fetch wrapper with Next Auth integration, token refresh, and error handling
 */

import { env } from "@/config/env";
import { tokenManager, type TokenManager } from "./token-manager";
import { ApiClientError, NetworkError, TokenRefreshError } from "./errors";
import type { ApiResponse, RequestOptions, FetchMode, ApiError } from "./types";

export class ApiClient {
    private baseUrl: string;
    private tokenManagerInstance: TokenManager | null;

    constructor(
        mode: FetchMode = "direct",
        tokenManagerInstance: TokenManager | null =
            typeof window !== "undefined" ? tokenManager : null
    ) {
        this.tokenManagerInstance = tokenManagerInstance;
        this.baseUrl =
            mode === "proxy" ? "/api/proxy" : env.nextPublicApiUrl;
    }

    async fetch<T = unknown>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            body,
            params,
            useProxy = false,
            requiresAuth = true,
            contentType = "application/json",
            headers = {},
            ...fetchOptions
        } = options;

        const url = this.buildUrl(endpoint, params, useProxy);

        const requestHeaders: HeadersInit = {
            "Content-Type": contentType,
            ...headers,
        };

        if (requiresAuth && this.tokenManagerInstance) {
            const token = await this.tokenManagerInstance.getAccessToken();
            if (token) {
                (requestHeaders as Record<string, string>)["Authorization"] =
                    `Bearer ${token}`;
            }
        }

        let requestBody: string | undefined;
        if (body !== undefined) {
            if (contentType === "application/json") {
                requestBody = JSON.stringify(body);
            } else if (body instanceof FormData) {
                requestBody = body as unknown as string;
                delete (requestHeaders as Record<string, string>)["Content-Type"];
            } else {
                requestBody = body as string;
            }
        }

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                method: fetchOptions.method || "GET",
                headers: requestHeaders,
                body: requestBody,
            });

            const data = await this.parseResponse<T>(response);

            if (response.status === 401 && requiresAuth) {
                return await this.retryWithRefresh<T>(endpoint, options);
            }

            if (!data.success) {
                throw new ApiClientError(data as ApiError, data.message);
            }

            return data;
        } catch (error) {
            if (
                error instanceof ApiClientError ||
                error instanceof TokenRefreshError
            ) {
                throw error;
            }
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new NetworkError("Bağlantı hatası - sunucuya ulaşılamadı", error as Error);
            }
            throw new NetworkError("Bilinmeyen bir hata oluştu", error as Error);
        }
    }

    async get<T = unknown>(
        endpoint: string,
        options?: Omit<RequestOptions, "method" | "body">
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "method" | "body">
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { ...options, method: "POST", body });
    }

    async put<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "method" | "body">
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { ...options, method: "PUT", body });
    }

    async patch<T = unknown>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "method" | "body">
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { ...options, method: "PATCH", body });
    }

    async delete<T = unknown>(
        endpoint: string,
        options?: Omit<RequestOptions, "method" | "body">
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
    }

    private buildUrl(
        endpoint: string,
        params?: RequestOptions["params"],
        useProxy?: boolean
): string {
        const normalizedEndpoint = endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;
        let url: string;
        if (useProxy) {
            url = `/api/proxy${normalizedEndpoint}`;
        } else {
            url = `${this.baseUrl}${normalizedEndpoint}`;
        }
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) url += `?${queryString}`;
        }
        return url;
    }

    private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return (await response.json()) as ApiResponse<T>;
        }
        const text = await response.text();
        if (!text) {
            return {
                success: response.ok,
                message: response.statusText || "OK",
                data: null,
                statusCode: response.status,
                type: response.ok ? "SUCCESS" : "ERROR",
                timestamp: new Date().toISOString(),
                requestId: "",
            };
        }
        try {
            return JSON.parse(text) as ApiResponse<T>;
        } catch {
            return {
                success: response.ok,
                message: text,
                data: null,
                statusCode: response.status,
                type: response.ok ? "SUCCESS" : "ERROR",
                timestamp: new Date().toISOString(),
                requestId: "",
            };
        }
    }

    private async retryWithRefresh<T>(
        endpoint: string,
        options: RequestOptions
    ): Promise<ApiResponse<T>> {
        if (!this.tokenManagerInstance) {
            throw new ApiClientError({
                success: false,
                message: "Oturum süresi doldu, lütfen tekrar giriş yapın",
                data: null,
                statusCode: 401,
                type: "UNAUTHORIZED",
                timestamp: new Date().toISOString(),
                requestId: "",
            });
        }
        try {
            const newToken = await this.tokenManagerInstance.refreshToken();
            if (!newToken) throw new TokenRefreshError("Token yenileme başarısız");
            return await this.fetch<T>(endpoint, {
                ...options,
                requiresAuth: true,
            });
        } catch (error) {
            if (error instanceof TokenRefreshError) throw error;
            throw new ApiClientError({
                success: false,
                message: "Oturum süresi doldu, lütfen tekrar giriş yapın",
                data: null,
                statusCode: 401,
                type: "UNAUTHORIZED",
                timestamp: new Date().toISOString(),
                requestId: "",
            });
        }
    }
}

export const apiClient = new ApiClient("direct");
export const proxyApiClient = new ApiClient("proxy");
