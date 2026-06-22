import { useApiQuery } from '@/lib/api/hooks';
import type { PaginationMetadata } from '@/lib/api/types';
import { userCollectionsQueryKeys } from '@/features/cart/api/query-keys';
import type { B2bUserCollectionsDTO, B2bUserCollectionDTO } from '@/features/cart/api/cart-types';

export function useGetUserCollections(search?: string, enabled = true) {
    return useApiQuery<B2bUserCollectionsDTO>('/v1/b2b/user-collections', {
        queryKey: userCollectionsQueryKeys.list(search),
        apiOptions: {
            params: search?.trim() ? { search: search.trim() } : {},
        },
        useProxy: true,
        queryOptions: {
            enabled,
            staleTime: 30_000,
            retry: (count, error) => {
                if (error.statusCode === 403) return false;
                return count < 2;
            },
        },
    });
}

export type GetUserCollectionParams = {
    search?: string;
    kategoriId?: number | null;
    markaId?: number | null;
    page?: number;
    limit?: number;
};

export function useGetUserCollection(
    collectionId: string | null,
    params?: GetUserCollectionParams,
    enabled = true,
) {
    const query = useApiQuery<B2bUserCollectionDTO>(
        collectionId ? `/v1/b2b/user-collections/${collectionId}` : '',
        {
            queryKey: userCollectionsQueryKeys.detail(collectionId ?? '', params),
            apiOptions: {
                params: {
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 24,
                    ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
                    ...(params?.kategoriId != null && params.kategoriId > 0
                        ? { kategoriId: params.kategoriId }
                        : {}),
                    ...(params?.markaId != null && params.markaId > 0
                        ? { markaId: params.markaId }
                        : {}),
                },
            },
            useProxy: true,
            queryOptions: {
                enabled: enabled && Boolean(collectionId),
                staleTime: 30_000,
            },
        },
    );

    const collection = (query.data?.data ?? null) as B2bUserCollectionDTO | null;
    const pagination = (query.data?.metadata?.pagination ??
        null) as PaginationMetadata | null;
    const total = pagination?.total ?? collection?.itemsTotal ?? collection?.items?.length ?? 0;

    return {
        ...query,
        collection,
        total,
        pagination,
    };
}
