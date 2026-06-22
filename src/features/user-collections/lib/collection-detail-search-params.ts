import {
    createSerializer,
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from 'nuqs';

export const collectionDetailSearchParamsParsers = {
    search: parseAsString.withDefault(''),
    kategoriId: parseAsInteger,
    markaId: parseAsInteger,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(24),
    add: parseAsBoolean,
};

export const collectionDetailSearchParamsSerializer = createSerializer(
    collectionDetailSearchParamsParsers,
);

export function useCollectionDetailSearchParams() {
    return useQueryStates(collectionDetailSearchParamsParsers, {
        history: 'replace',
        shallow: true,
    });
}
