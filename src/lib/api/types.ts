/**
 * API Response Types
 * Backend API response formatına uygun type tanımlamaları
 */

import { z } from "zod";

export const apiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.unknown().nullable().optional(),
    statusCode: z.number(),
    type: z.string(),
    timestamp: z.string(),
    requestId: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ApiResponse<T = unknown> = {
    success: boolean;
    message: string;
    data?: T | null;
    statusCode: number;
    type: string;
    timestamp: string;
    requestId: string;
    metadata?: Record<string, unknown> & { pagination?: PaginationMetadata };
};

export interface PaginationMetadata {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}

export interface ApiError {
    success: false;
    message: string;
    data: unknown;
    statusCode: number;
    type: string;
    timestamp: string;
    requestId: string;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined | null>;
    useProxy?: boolean;
    requiresAuth?: boolean;
    contentType?: string;
}

export type FetchMode = "direct" | "proxy";
