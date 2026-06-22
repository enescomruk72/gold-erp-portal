import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proxyApiClient } from '@/lib/api';
import type { ApiClientError } from '@/lib/api/errors';
import type { ApiResponse } from '@/lib/api/types';
import { cartQueryKeys } from './query-keys';
import type {
    AddB2bCartItemInput,
    B2bCartDTO,
} from './cart-types';

function setCartCache(
    queryClient: ReturnType<typeof useQueryClient>,
    res: ApiResponse<B2bCartDTO>,
) {
    if (res.data) {
        queryClient.setQueryData(cartQueryKeys.all, res);
    } else {
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
    }
}

export function useCartMutations() {
    const queryClient = useQueryClient();

    const addItemMutation = useMutation<ApiResponse<B2bCartDTO>, ApiClientError, AddB2bCartItemInput>({
        mutationFn: (body) => proxyApiClient.post<B2bCartDTO>('/v1/b2b/cart/items', body),
        onSuccess: (res) => setCartCache(queryClient, res),
    });

    const updateNoteMutation = useMutation<
        ApiResponse<B2bCartDTO>,
        ApiClientError,
        { siparisNotu: string }
    >({
        mutationFn: (body) => proxyApiClient.patch<B2bCartDTO>('/v1/b2b/cart/note', body),
        onSuccess: (res) => setCartCache(queryClient, res),
    });

    const updateItemMutation = useMutation<
        ApiResponse<B2bCartDTO>,
        ApiClientError,
        { lineId: string; miktar?: number; urunNotu?: string }
    >({
        mutationFn: ({ lineId, ...body }) =>
            proxyApiClient.patch<B2bCartDTO>(`/v1/b2b/cart/items/${lineId}`, body),
        onSuccess: (res) => setCartCache(queryClient, res),
    });

    const removeItemMutation = useMutation<
        ApiResponse<B2bCartDTO>,
        ApiClientError,
        { lineId: string }
    >({
        mutationFn: ({ lineId }) =>
            proxyApiClient.delete<B2bCartDTO>(`/v1/b2b/cart/items/${lineId}`),
        onSuccess: (res) => setCartCache(queryClient, res),
    });

    const clearCartMutation = useMutation<ApiResponse<B2bCartDTO>, ApiClientError, void>({
        mutationFn: () => proxyApiClient.delete<B2bCartDTO>('/v1/b2b/cart'),
        onSuccess: (res) => setCartCache(queryClient, res),
    });

    return {
        addItemMutation,
        updateNoteMutation,
        updateItemMutation,
        removeItemMutation,
        clearCartMutation,
    };
}
