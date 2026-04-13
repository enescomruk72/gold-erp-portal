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

export interface IProductMateryalDetailDTO {
    id: number;
    materyalAdi: string;
    milyemKatsayisi?: number;
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
    materyal?: IProductMateryalDetailDTO;
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
    materyalId?: number;
    katalogdaGoster?: boolean;
    yeni?: boolean;
    indirimli?: boolean;
    images: IProductImageDTO[];
    bakiyeCount?: number;
    aile?: { id: string; aileAdi: string; aileKodu: string };
    createdAt: string;
    updatedAt: string;
}
