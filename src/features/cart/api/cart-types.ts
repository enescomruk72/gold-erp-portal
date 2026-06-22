export type B2bCartVariantSelectionDTO = {
    axisLabel: string;
    valueLabel: string;
};

export type B2bCartLineDTO = {
    id: string;
    urunId: string;
    varyantId: string;
    urunKodu: string;
    urunAdi: string;
    imageUrl?: string;
    ayarAdi?: string;
    birimAdi: string;
    birimKodu: string;
    kategoriAdi?: string;
    markaAdi?: string;
    urunNotu?: string;
    variantSelections: B2bCartVariantSelectionDTO[];
    birimOrtalamaAgirlikGr?: number;
    miktar: number;
    birimFiyat: number;
    kdvOrani: number;
    agirlikGr?: number;
    hasMilyem?: number;
    iscilikMilyem?: number;
    satirAraToplam: number;
    satirKdvTutari: number;
    satirToplam: number;
    addedAt: string;
};

export type B2bCartDTO = {
    id: string;
    siparisNotu: string;
    items: B2bCartLineDTO[];
};

export type AddB2bCartItemInput = {
    urunId: string;
    varyantId?: string;
    miktar: number;
    urunNotu?: string;
};

export type UpdateB2bCartItemInput = {
    lineId: string;
    miktar?: number;
    urunNotu?: string;
};

export type B2bFavoriteItemDTO = {
    id: string;
    urunId: string;
    urunKodu: string;
    createdAt: string;
    product?: import('@/features/products/types').IProductDTO;
};

export type B2bFavoritesDTO = {
    items: B2bFavoriteItemDTO[];
    total?: number;
    filterOptions?: {
        kategoriler: Array<{ id: number; kategoriAdi: string }>;
    };
};

export type B2bUserCollectionDTO = {
    id: string;
    ad: string;
    aciklama?: string;
    siraNo: number;
    createdAt: string;
    updatedAt: string;
    itemCount: number;
    previewImageUrls?: string[];
    itemsTotal?: number;
    filterOptions?: {
        markalar: Array<{ id: number; markaAdi: string }>;
        kategoriler: Array<{ id: number; kategoriAdi: string }>;
    };
    items?: Array<{
        id: string;
        urunId: string;
        urunKodu: string;
        siraNo: number;
        createdAt: string;
        product?: import('@/features/products/types').IProductDTO;
    }>;
};

export type B2bUserCollectionsDTO = {
    items: B2bUserCollectionDTO[];
};
