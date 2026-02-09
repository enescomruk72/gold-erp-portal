/**
 * Cart Store - B2B Portal
 * Sepet yönetimi, localStorage persist
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IProductDTO } from "@/features/products/types";
import { getMockProductImageUrl } from "@/features/products/lib/mock-product-images";

export interface ICartItem {
    productId: string;
    urunKodu: string;
    urunAdi: string;
    imageUrl?: string;
    birimAdi: string;
    birimKodu: string;
    kategoriAdi?: string;
    markaAdi?: string;
    miktar: number;
    birimFiyat: number;
    kdvOrani: number;
    agirlikGr?: number;
    /** Has milyem (örn. 916 = 22 ayar altın) */
    hasMilyem?: number;
    /** İşçilik milyem */
    iscilikMilyem?: number;
    satirAraToplam: number;
    satirKdvTutari: number;
    satirToplam: number;
    addedAt: string;
}

interface CartState {
    items: ICartItem[];
}

interface CartActions {
    addItem: (product: IProductDTO, miktar?: number, customBirimFiyat?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, miktar: number) => void;
    incrementQuantity: (productId: string, amount?: number) => void;
    decrementQuantity: (productId: string, amount?: number) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string) => number;
}

function calcTotals(
    birimFiyat: number,
    miktar: number,
    kdvOrani: number
): Pick<ICartItem, "satirAraToplam" | "satirKdvTutari" | "satirToplam"> {
    const satirAraToplam = birimFiyat * miktar;
    const satirKdvTutari = satirAraToplam * (kdvOrani / 100);
    const satirToplam = satirAraToplam + satirKdvTutari;
    return {
        satirAraToplam: Math.round(satirAraToplam * 100) / 100,
        satirKdvTutari: Math.round(satirKdvTutari * 100) / 100,
        satirToplam: Math.round(satirToplam * 100) / 100,
    };
}

function createCartItem(
    product: IProductDTO,
    miktar: number,
    customBirimFiyat?: number
): ICartItem {
    const birimFiyat =
        customBirimFiyat != null ? customBirimFiyat : (product.satisFiyati ?? 0);
    const kdvOrani = product.kdvOrani ?? 0;
    const totals = calcTotals(birimFiyat, miktar, kdvOrani);
    const imageUrl =
        product.images?.find((img) => img.varsayilanMi)?.url ??
        product.images?.[0]?.url ??
        getMockProductImageUrl(0);

    return {
        productId: product.id,
        urunKodu: product.urunKodu,
        urunAdi: product.urunAdi,
        imageUrl,
        birimAdi: product.birim?.birimAdi ?? "Adet",
        birimKodu: product.birim?.birimKodu ?? "ADET",
        kategoriAdi: product.kategori?.kategoriAdi,
        markaAdi: product.marka?.markaAdi,
        miktar,
        birimFiyat,
        kdvOrani,
        agirlikGr: product.agirlikGr,
        hasMilyem: product.hasMilyem,
        iscilikMilyem: product.iscilikMilyem,
        ...totals,
        addedAt: new Date().toISOString(),
    };
}

export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, miktar = 1, customBirimFiyat) => {
                set((state) => {
                    const idx = state.items.findIndex(
                        (i) => i.productId === product.id
                    );
                    let newItems: ICartItem[];
                    if (idx >= 0) {
                        const item = state.items[idx];
                        const newMiktar = item.miktar + miktar;
                        const totals = calcTotals(
                            item.birimFiyat,
                            newMiktar,
                            item.kdvOrani
                        );
                        newItems = state.items.map((i, j) =>
                            j === idx ? { ...i, miktar: newMiktar, ...totals } : i
                        );
                    } else {
                        newItems = [
                            ...state.items,
                            createCartItem(product, miktar, customBirimFiyat),
                        ];
                    }
                    return { items: newItems };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.productId !== productId),
                }));
            },

            updateQuantity: (productId, miktar) => {
                if (miktar <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.productId !== productId) return item;
                        const totals = calcTotals(
                            item.birimFiyat,
                            miktar,
                            item.kdvOrani
                        );
                        return { ...item, miktar, ...totals };
                    }),
                }));
            },

            incrementQuantity: (productId, amount = 1) => {
                const item = get().items.find((i) => i.productId === productId);
                if (item) get().updateQuantity(productId, item.miktar + amount);
            },

            decrementQuantity: (productId, amount = 1) => {
                const item = get().items.find((i) => i.productId === productId);
                if (item) get().updateQuantity(productId, item.miktar - amount);
            },

            clearCart: () => set({ items: [] }),

            isInCart: (productId) =>
                get().items.some((i) => i.productId === productId),

            getItemQuantity: (productId) => {
                const item = get().items.find((i) => i.productId === productId);
                return item?.miktar ?? 0;
            },
        }),
        {
            name: "gold-erp-portal-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ items: s.items }),
            version: 1,
        }
    )
);

export const useCartTotalQuantity = () =>
    useCartStore((s) =>
        s.items.reduce((sum, item) => sum + item.miktar, 0)
    );

export const useCartItemCount = () =>
    useCartStore((s) => s.items.length);
