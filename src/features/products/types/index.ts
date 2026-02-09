/**
 * B2B Portal - Ürün tipleri
 * Backend /b2b/products API response formatına uyumlu
 */

export interface IProductImageDTO {
    id: string;
    url: string;
    dosyaAdi?: string;
    dosyaTipi?: string;
    siraNo: number;
    varsayilanMi: boolean;
}

export interface IProductKategoriDetailDTO {
    id: number;
    kategoriKodu: string;
    kategoriAdi: string;
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

export interface IProductDTO {
    id: string;
    urunKodu: string;
    urunAdi: string;
    kategoriId: number;
    markaId?: number;
    birimId: number;
    kategori?: IProductKategoriDetailDTO;
    marka?: IProductMarkaDetailDTO;
    birim?: IProductBirimDetailDTO;
    agirlikGr?: number;
    alisFiyati?: number;
    satisFiyati?: number;
    kdvOrani?: number;
    /** Has milyem (örn. 916 = 22 ayar altın) */
    hasMilyem?: number;
    /** İşçilik milyem */
    iscilikMilyem?: number;
    aciklama?: string;
    aktifMi: boolean;
    images: IProductImageDTO[];
    createdAt: string;
    updatedAt: string;
}
