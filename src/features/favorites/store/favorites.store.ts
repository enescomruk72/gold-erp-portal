import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
    productIds: string[];
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            productIds: [],
            toggleFavorite: (productId) => {
                set((state) => {
                    const exists = state.productIds.includes(productId);
                    return {
                        productIds: exists
                            ? state.productIds.filter((id) => id !== productId)
                            : [...state.productIds, productId],
                    };
                });
            },
            isFavorite: (productId) => get().productIds.includes(productId),
        }),
        {
            name: 'portal-favorites',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
