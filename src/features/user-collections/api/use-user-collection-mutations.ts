import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proxyApiClient } from '@/lib/api';
import type { ApiClientError } from '@/lib/api/errors';
import type { ApiResponse } from '@/lib/api/types';
import { userCollectionsQueryKeys } from '@/features/cart/api/query-keys';
import type { B2bUserCollectionDTO } from '@/features/cart/api/cart-types';

function invalidateCollections(queryClient: ReturnType<typeof useQueryClient>, collectionId?: string) {
    queryClient.invalidateQueries({ queryKey: userCollectionsQueryKeys.all });
    if (collectionId) {
        queryClient.invalidateQueries({
            queryKey: userCollectionsQueryKeys.detail(collectionId),
        });
    }
}

export function useUserCollectionMutations() {
    const queryClient = useQueryClient();

    const createCollectionMutation = useMutation<
        ApiResponse<B2bUserCollectionDTO>,
        ApiClientError,
        { ad: string; aciklama?: string }
    >({
        mutationFn: (body) => proxyApiClient.post('/v1/b2b/user-collections', body),
        onSuccess: () => invalidateCollections(queryClient),
    });

    const updateCollectionMutation = useMutation<
        ApiResponse<B2bUserCollectionDTO>,
        ApiClientError,
        { collectionId: string; ad?: string; aciklama?: string }
    >({
        mutationFn: ({ collectionId, ...body }) =>
            proxyApiClient.patch(`/v1/b2b/user-collections/${collectionId}`, body),
        onSuccess: (_, vars) => invalidateCollections(queryClient, vars.collectionId),
    });

    const deleteCollectionMutation = useMutation<
        ApiResponse<void>,
        ApiClientError,
        { collectionId: string }
    >({
        mutationFn: ({ collectionId }) =>
            proxyApiClient.delete(`/v1/b2b/user-collections/${collectionId}`),
        onSuccess: () => invalidateCollections(queryClient),
    });

    const addItemMutation = useMutation<
        ApiResponse<B2bUserCollectionDTO>,
        ApiClientError,
        { collectionId: string; urunKodu: string }
    >({
        mutationFn: ({ collectionId, urunKodu }) =>
            proxyApiClient.post(`/v1/b2b/user-collections/${collectionId}/items`, {
                urunKodu,
            }),
        onSuccess: (_, vars) => invalidateCollections(queryClient, vars.collectionId),
    });

    const removeItemMutation = useMutation<
        ApiResponse<B2bUserCollectionDTO>,
        ApiClientError,
        { collectionId: string; urunKodu: string }
    >({
        mutationFn: ({ collectionId, urunKodu }) =>
            proxyApiClient.delete(
                `/v1/b2b/user-collections/${collectionId}/items/${encodeURIComponent(urunKodu)}`,
            ),
        onSuccess: (_, vars) => invalidateCollections(queryClient, vars.collectionId),
    });

    return {
        createCollectionMutation,
        updateCollectionMutation,
        deleteCollectionMutation,
        addItemMutation,
        removeItemMutation,
    };
}
