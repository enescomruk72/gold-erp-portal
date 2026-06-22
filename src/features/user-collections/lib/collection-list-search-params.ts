import { createSerializer, parseAsString, useQueryStates } from 'nuqs';

export const collectionListSearchParamsParsers = {
    search: parseAsString.withDefault(''),
};

export const collectionListSearchParamsSerializer = createSerializer(
    collectionListSearchParamsParsers,
);

export function useCollectionListSearchParams() {
    return useQueryStates(collectionListSearchParamsParsers, {
        history: 'replace',
        shallow: true,
    });
}
