'use client';

import { useCallback, useMemo } from 'react';
import type { IProductDTO } from '@/features/products/types';
import { buildCartLineKey } from '@/features/cart/lib/cart-line-key';
import { useGetCart } from '@/features/cart/api/use-get-cart';
import { useCartMutations } from '@/features/cart/api/use-cart-mutations';
import type {
    AddItemOptions,
    ICartItem,
    ICartItemVariantSelection,
} from '@/features/cart/store/cart.types';

export function useCart(enabled = true) {
    const {
        items,
        siparisNotu,
        isLoading,
        isFetching,
        hasCartAccess,
        error,
    } = useGetCart(enabled);

    const {
        addItemMutation,
        updateNoteMutation,
        updateItemMutation,
        removeItemMutation,
        clearCartMutation,
    } = useCartMutations();

    const addItem = useCallback(
        async (
            product: IProductDTO,
            miktar = 1,
            _customBirimFiyat?: number,
            options?: AddItemOptions,
        ) => {
            if (!hasCartAccess) return;

            const quantityMode = options?.quantityMode ?? 'add';
            const existing = items.find((item) => {
                if (item.productId !== product.id) return false;
                if (options?.varyantId) return item.varyantId === options.varyantId;
                return !item.varyantId || items.filter((i) => i.productId === product.id).length === 1;
            });

            if (quantityMode === 'set' && existing) {
                await updateItemMutation.mutateAsync({
                    lineId: existing.lineKey,
                    miktar,
                    ...(options?.urunNotu?.trim()
                        ? { urunNotu: options.urunNotu.trim() }
                        : {}),
                });
                return;
            }

            await addItemMutation.mutateAsync({
                urunId: product.id,
                ...(options?.varyantId ? { varyantId: options.varyantId } : {}),
                miktar,
                ...(options?.urunNotu?.trim()
                    ? { urunNotu: options.urunNotu.trim() }
                    : {}),
            });
        },
        [addItemMutation, updateItemMutation, hasCartAccess, items],
    );

    const setSiparisNotu = useCallback(
        async (not: string) => {
            if (!hasCartAccess) return;
            await updateNoteMutation.mutateAsync({ siparisNotu: not });
        },
        [updateNoteMutation, hasCartAccess],
    );

    const updateItemNote = useCallback(
        async (lineKey: string, urunNotu: string) => {
            if (!hasCartAccess) return;
            await updateItemMutation.mutateAsync({
                lineId: lineKey,
                urunNotu: urunNotu.trim(),
            });
        },
        [updateItemMutation, hasCartAccess],
    );

    const removeItem = useCallback(
        async (lineKey: string) => {
            if (!hasCartAccess) return;
            await removeItemMutation.mutateAsync({ lineId: lineKey });
        },
        [removeItemMutation, hasCartAccess],
    );

    const updateQuantity = useCallback(
        async (lineKey: string, miktar: number) => {
            if (!hasCartAccess) return;
            if (miktar <= 0) {
                await removeItem(lineKey);
                return;
            }
            await updateItemMutation.mutateAsync({ lineId: lineKey, miktar });
        },
        [updateItemMutation, removeItem, hasCartAccess],
    );

    const incrementQuantity = useCallback(
        async (lineKey: string, amount = 1) => {
            const item = items.find((i) => i.lineKey === lineKey);
            if (item) await updateQuantity(lineKey, item.miktar + amount);
        },
        [items, updateQuantity],
    );

    const decrementQuantity = useCallback(
        async (lineKey: string, amount = 1) => {
            const item = items.find((i) => i.lineKey === lineKey);
            if (item) await updateQuantity(lineKey, item.miktar - amount);
        },
        [items, updateQuantity],
    );

    const clearCart = useCallback(async () => {
        if (!hasCartAccess) return;
        await clearCartMutation.mutateAsync();
    }, [clearCartMutation, hasCartAccess]);

    const isInCart = useCallback(
        (productId: string) => items.some((i) => i.productId === productId),
        [items],
    );

    const getItemQuantity = useCallback(
        (productId: string) =>
            items.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.miktar, 0),
        [items],
    );

    const findItemByVariant = useCallback(
        (productId: string, variantSelections?: ICartItemVariantSelection[], varyantId?: string) => {
            if (varyantId) {
                return items.find(
                    (i) => i.productId === productId && i.varyantId === varyantId,
                );
            }
            const lineKey = buildCartLineKey(productId, variantSelections);
            const byLineKey = items.find((i) => i.lineKey === lineKey);
            if (byLineKey) return byLineKey;
            const productLines = items.filter((i) => i.productId === productId);
            return productLines.length === 1 ? productLines[0] : undefined;
        },
        [items],
    );

    const isMutating =
        addItemMutation.isPending ||
        updateNoteMutation.isPending ||
        updateItemMutation.isPending ||
        removeItemMutation.isPending ||
        clearCartMutation.isPending;

    return useMemo(
        () => ({
            items,
            siparisNotu,
            isLoading,
            isFetching,
            isMutating,
            hasCartAccess,
            error,
            addItem,
            setSiparisNotu,
            updateItemNote,
            removeItem,
            updateQuantity,
            incrementQuantity,
            decrementQuantity,
            clearCart,
            isInCart,
            getItemQuantity,
            findItemByVariant,
        }),
        [
            items,
            siparisNotu,
            isLoading,
            isFetching,
            isMutating,
            hasCartAccess,
            error,
            addItem,
            setSiparisNotu,
            updateItemNote,
            removeItem,
            updateQuantity,
            incrementQuantity,
            decrementQuantity,
            clearCart,
            isInCart,
            getItemQuantity,
            findItemByVariant,
        ],
    );
}

export function useCartTotalQuantity() {
    const { items } = useGetCart();
    return useMemo(
        () => items.reduce((sum, item) => sum + item.miktar, 0),
        [items],
    );
}

export function useCartItemCount() {
    const { items } = useGetCart();
    return items.length;
}

export type { ICartItem, AddItemOptions, ICartItemVariantSelection };
