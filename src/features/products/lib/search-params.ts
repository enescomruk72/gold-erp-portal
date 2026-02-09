/**
 * B2B Portal - Ürün listesi URL state (nuqs)
 */

import {
    parseAsInteger,
    parseAsString,
    useQueryState,
} from "nuqs";

const PREFIX = "products";

export type ProductsSortBy = "urunAdi" | "createdAt" | "satisFiyati";

export interface UseProductsSearchParamsReturn {
    page: number;
    setPage: (v: number | ((prev: number) => number)) => void;
    limit: number;
    setLimit: (v: number | ((prev: number) => number)) => void;
    search: string;
    setSearch: (v: string | ((prev: string) => string)) => void;
    sortBy: ProductsSortBy;
    setSortBy: (v: string | ((prev: string) => string)) => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (v: string | ((prev: string) => string)) => void;
    sortValue: string;
    setSortValue: (value: string) => void;
    kategoriId: number | undefined;
    setKategoriId: (v: number | ((prev: number) => number)) => void;
    markaId: number | undefined;
    setMarkaId: (v: number | ((prev: number) => number)) => void;
    aktif: boolean | undefined;
    aktifRaw: string;
    setAktif: (v: string | ((prev: string) => string)) => void;
    activeFilterCount: number;
}

export const PRODUCTS_SORT_OPTIONS = [
    { value: "urunAdi:asc", label: "Ürün Adı (A-Z)" },
    { value: "urunAdi:desc", label: "Ürün Adı (Z-A)" },
    { value: "satisFiyati:asc", label: "Fiyat (Düşük-Yüksek)" },
    { value: "satisFiyati:desc", label: "Fiyat (Yüksek-Düşük)" },
    { value: "createdAt:desc", label: "En Yeni" },
    { value: "createdAt:asc", label: "En Eski" },
] as const;

export const PRODUCTS_PAGINATION_LIMITS = [12, 24, 48, 96] as const;

export function useProductsSearchParams(): UseProductsSearchParamsReturn {
    const [page, setPage] = useQueryState(
        `${PREFIX}_page`,
        parseAsInteger.withDefault(1)
    );
    const [limit, setLimit] = useQueryState(
        `${PREFIX}_limit`,
        parseAsInteger.withDefault(20)
    );
    const [search, setSearch] = useQueryState(
        `${PREFIX}_search`,
        parseAsString.withDefault("")
    );
    const [sortBy, setSortBy] = useQueryState(
        `${PREFIX}_sortBy`,
        parseAsString.withDefault("urunAdi")
    );
    const [sortOrder, setSortOrder] = useQueryState(
        `${PREFIX}_sortOrder`,
        parseAsString.withDefault("asc")
    );
    const [kategoriId, setKategoriId] = useQueryState(
        `${PREFIX}_kategoriId`,
        parseAsInteger.withDefault(0)
    );
    const [markaId, setMarkaId] = useQueryState(
        `${PREFIX}_markaId`,
        parseAsInteger.withDefault(0)
    );
    const [aktif, setAktif] = useQueryState(
        `${PREFIX}_aktif`,
        parseAsString.withDefault("")
    );

    const sortValue = `${sortBy}:${sortOrder}`;
    const setSortValue = (value: string) => {
        const [by, order] = value.split(":");
        setSortBy(by || "urunAdi");
        setSortOrder((order as "asc" | "desc") || "asc");
    };

    const aktifFilter = aktif === "" ? undefined : aktif === "true";

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        sortBy: sortBy as ProductsSortBy,
        setSortBy,
        sortOrder: sortOrder as "asc" | "desc",
        setSortOrder,
        sortValue,
        setSortValue,
        kategoriId: kategoriId || undefined,
        setKategoriId,
        markaId: markaId || undefined,
        setMarkaId,
        aktif: aktifFilter,
        aktifRaw: aktif,
        setAktif,
        activeFilterCount: [kategoriId > 0, markaId > 0, aktif !== ""].filter(
            Boolean
        ).length,
    };
}
