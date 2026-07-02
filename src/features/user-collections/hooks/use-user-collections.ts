'use client';

import { useCallback, useMemo } from 'react';
import { useGetUserCollections } from '@/features/user-collections/api/use-get-user-collections';
import { useUserCollectionMutations } from '@/features/user-collections/api/use-user-collection-mutations';

export function useUserCollections(enabled = true) {
    const query = useGetUserCollections(undefined, enabled);
    const mutations = useUserCollectionMutations();

    const collections = useMemo(() => {
        const items = query.data?.data?.items ?? [];
        return [...items].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }, [query.data?.data?.items]);

    const accessDenied =
        query.error?.statusCode === 403 || query.error?.statusCode === 401;
    const hasCollectionAccess = !accessDenied;

    const createCollection = useCallback(
        async (ad: string, aciklama?: string) => {
            if (!hasCollectionAccess) return;
            await mutations.createCollectionMutation.mutateAsync({
                ad,
                ...(aciklama?.trim() ? { aciklama: aciklama.trim() } : {}),
            });
        },
        [mutations.createCollectionMutation, hasCollectionAccess],
    );

    const addProductToCollection = useCallback(
        async (collectionId: string, urunKodu: string) => {
            if (!hasCollectionAccess) return;
            await mutations.addItemMutation.mutateAsync({ collectionId, urunKodu });
        },
        [mutations.addItemMutation, hasCollectionAccess],
    );

    const removeProductFromCollection = useCallback(
        async (collectionId: string, urunKodu: string) => {
            if (!hasCollectionAccess) return;
            await mutations.removeItemMutation.mutateAsync({ collectionId, urunKodu });
        },
        [mutations.removeItemMutation, hasCollectionAccess],
    );

    const deleteCollection = useCallback(
        async (collectionId: string) => {
            if (!hasCollectionAccess) return;
            await mutations.deleteCollectionMutation.mutateAsync({ collectionId });
        },
        [mutations.deleteCollectionMutation, hasCollectionAccess],
    );

    const updateCollection = useCallback(
        async (collectionId: string, ad: string) => {
            if (!hasCollectionAccess) return;
            await mutations.updateCollectionMutation.mutateAsync({ collectionId, ad });
        },
        [mutations.updateCollectionMutation, hasCollectionAccess],
    );

    const isMutating =
        mutations.createCollectionMutation.isPending ||
        mutations.updateCollectionMutation.isPending ||
        mutations.addItemMutation.isPending ||
        mutations.removeItemMutation.isPending ||
        mutations.deleteCollectionMutation.isPending;

    return {
        collections,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isMutating,
        hasCollectionAccess,
        error: query.error,
        createCollection,
        updateCollection,
        addProductToCollection,
        removeProductFromCollection,
        deleteCollection,
    };
}
