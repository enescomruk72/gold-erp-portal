/**
 * Cart Store - B2B Portal
 * Sepet yönetimi, localStorage persist
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IProductDTO } from "@/features/products/types";
import { getMockProductImageUrl } from "@/features/products/lib/mock-product-images";
import { buildCartLineKey } from "@/features/cart/lib/cart-line-key";

export type ICartItemVariantSelection = {
    axisLabel: string;
    valueLabel: string;
};

export type AddItemOptions = {
    urunNotu?: string;
    /** add: sepetteki miktara ekler (varsayılan), set: miktarı doğrudan atar */
    quantityMode?: "add" | "set";
    variantSelections?: ICartItemVariantSelection[];
    birimOrtalamaAgirlikGr?: number;
};

export interface ICartItem {
    /** productId + slicer/varianter kombinasyonu */
    lineKey: string;
    productId: string;
    urunKodu: string;
    urunAdi: string;
    imageUrl?: string;
    ayarAdi?: string;
    birimAdi: string;
    birimKodu: string;
    kategoriAdi?: string;
    markaAdi?: string;
    /** Satır bazlı ürün notu */
    urunNotu?: string;
    /** Sepete eklenirken seçili slicer / varianter değerleri */
    variantSelections?: ICartItemVariantSelection[];
    /** Adet başına ortalama gramaj (sepete ekleme anı) */
    birimOrtalamaAgirlikGr?: number;
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
    siparisNotu: string;
}

interface CartActions {
    addItem: (
        product: IProductDTO,
        miktar?: number,
        customBirimFiyat?: number,
        options?: AddItemOptions
    ) => void;
    setSiparisNotu: (not: string) => void;
    updateItemNote: (lineKey: string, urunNotu: string) => void;
    removeItem: (lineKey: string) => void;
    updateQuantity: (lineKey: string, miktar: number) => void;
    incrementQuantity: (lineKey: string, amount?: number) => void;
    decrementQuantity: (lineKey: string, amount?: number) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string) => number;
    findItemByVariant: (
        productId: string,
        variantSelections?: ICartItemVariantSelection[]
    ) => ICartItem | undefined;
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
    customBirimFiyat?: number,
    options?: Pick<
        AddItemOptions,
        "urunNotu" | "variantSelections" | "birimOrtalamaAgirlikGr"
    >
): ICartItem {
    const variantSelections =
        options?.variantSelections && options.variantSelections.length > 0
            ? options.variantSelections
            : undefined;
    const birimOrtalamaAgirlikGr =
        options?.birimOrtalamaAgirlikGr ??
        product.ortalamaAgirlik ??
        product.agirlikGr;
    const birimFiyat =
        customBirimFiyat != null ? customBirimFiyat : (product.satisFiyati ?? 0);
    const kdvOrani = product.kdvOrani ?? 0;
    const totals = calcTotals(birimFiyat, miktar, kdvOrani);
    const imageUrl =
        product.images?.find((img) => img.varsayilanMi)?.url ??
        product.images?.[0]?.url ??
        null;
    const resolvedImageUrl = imageUrl ?? getMockProductImageUrl(0);

    return {
        lineKey: buildCartLineKey(product.id, variantSelections),
        productId: product.id,
        urunKodu: product.urunKodu,
        urunAdi: product.urunAdi,
        imageUrl: resolvedImageUrl,
        birimAdi: product.birim?.birimAdi ?? "Adet",
        birimKodu: product.birim?.birimKodu ?? "ADET",
        kategoriAdi: product.kategori?.kategoriAdi,
        markaAdi: product.marka?.markaAdi,
        ayarAdi: product.ayar?.ayarAdi,
        urunNotu: options?.urunNotu?.trim() || undefined,
        variantSelections,
        birimOrtalamaAgirlikGr,
        miktar,
        birimFiyat,
        kdvOrani,
        agirlikGr: birimOrtalamaAgirlikGr,
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
            siparisNotu: "",

            addItem: (product, miktar = 1, customBirimFiyat, options) => {
                const quantityMode = options?.quantityMode ?? "add";
                const trimmedNote = options?.urunNotu?.trim();
                const variantSelections = options?.variantSelections;
                const birimOrtalamaAgirlikGr =
                    options?.birimOrtalamaAgirlikGr ??
                    product.ortalamaAgirlik ??
                    product.agirlikGr;
                const lineKey = buildCartLineKey(product.id, variantSelections);

                set((state) => {
                    const idx = state.items.findIndex((i) => i.lineKey === lineKey);
                    let newItems: ICartItem[];
                    if (idx >= 0) {
                        const item = state.items[idx];
                        const newMiktar =
                            quantityMode === "set"
                                ? miktar
                                : item.miktar + miktar;
                        const totals = calcTotals(
                            item.birimFiyat,
                            newMiktar,
                            item.kdvOrani
                        );
                        newItems = state.items.map((i, j) =>
                            j === idx
                                ? {
                                      ...i,
                                      miktar: newMiktar,
                                      ...totals,
                                      ...(trimmedNote !== undefined
                                          ? {
                                                urunNotu: trimmedNote || undefined,
                                            }
                                          : {}),
                                      birimOrtalamaAgirlikGr:
                                          birimOrtalamaAgirlikGr ??
                                          i.birimOrtalamaAgirlikGr,
                                      agirlikGr:
                                          birimOrtalamaAgirlikGr ?? i.agirlikGr,
                                  }
                                : i
                        );
                    } else {
                        newItems = [
                            ...state.items,
                            createCartItem(product, miktar, customBirimFiyat, {
                                urunNotu: trimmedNote,
                                variantSelections,
                                birimOrtalamaAgirlikGr,
                            }),
                        ];
                    }
                    return { items: newItems };
                });
            },

            setSiparisNotu: (not) => set({ siparisNotu: not }),

            updateItemNote: (lineKey, urunNotu) => {
                const trimmed = urunNotu.trim();
                set((state) => ({
                    items: state.items.map((item) =>
                        item.lineKey === lineKey
                            ? { ...item, urunNotu: trimmed || undefined }
                            : item
                    ),
                }));
            },

            removeItem: (lineKey) => {
                set((state) => ({
                    items: state.items.filter((i) => i.lineKey !== lineKey),
                }));
            },

            updateQuantity: (lineKey, miktar) => {
                if (miktar <= 0) {
                    get().removeItem(lineKey);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.lineKey !== lineKey) return item;
                        const totals = calcTotals(
                            item.birimFiyat,
                            miktar,
                            item.kdvOrani
                        );
                        return { ...item, miktar, ...totals };
                    }),
                }));
            },

            incrementQuantity: (lineKey, amount = 1) => {
                const item = get().items.find((i) => i.lineKey === lineKey);
                if (item) get().updateQuantity(lineKey, item.miktar + amount);
            },

            decrementQuantity: (lineKey, amount = 1) => {
                const item = get().items.find((i) => i.lineKey === lineKey);
                if (item) get().updateQuantity(lineKey, item.miktar - amount);
            },

            clearCart: () => set({ items: [], siparisNotu: "" }),

            isInCart: (productId) =>
                get().items.some((i) => i.productId === productId),

            getItemQuantity: (productId) =>
                get()
                    .items.filter((i) => i.productId === productId)
                    .reduce((sum, i) => sum + i.miktar, 0),

            findItemByVariant: (productId, variantSelections) => {
                const lineKey = buildCartLineKey(productId, variantSelections);
                return get().items.find((i) => i.lineKey === lineKey);
            },
        }),
        {
            name: "gold-erp-portal-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ items: s.items, siparisNotu: s.siparisNotu }),
            version: 4,
            migrate: (persisted, version) => {
                const state = persisted as CartState & { items?: ICartItem[] };
                const items = (state.items ?? []).map((item) => ({
                    ...item,
                    lineKey:
                        item.lineKey ??
                        buildCartLineKey(item.productId, item.variantSelections),
                    variantSelections: item.variantSelections ?? undefined,
                    birimOrtalamaAgirlikGr:
                        item.birimOrtalamaAgirlikGr ?? item.agirlikGr,
                }));
                if (version < 4) {
                    return {
                        items,
                        siparisNotu: state.siparisNotu ?? "",
                    };
                }
                return { ...state, items } as CartState;
            },
        }
    )
);

export const useCartTotalQuantity = () =>
    useCartStore((s) =>
        s.items.reduce((sum, item) => sum + item.miktar, 0)
    );

export const useCartItemCount = () =>
    useCartStore((s) => s.items.length);
