/**
 * Kategori / filtre URL'leri — kısa query key'leri (listing-search-params ile uyumlu)
 */

import { LISTING_SEARCH_PARAM_KEYS } from '@/features/products/lib/listing-search-params';

export function categoryListHref(kategoriId: number): string {
    return `/products?${LISTING_SEARCH_PARAM_KEYS.kategoriId}=${kategoriId}`;
}

export function categoryIdentifierHref(
    kategoriId: number,
    _ozellikId: number,
    degerId: number
): string {
    const params = new URLSearchParams();
    params.set(LISTING_SEARCH_PARAM_KEYS.kategoriId, String(kategoriId));
    params.append(LISTING_SEARCH_PARAM_KEYS.degerIds, String(degerId));
    return `/products?${params.toString()}`;
}
