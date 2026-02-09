/**
 * B2B Portal - Filtre seçenekleri (kategori, marka, materyal)
 */

import { useApiQuery } from "@/lib/api/hooks";

export interface CategoryOption {
    id: number;
    kategoriKodu: string;
    kategoriAdi: string;
}

export interface BrandOption {
    id: number;
    markaAdi: string;
}

export interface MateryalOption {
    id: number;
    materyalAdi: string;
}

export function useGetCategories() {
    const query = useApiQuery<CategoryOption[]>("/v1/b2b/categories", {
        queryKey: ["b2b", "categories"],
        apiOptions: {
            params: { page: 1, limit: 500, aktif: true },
        },
        useProxy: true,
    });
    const data = (query.data?.data ?? []) as CategoryOption[];
    return { ...query, data };
}

export function useGetBrands() {
    const query = useApiQuery<BrandOption[]>("/v1/b2b/brands", {
        queryKey: ["b2b", "brands"],
        apiOptions: {
            params: { page: 1, limit: 500, aktif: true },
        },
        useProxy: true,
    });
    const data = (query.data?.data ?? []) as BrandOption[];
    return { ...query, data };
}

export function useGetMateryaller() {
    const query = useApiQuery<MateryalOption[]>("/v1/b2b/materyaller", {
        queryKey: ["b2b", "materyaller"],
        apiOptions: {
            params: { aktif: true },
        },
        useProxy: true,
    });
    const data = (query.data?.data ?? []) as MateryalOption[];
    return { ...query, data };
}
