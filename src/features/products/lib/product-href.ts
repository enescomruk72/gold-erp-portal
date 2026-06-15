import { VARIANT_QUERY_PARAM } from '@/features/products/lib/product-slug';

export type ProductPublicHrefOptions = {
    /** Liste sayfası query string'i (`cid=5&f=81,46`) — `?` olmadan */
    listingQuery?: string | null;
    vParam?: string | null;
};

export function buildProductDetailQueryString(options: ProductPublicHrefOptions): string {
    const params = new URLSearchParams();
    if (options.listingQuery) {
        const listing = new URLSearchParams(options.listingQuery);
        listing.forEach((value, key) => params.append(key, value));
    }
    if (options.vParam) {
        params.set(VARIANT_QUERY_PARAM, options.vParam);
    }
    return params.toString();
}

function appendQueryString(path: string, query: string): string {
    if (!query) return path;
    return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

/** B2B katalog ürün detay path — public_slug (Trendyol -p- kalıbı) */
export function productPublicHref(
    publicSlug: string | null | undefined,
    fallbackId?: string,
    options?: ProductPublicHrefOptions,
): string {
    let path: string;
    if (publicSlug?.trim()) {
        path = `/p/${encodeURIComponent(publicSlug.trim())}`;
    } else if (fallbackId) {
        path = `/p/id/${fallbackId}`;
    } else {
        path = '/products';
    }

    const query = buildProductDetailQueryString(options ?? {});
    return appendQueryString(path, query);
}
