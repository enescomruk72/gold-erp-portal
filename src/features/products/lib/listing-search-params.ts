import {
    createSerializer,
    inferParserType,
    parseAsArrayOf,
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    parseAsStringLiteral,
    useQueryStates,
} from 'nuqs';
import { GLOBAL_SEARCH_PARAM_KEYS } from '@/lib/search-params';

/** URL'de görünen B2B ürün listesi parametreleri */
export const LISTING_SEARCH_PARAM_KEYS = {
    ...GLOBAL_SEARCH_PARAM_KEYS,
    kategoriId: 'cid',
    markaId: 'bid',
    minGram: 'gmin',
    maxGram: 'gmax',
    degerIds: 'f',
    yeni: 'yeni',
    indirimli: 'ind',
} as const;

export const LISTING_SORT_BY_VALUES = [
    'katalog',
    'createdAt',
    'urunAdi',
    'fiyat',
] as const;

export const LISTING_SORT_ORDER_VALUES = ['asc', 'desc'] as const;

export type ListingSortBy = (typeof LISTING_SORT_BY_VALUES)[number];
export type ListingSortOrder = (typeof LISTING_SORT_ORDER_VALUES)[number];

export const LISTING_SORT_OPTIONS: {
    sortBy: ListingSortBy;
    sortOrder: ListingSortOrder;
    label: string;
}[] = [
    { sortBy: 'katalog', sortOrder: 'asc', label: 'Önerilen (grup sırası)' },
    { sortBy: 'createdAt', sortOrder: 'desc', label: 'En yeniler' },
    { sortBy: 'urunAdi', sortOrder: 'asc', label: 'Ürün adı (A-Z)' },
    { sortBy: 'fiyat', sortOrder: 'asc', label: 'Fiyat (düşük-yüksek)' },
    { sortBy: 'fiyat', sortOrder: 'desc', label: 'Fiyat (yüksek-düşük)' },
];

export function listingSortKey(sortBy: ListingSortBy, sortOrder: ListingSortOrder): string {
    return `${sortBy}:${sortOrder}`;
}

export function parseListingSort(sortBy: string, sortOrder: string): {
    sortBy: ListingSortBy;
    sortOrder: ListingSortOrder;
} {
    const by = LISTING_SORT_BY_VALUES.includes(sortBy as ListingSortBy)
        ? (sortBy as ListingSortBy)
        : 'katalog';
    const order = sortOrder === 'desc' ? 'desc' : 'asc';
    return { sortBy: by, sortOrder: order };
}

export const listingSearchParamsParsers = {
    kategoriId: parseAsInteger,
    markaId: parseAsInteger,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(24),
    search: parseAsString.withDefault(''),
    sortBy: parseAsStringLiteral(LISTING_SORT_BY_VALUES).withDefault('katalog'),
    sortOrder: parseAsStringLiteral(LISTING_SORT_ORDER_VALUES).withDefault('asc'),
    yeni: parseAsBoolean,
    indirimli: parseAsBoolean,
    minGram: parseAsInteger,
    maxGram: parseAsInteger,
    degerIds: parseAsArrayOf(parseAsInteger).withDefault([]),
};

export const listingSearchParamsSerializer = createSerializer(listingSearchParamsParsers, {
    urlKeys: LISTING_SEARCH_PARAM_KEYS,
});

export type ListingSearchParamsState = inferParserType<typeof listingSearchParamsParsers>;

/** `cid=5&f=81,46` — baştaki `?` olmadan */
export function serializeListingSearchParams(
    state: Partial<ListingSearchParamsState>,
): string {
    const serialized = listingSearchParamsSerializer(state);
    return serialized.startsWith('?') ? serialized.slice(1) : serialized;
}

export function buildProductsListingHref(state: Partial<ListingSearchParamsState>): string {
    const query = serializeListingSearchParams(state);
    return query ? `/products?${query}` : '/products';
}

/** Ürün detay URL'sinden liste parametrelerini ayıkla (v hariç) */
export const LISTING_URL_PARAM_KEYS = new Set<string>(Object.values(LISTING_SEARCH_PARAM_KEYS));

export function pickListingQueryString(searchParams: {
    getAll: (key: string) => string[];
}): string {
    const out = new URLSearchParams();
    for (const key of LISTING_URL_PARAM_KEYS) {
        for (const value of searchParams.getAll(key)) {
            if (value !== '') out.append(key, value);
        }
    }
    return out.toString();
}

export function useProductListingSearchParams() {
    return useQueryStates(listingSearchParamsParsers, {
        urlKeys: LISTING_SEARCH_PARAM_KEYS,
    });
}
