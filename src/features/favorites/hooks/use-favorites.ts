'use client';

import { useCallback, useMemo } from 'react';
import { useGetFavorites } from '@/features/favorites/api/use-get-favorites';
import { useFavoriteMutations } from '@/features/favorites/api/use-favorite-mutations';

export function useFavorites(enabled = true) {
    const query = useGetFavorites(enabled);
    const { addFavoriteMutation, removeFavoriteMutation } = useFavoriteMutations();

    const items = useMemo(() => query.data?.data?.items ?? [], [query.data?.data?.items]);
    const favoriteUrunKodlari = useMemo(
        () => new Set(items.map((item) => item.urunKodu)),
        [items],
    );
    const favoriteUrunIds = useMemo(
        () => new Set(items.map((item) => item.urunId)),
        [items],
    );

    const accessDenied =
        query.error?.statusCode === 403 || query.error?.statusCode === 401;
    const hasFavoriteAccess = !accessDenied;

    const isFavorite = useCallback(
        (productIdOrUrunKodu: string) =>
            favoriteUrunIds.has(productIdOrUrunKodu) ||
            favoriteUrunKodlari.has(productIdOrUrunKodu),
        [favoriteUrunIds, favoriteUrunKodlari],
    );

    const toggleFavorite = useCallback(
        async (urunKodu: string, urunId?: string) => {
            if (!hasFavoriteAccess) return;
            const favorited =
                favoriteUrunKodlari.has(urunKodu) ||
                (urunId != null && favoriteUrunIds.has(urunId));

            if (favorited) {
                await removeFavoriteMutation.mutateAsync({ urunKodu });
            } else {
                await addFavoriteMutation.mutateAsync({ urunKodu });
            }
        },
        [
            addFavoriteMutation,
            removeFavoriteMutation,
            favoriteUrunKodlari,
            favoriteUrunIds,
            hasFavoriteAccess,
        ],
    );

    const isMutating =
        addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

    return {
        items,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isMutating,
        hasFavoriteAccess,
        error: query.error,
        isFavorite,
        toggleFavorite,
    };
}
