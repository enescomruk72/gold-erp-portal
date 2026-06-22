import { useApiQuery } from '@/lib/api/hooks';
import type { PaginationMetadata } from '@/lib/api/types';
import { favoritesQueryKeys } from '@/features/cart/api/query-keys';
import type { B2bFavoriteItemDTO, B2bFavoritesDTO } from '@/features/cart/api/cart-types';

export type GetFavoritesListingParams = {
    search?: string;
    kategoriId?: number | null;
    page?: number;
    limit?: number;
};

export function useGetFavoritesListing(params: GetFavoritesListingParams, enabled = true) {
    const query = useApiQuery<B2bFavoriteItemDTO[]>('/v1/b2b/favorites', {
        queryKey: favoritesQueryKeys.listing(params),
        apiOptions: {
            params: {
                view: 'listing',
                page: params.page ?? 1,
                limit: params.limit ?? 24,
                ...(params.search?.trim() ? { search: params.search.trim() } : {}),
                ...(params.kategoriId != null && params.kategoriId > 0
                    ? { kategoriId: params.kategoriId }
                    : {}),
            },
        },
        useProxy: true,
        queryOptions: {
            enabled,
            staleTime: 30_000,
            retry: (count, error) => {
                if (error.statusCode === 403 || error.statusCode === 401) return false;
                return count < 2;
            },
        },
    });

    const items = (query.data?.data ?? []) as B2bFavoriteItemDTO[];
    const pagination = (query.data?.metadata?.pagination ??
        null) as PaginationMetadata | null;
    const total = pagination?.total ?? items.length;
    const filterOptions = query.data?.metadata?.filterOptions as
        | B2bFavoritesDTO['filterOptions']
        | undefined;
    const kategoriOptions =
        filterOptions?.kategoriler?.map((k) => ({
            id: k.id,
            label: k.kategoriAdi,
        })) ?? [];

    return {
        ...query,
        items,
        total,
        pagination,
        filterOptions,
        kategoriOptions,
    };
}
