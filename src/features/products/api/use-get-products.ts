/**
 * B2B Portal - Ürün listesi
 * GET /b2b/products (proxy ile /api/proxy/v1/b2b/products)
 */

import { useApiQuery } from "@/lib/api/hooks";
import type { PaginationMetadata } from "@/lib/api/types";
import { productsQueryKeys } from "./query-keys";
import type { IProductDTO } from "../types";

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: "urunAdi" | "createdAt";
    sortOrder?: "asc" | "desc";
    kategoriId?: number;
    markaId?: number;
    aktif?: boolean;
}

export interface GetProductsResult {
    data: IProductDTO[];
    pagination: PaginationMetadata | null;
}

export function useGetProducts(params?: GetProductsParams) {
    const query = useApiQuery<IProductDTO[]>("/v1/b2b/products", {
        queryKey: productsQueryKeys.list(params),
        apiOptions: {
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 20,
                ...(params?.search != null &&
                    params.search !== "" && { search: params.search }),
                sortBy: params?.sortBy ?? "createdAt",
                sortOrder: params?.sortOrder ?? "desc",
                ...(params?.kategoriId != null &&
                    params.kategoriId > 0 && { kategoriId: params.kategoriId }),
                ...(params?.markaId != null &&
                    params.markaId > 0 && { markaId: params.markaId }),
                ...(params?.aktif !== undefined && { aktif: params.aktif }),
            },
        },
        useProxy: true,
    });

    const data = (query.data?.data ?? []) as IProductDTO[];
    const pagination = (query.data?.metadata?.pagination ??
        null) as PaginationMetadata | null;

    return {
        ...query,
        data,
        pagination,
    } as typeof query & {
        data: IProductDTO[];
        pagination: PaginationMetadata | null;
    };
}
