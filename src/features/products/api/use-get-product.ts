/**
 * B2B Portal - Ürün detayı
 * GET /b2b/products/:id (master image URL'leri ile)
 */

import { useApiQuery } from "@/lib/api/hooks";
import { productsQueryKeys } from "./query-keys";
import type { IProductDTO } from "../types";

export function useGetProduct(id: string | null, enabled: boolean = true) {
    return useApiQuery<IProductDTO>(`/b2b/products/${id}`, {
        queryKey: productsQueryKeys.detail(id ?? "unknown"),
        queryOptions: {
            enabled: Boolean(id) && enabled,
        },
        useProxy: false,
    });
}
