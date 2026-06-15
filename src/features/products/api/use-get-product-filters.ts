import { useApiQuery } from '@/lib/api/hooks';
import { productsQueryKeys } from './query-keys';

export type ProductFilterGroupKind =
    | 'identifier'
    | 'varianter'
    | 'slicer'
    | 'attribute';

export interface ProductFilterDeger {
    id: number;
    deger: string;
}

export interface ProductFilterGroup {
    kind: ProductFilterGroupKind;
    ozellikId: number;
    ozellikAdi: string;
    degerler: ProductFilterDeger[];
}

export interface ProductListingFilters {
    kategori: { id: number; kategoriKodu: string; kategoriAdi: string };
    breadcrumb: Array<{ id: number; kategoriAdi: string }>;
    filterGroups: ProductFilterGroup[];
    gramRange: { min: number; max: number } | null;
}

export function useGetProductFilters(kategoriId: number | null | undefined) {
    const enabled = kategoriId != null && kategoriId > 0;

    const query = useApiQuery<ProductListingFilters>('/v1/b2b/products/filters', {
        queryKey: productsQueryKeys.filters(kategoriId ?? 0),
        apiOptions: {
            params: { kategoriId: kategoriId ?? 0 },
        },
        useProxy: true,
        queryOptions: { enabled },
    });

    return {
        ...query,
        filters: (query.data?.data ?? null) as ProductListingFilters | null,
    };
}
