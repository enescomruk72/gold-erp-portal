import { useApiQuery } from '@/lib/api/hooks';
import { favoritesQueryKeys } from '@/features/cart/api/query-keys';
import type { B2bFavoritesDTO } from '@/features/cart/api/cart-types';

export function useGetFavorites(enabled = true) {
    return useApiQuery<B2bFavoritesDTO>('/v1/b2b/favorites', {
        queryKey: favoritesQueryKeys.all,
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
