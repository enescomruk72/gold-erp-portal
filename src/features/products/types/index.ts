/**
 * B2B Portal - Ürün tipleri
 * Backend B2B ürün DTO (b2b-product) ile uyumlu
 */

export type ProductImageProcessingStatus =
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";

export interface IProductImageDTO {
    id: string;
    /** Tamamlanmadıysa null */
    url: string | null;
    dosyaAdi?: string;
    dosyaTipi?: string;
    siraNo: number;
    varsayilanMi: boolean;
    processingStatus?: ProductImageProcessingStatus;
    processingErrorMessage?: string | null;
}

export interface IProductKategoriDetailDTO {
    id: number;
    kategoriKodu: string;
    kategoriAdi: string;
    tahminiUretimGun?: number | null;
}

export interface IProductMarkaDetailDTO {
    id: number;
    markaAdi: string;
}

export interface IProductBirimDetailDTO {
    id: number;
    birimKodu: string;
    birimAdi: string;
}

export interface IProductAyarDetailDTO {
    id: number;
    ayarAdi: string;
    milyemKatsayisi?: number;
}

export interface IProductOzellikItemDTO {
    ozellikId: number;
    ozellikAdi?: string;
    degerler: Array<{ degerId: number; degerAdi?: string }>;
}

export interface IProductGrupDTO {
    id: string;
    grupAdi: string;
    grupKodu: string;
}

export interface IProductVaryantGramajItemDTO {
    gram: number;
    label?: string;
}

export interface IProductGramajOzetiDTO {
    min: number;
    max: number;
    items: IProductVaryantGramajItemDTO[];
}

export interface IProductDTO {
    id: string;
    urunKodu: string;
    urunModelKodu: string;
    urunAdi: string;
    kategoriId: number;
    markaId?: number;
    birimId: number;
    kategori?: IProductKategoriDetailDTO;
    marka?: IProductMarkaDetailDTO;
    birim?: IProductBirimDetailDTO;
    ayar?: IProductAyarDetailDTO;
    /** Gram — backend: ortalamaAgirlik */
    ortalamaAgirlik?: number;
    /** @deprecated Backend artık göndermiyor; ortalamaAgirlik kullanın */
    agirlikGr?: number;
    satisFiyati?: number;
    kdvOrani?: number;
    /** Has milyem (örn. 916 = 22 ayar altın) — ürün adından türetilebilir */
    hasMilyem?: number;
    iscilikMilyem?: number;
    karMilyem?: number;
    iscilikAdet?: number;
    iscilikTipi?: string;
    milyemKatsayisi?: number;
    tasAgirlikGr?: number;
    tahminiUretimGun?: number | null;
    aciklama?: string;
    aktifMi: boolean;
    ayarId?: number;
    katalogdaGoster?: boolean;
    yeni?: boolean;
    indirimli?: boolean;
    images: IProductImageDTO[];
    bakiyeCount?: number;
    grup?: IProductGrupDTO;
    ozellikler?: IProductOzellikItemDTO[];
    publicSlug?: string | null;
    gramajOzeti?: IProductGramajOzetiDTO;
    /** @deprecated grup kullanın */
    aile?: { id: string; aileAdi: string; aileKodu: string };
    createdAt: string;
    updatedAt: string;
}
