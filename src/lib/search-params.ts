import {
    createSerializer,
    inferParserType,
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from 'nuqs';

/** URL'de görünen global liste parametreleri */
export const GLOBAL_SEARCH_PARAM_KEYS = {
    page: 'p',
    limit: 'l',
    search: 'q',
    sortBy: 'sb',
    sortOrder: 'so',
} as const;

export const globalSearchParams = {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(24),
    search: parseAsString.withDefault(''),
    sortBy: parseAsString.withDefault('katalog'),
    sortOrder: parseAsString.withDefault('asc'),
};

export const globalSearchParamsSerializer = createSerializer(globalSearchParams);
export type GlobalSearchParamsType = inferParserType<typeof globalSearchParams>;

export function useGlobalSearchParams() {
    return useQueryStates(globalSearchParams, {
        urlKeys: GLOBAL_SEARCH_PARAM_KEYS,
    });
}
