export type ICartItemVariantSelection = {
    axisLabel: string;
    valueLabel: string;
};

export type AddItemOptions = {
    urunNotu?: string;
    varyantId?: string;
    /** add: sepetteki miktara ekler (varsayılan), set: miktarı doğrudan atar */
    quantityMode?: 'add' | 'set';
    variantSelections?: ICartItemVariantSelection[];
    birimOrtalamaAgirlikGr?: number;
};

export interface ICartItem {
    /** Backend sepet satırı id */
    lineKey: string;
    productId: string;
    varyantId?: string;
    urunKodu: string;
    urunAdi: string;
    imageUrl?: string;
    ayarAdi?: string;
    birimAdi: string;
    birimKodu: string;
    kategoriAdi?: string;
    markaAdi?: string;
    urunNotu?: string;
    variantSelections?: ICartItemVariantSelection[];
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
}
