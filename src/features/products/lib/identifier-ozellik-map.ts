import type { CategoryNavParent } from '@/features/catalog-navigation';
import type { ProductListingFilters } from '@/features/products/api/use-get-product-filters';

/** kategoriId → identifier özellik id listesi */
export function buildIdentifierOzellikMap(
    navigationParents: CategoryNavParent[],
    filters: ProductListingFilters | null,
    selectedKategoriId: number | null | undefined
): Map<number, number[]> {
    const map = new Map<number, number[]>();

    for (const parent of navigationParents) {
        const parentIds = parent.identifiers.map((i) => i.ozellikId);
        if (parentIds.length > 0) {
            map.set(parent.id, parentIds);
        }
        for (const child of parent.children) {
            const childIds = child.identifiers.map((i) => i.ozellikId);
            if (childIds.length > 0) {
                map.set(child.id, childIds);
            }
        }
    }

    if (filters != null && selectedKategoriId != null) {
        const filterIds = filters.filterGroups
            .filter((g) => g.kind === 'identifier')
            .map((g) => g.ozellikId);
        if (filterIds.length > 0) {
            map.set(selectedKategoriId, filterIds);
        }
    }

    return map;
}

export function getIdentifierOzellikIdsForProduct(
    kategoriId: number,
    map: Map<number, number[]>
): number[] {
    return map.get(kategoriId) ?? [];
}
