import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proxyApiClient } from '@/lib/api';
import type { ApiClientError } from '@/lib/api/errors';
import type { ApiResponse } from '@/lib/api/types';
import { favoritesQueryKeys } from '@/features/cart/api/query-keys';

export function useFavoriteMutations() {
    const queryClient = useQueryClient();

    const addFavoriteMutation = useMutation<
        ApiResponse<{ urunKodu: string }>,
        ApiClientError,
        { urunKodu: string }
    >({
        mutationFn: (body) => proxyApiClient.post('/v1/b2b/favorites', body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
        },
    });

    const removeFavoriteMutation = useMutation<
        ApiResponse<void>,
        ApiClientError,
        { urunKodu: string }
    >({
        mutationFn: ({ urunKodu }) =>
            proxyApiClient.delete(`/v1/b2b/favorites/${encodeURIComponent(urunKodu)}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
        },
    });

    return { addFavoriteMutation, removeFavoriteMutation };
}
