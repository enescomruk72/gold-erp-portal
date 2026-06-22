import {
    createSerializer,
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from 'nuqs';

export const favoritesPageSearchParamsParsers = {
    search: parseAsString.withDefault(''),
    kategoriId: parseAsInteger,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(24),
};

export const favoritesPageSearchParamsSerializer = createSerializer(
    favoritesPageSearchParamsParsers,
);

export function useFavoritesPageSearchParams() {
    return useQueryStates(favoritesPageSearchParamsParsers, {
        history: 'replace',
        shallow: true,
    });
}
